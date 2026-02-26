import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { IncomingMessage } from "http";

function assertServerOnly(): void {
  if (typeof window !== "undefined") {
    throw new Error("Server-side Supabase client cannot be used in the browser");
  }
}

function getSupabaseConfig(): { url: string; anonKey: string } {
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase configuration: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be set",
    );
  }

  return { url, anonKey };
}

function extractAccessToken(req: IncomingMessage): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return null;
}

export function createServerSupabaseClient(req: IncomingMessage): SupabaseClient {
  assertServerOnly();
  const { url, anonKey } = getSupabaseConfig();
  const accessToken = extractAccessToken(req);

  if (!accessToken) {
    throw new Error("Missing Authorization header. Send 'Bearer <token>' from the client.");
  }

  return createClient(url, anonKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function createAdminSupabaseClient(): SupabaseClient {
  assertServerOnly();
  const url = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing admin Supabase configuration: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
