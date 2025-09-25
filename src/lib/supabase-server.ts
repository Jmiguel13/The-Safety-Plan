// src/lib/supabase-server.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Server-side Supabase with safe env handling. Returns null if not configured. */
export function getSupabaseServer(): SupabaseClient | null {
  const url: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Prefer the service role if provided, fall back to anon
  const service: string | undefined =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env["SUPABASE_SERVICE_ROLE"];

  const key = service || anon;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false },
    global: { fetch },
  });
}
