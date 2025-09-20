// src/lib/supabaseAdmin.ts
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ENV } from "@/lib/env.server";

/**
 * Admin Supabase client (service role).
 * Only use this on the server for trusted admin APIs.
 */
let _admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;

  const url = ENV.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = ENV.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin client is not configured. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  _admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { "X-Client-Info": "safety-plan/admin" } },
  });

  return _admin;
}

/** Back-compat exports (old imports expect these names) */
export const createSupabaseAdmin = getSupabaseAdmin;
export const supabaseAdmin = getSupabaseAdmin();
