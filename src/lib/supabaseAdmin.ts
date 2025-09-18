// src/lib/supabaseAdmin.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Admin (service-role) Supabase client.
 * IMPORTANT: Only import this from server-side code (API routes, server components).
 * Never expose the service role key to the browser.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL) {
  throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL");
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");
}

const adminClient: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { headers: { "X-Client-Info": "tsp-admin" } },
});

/** Named export used by most code */
export const supabaseAdmin = adminClient;

/** Factory export (compat for existing imports) */
export function createSupabaseAdmin(): SupabaseClient {
  return adminClient;
}

/** Default export allows: import supabaseAdmin from "@/lib/supabaseAdmin" */
export default supabaseAdmin;
