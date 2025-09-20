// src/lib/ssr-supabase.ts
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ENV } from "@/lib/env.server";

/**
 * Lightweight server-side client for read-only operations.
 * Uses the anon key; safe for server components and API routes.
 */
let _server: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient {
  if (_server) return _server;

  const url = ENV.NEXT_PUBLIC_SUPABASE_URL;
  const anon = ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      "Supabase SSR client is not configured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  _server = createClient(url, anon, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: { "X-Client-Info": "safety-plan/ssr" },
    },
  });

  return _server;
}
