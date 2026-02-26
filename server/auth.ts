import type { Request, Response, NextFunction } from "express";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";

export interface AuthenticatedRequest extends Request {
  user: User;
  supabase: SupabaseClient;
}

function getSupabaseConfig(): { url: string; anonKey: string } {
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !anonKey) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY");
  }
  return { url, anonKey };
}

export function createAdminClient(): SupabaseClient {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Autentikasi diperlukan." });
    return;
  }

  const token = authHeader.slice(7);
  const { url, anonKey } = getSupabaseConfig();

  const supabase = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    res.status(401).json({ error: "Token tidak valid atau sudah kedaluwarsa." });
    return;
  }

  (req as AuthenticatedRequest).user = user;
  (req as AuthenticatedRequest).supabase = supabase;
  next();
}
