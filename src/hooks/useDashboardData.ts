import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
  tier: string;
  created_at: string;
}

interface Credits {
  image_credits: number;
  video_credits: number;
}

interface Generation {
  id: string;
  image_url: string | null;
  prompt: string | null;
  created_at: string;
}

export function useDashboardData() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [generationCount, setGenerationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      setLoading(true);

      const [profileRes, creditsRes, genRes, countRes] = await Promise.all([
        supabase.from("profiles").select("full_name, avatar_url, tier, created_at").eq("id", user.id).single(),
        supabase.from("user_credits").select("image_credits, video_credits").eq("user_id", user.id).single(),
        supabase.from("generations").select("id, image_url, prompt, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(4),
        supabase.from("generations").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (creditsRes.data) setCredits(creditsRes.data);
      if (genRes.data) setGenerations(genRes.data);
      setGenerationCount(countRes.count ?? 0);
      setLoading(false);
    };

    fetchAll();
  }, [user]);

  return { profile, credits, generations, generationCount, loading };
}
