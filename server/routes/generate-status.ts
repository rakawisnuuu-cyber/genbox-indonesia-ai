import { Router, Response } from "express";
import { requireAuth, AuthenticatedRequest, createAdminClient } from "../auth";
import { decrypt } from "../../src/lib/encryption";
import { checkJobStatus, downloadImage } from "../../src/lib/ai/kie-ai";
import { addWatermark } from "../../src/lib/watermark";

export const generateStatusRouter = Router();

generateStatusRouter.get("/:id/status", requireAuth, async (req, res: Response) => {
  const { user, supabase } = req as AuthenticatedRequest;
  const generationId = req.params.id;

  try {
    const { data: generation, error } = await supabase
      .from("generations")
      .select("*")
      .eq("id", generationId)
      .eq("user_id", user.id)
      .single();

    if (error || !generation) {
      res.status(404).json({ error: "Generasi tidak ditemukan." });
      return;
    }

    if (generation.status === "completed") {
      res.json({
        status: "completed",
        resultUrl: generation.image_url,
      });
      return;
    }

    if (generation.status === "failed") {
      res.json({
        status: "failed",
        error: "Generasi gagal. Coba lagi.",
      });
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("tier")
      .eq("id", user.id)
      .single();

    const tier = profile?.tier || "free";
    let apiKey: string;

    if (tier === "free") {
      const platformKey = process.env.PLATFORM_KIE_AI_KEY;
      if (!platformKey) {
        res.status(500).json({ error: "Konfigurasi server bermasalah." });
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
        res.status(400).json({ error: "API key tidak ditemukan." });
        return;
      }
      apiKey = decrypt(keyRow.encrypted_key);
    }

    const providerJobId = (generation as Record<string, unknown>).provider_job_id as string | undefined;
    if (!providerJobId) {
      res.json({ status: "processing" });
      return;
    }

    const jobStatus = await checkJobStatus(providerJobId, apiKey);

    if (jobStatus.status === "pending" || jobStatus.status === "processing") {
      res.json({ status: "processing" });
      return;
    }

    if (jobStatus.status === "failed") {
      const admin = createAdminClient();
      await admin
        .from("generations")
        .update({ status: "failed" })
        .eq("id", generationId);

      res.json({
        status: "failed",
        error: "Generasi gagal. Coba lagi.",
      });
      return;
    }

    if (jobStatus.status === "completed" && jobStatus.resultUrl) {
      let imageBuffer = await downloadImage(jobStatus.resultUrl);

      if (tier === "free") {
        imageBuffer = await addWatermark(imageBuffer);
      }

      const admin = createAdminClient();
      const storagePath = `generations/${user.id}/image/${generationId}.jpg`;

      const { error: uploadError } = await admin.storage
        .from("generations")
        .upload(storagePath, imageBuffer, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        res.status(500).json({ error: "Gagal menyimpan gambar." });
        return;
      }

      const { data: publicUrl } = admin.storage
        .from("generations")
        .getPublicUrl(storagePath);

      await admin
        .from("generations")
        .update({
          status: "completed",
          image_url: publicUrl.publicUrl,
        })
        .eq("id", generationId);

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
        status: "completed",
        resultUrl: publicUrl.publicUrl,
      });
      return;
    }

    res.json({ status: "processing" });
  } catch (err) {
    console.error("Status check error:", err);
    res.status(500).json({ error: "Gagal memeriksa status generasi." });
  }
});
