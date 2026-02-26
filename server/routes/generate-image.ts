import { Router, Response } from "express";
import { requireAuth, AuthenticatedRequest, createAdminClient } from "../auth";
import { checkRateLimit } from "../../src/lib/rate-limit";
import { decrypt } from "../../src/lib/encryption";
import { createImageJob } from "../../src/lib/ai/kie-ai";
import { KIE_AI_MODELS } from "../../src/lib/constants";
import { getNegativePrompt } from "../../src/lib/ai/prompt-templates";

export const generateImageRouter = Router();

interface GenerateImageBody {
  productImageUrl: string;
  characterId: string;
  prompt: string;
  scene?: {
    background: string;
    pose: string;
    mood: string;
  };
}

generateImageRouter.post("/", requireAuth, async (req, res: Response) => {
  const { user, supabase } = req as AuthenticatedRequest;

  if (!checkRateLimit(user.id)) {
    res.status(429).json({ error: "Terlalu banyak permintaan. Coba lagi dalam 1 menit." });
    return;
  }

  const body = req.body as GenerateImageBody;

  if (!body.prompt || !body.characterId) {
    res.status(400).json({ error: "Prompt dan karakter wajib diisi." });
    return;
  }

  try {
    const { data: character, error: charError } = await supabase
      .from("characters")
      .select("*")
      .eq("id", body.characterId)
      .single();

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
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("tier")
      .eq("id", user.id)
      .single();

    const tier = profile?.tier || "free";
    let apiKey: string;
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
      apiKey = platformKey;
    } else {
      const { data: keyRow } = await supabase
        .from("user_api_keys")
        .select("encrypted_key")
        .eq("user_id", user.id)
        .eq("provider", "kie_ai")
        .single();

      if (!keyRow) {
        res.status(400).json({ error: "Setup API key dulu di Settings." });
        return;
      }

      apiKey = decrypt(keyRow.encrypted_key);
      usedByok = true;
    }

    const modelKey = "NANO_BANANA_PRO";
    const modelConfig = KIE_AI_MODELS[modelKey];

    const { data: generation, error: insertError } = await supabase
      .from("generations")
      .insert({
        user_id: user.id,
        status: "pending",
        prompt: body.prompt,
        model: modelConfig.name,
        image_url: body.productImageUrl || null,
      })
      .select("id")
      .single();

    if (insertError || !generation) {
      res.status(500).json({ error: "Gagal membuat generasi. Coba lagi." });
      return;
    }

    const heroImageUrl = character?.hero_image_url || undefined;

    const { jobId } = await createImageJob({
      prompt: body.prompt,
      model: modelConfig.name,
      referenceImageUrl: heroImageUrl,
      negativePrompt: getNegativePrompt(),
      apiKey,
    });

    const admin = createAdminClient();
    await admin
      .from("generations")
      .update({
        status: "processing",
      })
      .eq("id", generation.id);

    res.json({
      generationId: generation.id,
      jobId,
      usedByok,
      status: "pending",
    });
  } catch (err) {
    console.error("Generate image error:", err);
    res.status(500).json({ error: "Terjadi kesalahan saat memproses generasi." });
  }
});
