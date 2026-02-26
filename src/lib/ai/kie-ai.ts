import type { KieAiJobParams, KieAiJobResult, KieAiJobStatusResult } from "@/types/ai";

const KIE_API_BASE = "https://api.kie.ai/api/v1";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function kieRequest<T>(
  method: string,
  path: string,
  apiKey: string,
  body?: Record<string, unknown>,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(`${KIE_API_BASE}${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : RETRY_DELAY_MS * (attempt + 1);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Kie AI API error (${response.status}): ${errorBody}`);
      }

      return (await response.json()) as T;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < MAX_RETRIES - 1) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)));
      }
    }
  }

  throw lastError ?? new Error("Kie AI request failed after retries");
}

export async function createImageJob(params: KieAiJobParams): Promise<KieAiJobResult> {
  const { prompt, model, referenceImageUrl, negativePrompt, apiKey } = params;

  const body: Record<string, unknown> = {
    prompt,
    model,
  };

  if (referenceImageUrl) {
    body.reference_image_url = referenceImageUrl;
  }

  if (negativePrompt) {
    body.negative_prompt = negativePrompt;
  }

  interface CreateJobResponse {
    id?: string;
    job_id?: string;
    data?: { id?: string; job_id?: string };
  }

  const response = await kieRequest<CreateJobResponse>("POST", "/images/generate", apiKey, body);

  const jobId = response.data?.job_id || response.data?.id || response.job_id || response.id;

  if (!jobId) {
    throw new Error("Kie AI did not return a job ID in the response");
  }

  return { jobId };
}

export async function checkJobStatus(
  jobId: string,
  apiKey: string,
): Promise<KieAiJobStatusResult> {
  interface StatusResponse {
    status?: string;
    state?: string;
    result_url?: string;
    output_url?: string;
    image_url?: string;
    error?: string;
    message?: string;
    data?: {
      status?: string;
      state?: string;
      result_url?: string;
      output_url?: string;
      image_url?: string;
      error?: string;
    };
  }

  const response = await kieRequest<StatusResponse>("GET", `/images/jobs/${jobId}`, apiKey);

  const inner = response.data ?? response;
  const rawStatus = (inner.status || inner.state || "pending").toLowerCase();
  const resultUrl = inner.result_url || inner.output_url || inner.image_url;
  const error = inner.error || response.message;

  let status: KieAiJobStatusResult["status"];
  if (rawStatus.includes("complet") || rawStatus === "done" || rawStatus === "success") {
    status = "completed";
  } else if (rawStatus.includes("fail") || rawStatus === "error") {
    status = "failed";
  } else if (rawStatus.includes("process") || rawStatus === "running" || rawStatus === "in_progress") {
    status = "processing";
  } else {
    status = "pending";
  }

  return {
    status,
    ...(resultUrl ? { resultUrl } : {}),
    ...(status === "failed" && error ? { error } : {}),
  };
}

export async function downloadImage(imageUrl: string): Promise<Buffer> {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(`Failed to download image (${response.status}): ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
