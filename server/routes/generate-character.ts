import { Router, Response } from "express";
import { requireAuth, AuthenticatedRequest, createAdminClient } from "../auth";
import { checkRateLimit } from "../../src/lib/rate-limit";
import { decrypt } from "../../src/lib/encryption";
import { buildIdentityPrompt } from "../../src/lib/ai/gemini";
import { createImageJob, checkJobStatus, downloadImage } from "../../src/lib/ai/kie-ai";
import { assembleCharacterPrompt, getNegativePrompt } from "../../src/lib/ai/prompt-templates";
import { addWatermark } from "../../src/lib/watermark";
import { SHOT_MODEL_MAP, KIE_AI_MODELS, GENERATION_POLL_INTERVAL, MAX_POLL_ATTEMPTS } from "../../src/lib/constants";
import type { CharacterConfig, ShotType } from "../../src/types/ai";

export const generateCharacterRouter = Router();

const SHOT_TYPES: ShotType[] = [
  "hero_portrait",
  "profile_3_4",
  "talking",
  "full_body",
  "skin_detail",
  "product_interaction",
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pollJobUntilDone(
  jobId: string,
  apiKey: string,
): Promise<{ resultUrl: string } | { error: string }> {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    await sleep(GENERATION_POLL_INTERVAL);

    const status = await checkJobStatus(jobId, apiKey);

    if (status.status === "completed" && status.resultUrl) {
      return { resultUrl: status.resultUrl };
    }

    if (status.status === "failed") {
      return { error: status.error || "Generation failed" };
    }
  }

  return { error: "Generation timed out" };
}

interface CharacterRequestBody {
  characterConfig: CharacterConfig;
  name: string;
  geminiApiKey?: string;
}

generateCharacterRouter.post("/", requireAuth, async (req, res: Response) => {
  const { user, supabase } = req as AuthenticatedRequest;

  if (!checkRateLimit(user.id)) {
    res.status(429).json({ error: "Terlalu banyak permintaan. Coba lagi dalam 1 menit." });
    return;
  }

  const body = req.body as CharacterRequestBody;

  if (!body.characterConfig || !body.characterConfig.gender || !body.name) {
    res.status(400).json({ error: "Konfigurasi karakter dan nama wajib diisi." });
    return;
  }

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier")
      .eq("id", user.id)
      .single();

    const tier = profile?.tier || "free";
    let kieApiKey: string;
    let usedByok = false;

    if (tier === "free") {
      const { data: credits } = await supabase
        .from("user_credits")
        .select("image_credits")
        .eq("user_id", user.id)
        .single();

      if (!credits || credits.image_credits <= 0) {
        res.status(403).json({ error: "Kredit habis! Upgrade ke BYOK." });
        return;
      }

      const platformKey = process.env.PLATFORM_KIE_AI_KEY;
      if (!platformKey) {
        res.status(500).json({ error: "Konfigurasi server bermasalah. Hubungi admin." });
        return;
      }
      kieApiKey = platformKey;
    } else {
      const { data: keyRow } = await supabase
        .from("user_api_keys")
        .select("encrypted_key")
        .eq("user_id", user.id)
        .eq("provider", "kie_ai")
        .single();

      if (!keyRow) {
        res.status(400).json({ error: "Setup API key Kie AI dulu di Settings." });
        return;
      }
      kieApiKey = decrypt(keyRow.encrypted_key);
      usedByok = true;
    }

    let geminiApiKey = body.geminiApiKey;
    if (!geminiApiKey) {
      const { data: geminiRow } = await supabase
        .from("user_api_keys")
        .select("encrypted_key")
        .eq("user_id", user.id)
        .eq("provider", "gemini")
        .single();

      if (geminiRow) {
        geminiApiKey = decrypt(geminiRow.encrypted_key);
      }
    }

    if (!geminiApiKey) {
      const platformGemini = process.env.PLATFORM_GEMINI_KEY;
      if (!platformGemini) {
        res.status(400).json({
          error: "API key Gemini diperlukan untuk generate karakter. Setup di Settings.",
        });
        return;
      }
      geminiApiKey = platformGemini;
    }

    const identityPrompt = await buildIdentityPrompt(body.characterConfig, geminiApiKey);

    const shotJobs = await Promise.allSettled(
      SHOT_TYPES.map(async (shotType) => {
        const modelKey = SHOT_MODEL_MAP[shotType];
        const modelConfig = KIE_AI_MODELS[modelKey];

        const fullPrompt = assembleCharacterPrompt({
          identityPrompt,
          shotType,
        });

        const { jobId } = await createImageJob({
          prompt: fullPrompt,
          model: modelConfig.name,
          negativePrompt: getNegativePrompt(),
          apiKey: kieApiKey,
        });

        return { shotType, jobId, modelKey, prompt: fullPrompt };
      }),
    );

    const activeJobs: Array<{ shotType: ShotType; jobId: string; modelKey: string; prompt: string }> = [];
    const failedShots: Array<{ shotType: ShotType; error: string }> = [];

    for (const result of shotJobs) {
      if (result.status === "fulfilled") {
        activeJobs.push(result.value);
      } else {
        const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
        failedShots.push({ shotType: "hero_portrait", error: reason });
      }
    }

    const admin = createAdminClient();
    const characterId = crypto.randomUUID();
    const shotResults: Array<{
      shotType: ShotType;
      url: string;
      model: string;
      prompt: string;
    }> = [];

    await Promise.allSettled(
      activeJobs.map(async (job) => {
        const pollResult = await pollJobUntilDone(job.jobId, kieApiKey);

        if ("error" in pollResult) {
          failedShots.push({ shotType: job.shotType, error: pollResult.error });
          return;
        }

        let imageBuffer = await downloadImage(pollResult.resultUrl);

        if (tier === "free" && job.shotType === "hero_portrait") {
          imageBuffer = await addWatermark(imageBuffer);
        }

        const storagePath = `characters/${user.id}/${characterId}/${job.shotType}.jpg`;

        const { error: uploadError } = await admin.storage
          .from("characters")
          .upload(storagePath, imageBuffer, {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (uploadError) {
          console.error(`Upload error for ${job.shotType}:`, uploadError);
          failedShots.push({ shotType: job.shotType, error: "Upload failed" });
          return;
        }

        const { data: publicUrl } = admin.storage
          .from("characters")
          .getPublicUrl(storagePath);

        shotResults.push({
          shotType: job.shotType,
          url: publicUrl.publicUrl,
          model: KIE_AI_MODELS[job.modelKey].name,
          prompt: job.prompt,
        });
      }),
    );

    const heroShot = shotResults.find((s) => s.shotType === "hero_portrait");
    const referenceImages = shotResults.map((s) => s.url);
    const shotMetadata: Record<string, { url: string; model: string; prompt: string }> = {};
    for (const shot of shotResults) {
      shotMetadata[shot.shotType] = {
        url: shot.url,
        model: shot.model,
        prompt: shot.prompt,
      };
    }

    const { error: charInsertError } = await supabase
      .from("characters")
      .insert({
        id: characterId,
        user_id: user.id,
        name: body.name,
        gender: body.characterConfig.gender,
        age_range: body.characterConfig.age_range || null,
        style: body.characterConfig.outfit || null,
        tags: [
          body.characterConfig.gender === "female" ? "Wanita" : "Pria",
          body.characterConfig.age_range,
          body.characterConfig.outfit,
        ].filter(Boolean),
        description: identityPrompt.slice(0, 500),
        config: {
          ...body.characterConfig,
          identity_prompt: identityPrompt,
          shot_metadata: shotMetadata,
          reference_images: referenceImages,
        },
        hero_image_url: heroShot?.url || null,
        is_preset: false,
      });

    if (charInsertError) {
      console.error("Character insert error:", charInsertError);
      res.status(500).json({ error: "Gagal menyimpan karakter." });
      return;
    }

    if (tier === "free") {
      const { data: credits } = await admin
        .from("user_credits")
        .select("image_credits")
        .eq("user_id", user.id)
        .single();

      if (credits) {
        await admin
          .from("user_credits")
          .update({ image_credits: Math.max(0, credits.image_credits - 1) })
          .eq("user_id", user.id);
      }
    }

    res.json({
      characterId,
      shots: shotResults.map((s) => ({
        type: s.shotType,
        url: s.url,
      })),
      failedShots: failedShots.length > 0 ? failedShots : undefined,
      usedByok,
      status: "completed",
    });
  } catch (err) {
    console.error("Generate character error:", err);
    res.status(500).json({ error: "Terjadi kesalahan saat membuat karakter." });
  }
});
