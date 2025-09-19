import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ENV } from "./env";

/**
 * Admin (service-role) Supabase client.
 * IMPORTANT: Server-only. Never import into client code.
 */
if (!ENV.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL");
}
if (!ENV.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");
}

const adminClient: SupabaseClient = createClient(
  ENV.NEXT_PUBLIC_SUPABASE_URL,
  ENV.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "X-Client-Info": "tsp-admin" } },
  }
);

/** Named export used by most code */
export const supabaseAdmin = adminClient;

/** Factory export (compat for existing imports) */
export function createSupabaseAdmin(): SupabaseClient {
  return adminClient;
}

/** Default export allows: import supabaseAdmin from "@/lib/supabaseAdmin" */
export default supabaseAdmin;
