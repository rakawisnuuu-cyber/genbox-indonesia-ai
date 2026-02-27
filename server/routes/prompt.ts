import { Router, Response } from "express";
import { requireAuth, AuthenticatedRequest, createAdminClient } from "../auth";
import { checkRateLimit } from "../../src/lib/rate-limit";
import { decrypt } from "../../src/lib/encryption";
import { analyzeProduct, buildUGCPrompt } from "../../src/lib/ai/gemini";

export const promptRouter = Router();

interface PromptRequestBody {
  productImageUrl: string;
  characterId: string;
  scene?: {
    background: string;
    pose: string;
    mood: string;
  };
}

promptRouter.post("/", requireAuth, async (req, res: Response) => {
  const { user, supabase } = req as AuthenticatedRequest;

  if (!checkRateLimit(user.id)) {
    res.status(429).json({ error: "Terlalu banyak permintaan. Coba lagi dalam 1 menit." });
    return;
  }

  const body = req.body as PromptRequestBody;

  if (!body.productImageUrl || !body.characterId) {
    res.status(400).json({ error: "Product image URL dan karakter wajib diisi." });
    return;
  }

  try {
    const { data: character, error: charError } = await supabase
      .from("characters")
      .select("*")
      .eq("id", body.characterId)
      .single();

    let charData = character;

    if (charError || !character) {
      const admin = createAdminClient();
      const { data: presetChar } = await admin
        .from("characters")
        .select("*")
        .eq("id", body.characterId)
        .eq("is_preset", true)
        .single();

      if (!presetChar) {
        res.status(404).json({ error: "Karakter tidak ditemukan." });
        return;
      }
      charData = presetChar;
    }

    let geminiKey: string | undefined;

    const { data: geminiRow } = await supabase
      .from("user_api_keys")
      .select("encrypted_key")
      .eq("user_id", user.id)
      .eq("provider", "gemini")
      .single();

    if (geminiRow) {
      geminiKey = decrypt(geminiRow.encrypted_key);
    }

    if (!geminiKey) {
      geminiKey = process.env.PLATFORM_GEMINI_KEY;
    }

    if (!geminiKey) {
      res.status(500).json({ error: "Konfigurasi Gemini bermasalah. Hubungi admin." });
      return;
    }

    const productAnalysis = await analyzeProduct(body.productImageUrl, geminiKey);

    const characterConfig = charData.config || {};
    const identityPrompt = characterConfig.identity_prompt || charData.description || "";

    const prompt = await buildUGCPrompt({
      productAnalysis,
      character: {
        identityPrompt,
        heroImageUrl: charData.hero_image_url || undefined,
      },
      scene: body.scene || { background: "clean minimal", pose: "natural", mood: "confident" },
      geminiApiKey: geminiKey,
    });

    res.json({ prompt, productAnalysis });
  } catch (err) {
    console.error("Prompt enhancement error:", err);
    res.status(500).json({ error: "Gagal membuat prompt. Coba lagi." });
  }
});
