import { Router, Response } from "express";
import { requireAuth, AuthenticatedRequest } from "../auth";

export const creditsRouter = Router();

creditsRouter.get("/", requireAuth, async (req, res: Response) => {
  const { user, supabase } = req as AuthenticatedRequest;

  try {
    const [creditsResult, profileResult] = await Promise.all([
      supabase
        .from("user_credits")
        .select("image_credits, video_credits")
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("profiles")
        .select("tier, is_lifetime")
        .eq("id", user.id)
        .single(),
    ]);

    const credits = creditsResult.data;
    const profile = profileResult.data;

    res.json({
      imageCredits: credits?.image_credits ?? 0,
      videoCredits: credits?.video_credits ?? 0,
      tier: profile?.tier ?? "free",
      isLifetime: profile?.is_lifetime ?? false,
    });
  } catch (err) {
    console.error("Credits fetch error:", err);
    res.status(500).json({ error: "Gagal mengambil data kredit." });
  }
});
