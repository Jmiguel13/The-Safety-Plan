// src/lib/supabase-admin.ts
import "server-only";
import { getSupabaseAdmin } from "./supabaseAdmin";

/** Primary export */
export { getSupabaseAdmin };

/** Back-compat aliases */
export const createSupabaseAdmin = getSupabaseAdmin;
export const supabaseAdmin = getSupabaseAdmin();
