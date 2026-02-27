import { Router, Response, Request } from "express";

export const byokValidateRouter = Router();

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const KIE_API_BASE = "https://api.kie.ai/api/v1";
const KLING_API_BASE = "https://api.klingai.com/v1";

async function validateGemini(key: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${GEMINI_API_BASE}/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Say OK" }] }],
          generationConfig: { maxOutputTokens: 5 },
        }),
      },
    );

    if (response.ok) return { valid: true };

    const data = await response.json().catch(() => null);
    if (response.status === 401 || response.status === 403) {
      return { valid: false, error: "API key tidak valid. Periksa kembali." };
    }
    return { valid: false, error: data?.error?.message || "API key tidak valid. Periksa kembali." };
  } catch {
    return { valid: false, error: "Gagal terhubung ke provider. Coba lagi." };
  }
}

async function validateKieAi(key: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch(`${KIE_API_BASE}/models`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) return { valid: true };

    if (response.status === 401 || response.status === 403) {
      return { valid: false, error: "API key tidak valid. Periksa kembali." };
    }
    return { valid: false, error: "API key tidak valid. Periksa kembali." };
  } catch {
    return { valid: false, error: "Gagal terhubung ke provider. Coba lagi." };
  }
}

async function validateKling(key: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch(`${KLING_API_BASE}/models`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) return { valid: true };

    if (response.status === 401 || response.status === 403) {
      return { valid: false, error: "API key tidak valid. Periksa kembali." };
    }
    return { valid: false, error: "API key tidak valid. Periksa kembali." };
  } catch {
    return { valid: false, error: "Gagal terhubung ke provider. Coba lagi." };
  }
}

byokValidateRouter.post("/", async (req: Request, res: Response) => {
  const { provider, key } = req.body as { provider: string; key: string };

  if (!provider || !key) {
    res.status(400).json({ error: "Provider dan key wajib diisi." });
    return;
  }

  try {
    let result: { valid: boolean; error?: string };

    switch (provider) {
      case "gemini":
        result = await validateGemini(key);
        break;
      case "kie_ai":
        result = await validateKieAi(key);
        break;
      case "kling":
        result = await validateKling(key);
        break;
      default:
        res.status(400).json({ error: "Provider tidak valid. Gunakan: kie_ai, gemini, atau kling." });
        return;
    }

    res.json(result);
  } catch (err) {
    console.error("BYOK validate error:", err);
    res.status(500).json({ valid: false, error: "Gagal terhubung ke provider. Coba lagi." });
  }
});
