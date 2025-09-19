// src/lib/ssr-supabase.ts
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ENV } from "@/lib/env";

/**
 * Lightweight server-side client for read-only queries during build/SSR.
 * Uses the public anon key (NOT the service role key).
 */
export function getSupabase(): SupabaseClient {
  return createClient(ENV.NEXT_PUBLIC_SUPABASE_URL, ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "X-Client-Info": "tsp-ssr" } },
  });
}

export type SSRSupabase = ReturnType<typeof getSupabase>;
