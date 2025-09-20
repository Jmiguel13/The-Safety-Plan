// src/app/api/supabase/ping/route.ts
import { NextResponse } from "next/server";
// ❌ remove: import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET() { // ❌ was GET(_req: NextRequest)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null;

  return NextResponse.json({
    ok: Boolean(url && anon),
    supabase: {
      url,
      anon_key_present: Boolean(anon),
    },
    meta: { now: new Date().toISOString() },
  });
}
