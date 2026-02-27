import { Router, Response } from "express";
import { requireAuth, AuthenticatedRequest } from "../auth";
import { encrypt, decrypt } from "../../src/lib/encryption";

export const byokRouter = Router();

const VALID_PROVIDERS = ["kie_ai", "gemini", "kling"] as const;
type Provider = (typeof VALID_PROVIDERS)[number];

function isValidProvider(value: string): value is Provider {
  return VALID_PROVIDERS.includes(value as Provider);
}

byokRouter.post("/", requireAuth, async (req, res: Response) => {
  const { user, supabase } = req as AuthenticatedRequest;

  const { provider, key } = req.body as { provider: string; key: string };

  if (!provider || !key) {
    res.status(400).json({ error: "Provider dan key wajib diisi." });
    return;
  }

  if (!isValidProvider(provider)) {
    res.status(400).json({ error: "Provider tidak valid. Gunakan: kie_ai, gemini, atau kling." });
    return;
  }

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier, is_lifetime")
      .eq("id", user.id)
      .single();

    if (!profile || profile.tier !== "byok" || !profile.is_lifetime) {
      res.status(403).json({ error: "Upgrade ke BYOK Lifetime dulu." });
      return;
    }

    const encryptedKey = encrypt(key);
    const now = new Date().toISOString();

    const { error: upsertError } = await supabase
      .from("user_api_keys")
      .upsert(
        {
          user_id: user.id,
          provider,
          encrypted_key: encryptedKey,
          is_valid: true,
          last_validated_at: now,
          updated_at: now,
        },
        { onConflict: "user_id,provider" },
      );

    if (upsertError) {
      console.error("BYOK upsert error:", upsertError);
      res.status(500).json({ error: "Gagal menyimpan API key." });
      return;
    }

    res.json({ success: true, message: "API key berhasil disimpan!" });
  } catch (err) {
    console.error("BYOK save error:", err);
    res.status(500).json({ error: "Terjadi kesalahan saat menyimpan API key." });
  }
});

byokRouter.delete("/", requireAuth, async (req, res: Response) => {
  const { user, supabase } = req as AuthenticatedRequest;

  const { provider } = req.body as { provider: string };

  if (!provider || !isValidProvider(provider)) {
    res.status(400).json({ error: "Provider tidak valid." });
    return;
  }

  try {
    const { error } = await supabase
      .from("user_api_keys")
      .delete()
      .eq("user_id", user.id)
      .eq("provider", provider);

    if (error) {
      console.error("BYOK delete error:", error);
      res.status(500).json({ error: "Gagal menghapus API key." });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    console.error("BYOK delete error:", err);
    res.status(500).json({ error: "Terjadi kesalahan saat menghapus API key." });
  }
});
