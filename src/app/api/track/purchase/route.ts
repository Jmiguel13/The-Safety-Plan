// src/app/api/track/purchase/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Generic client/server purchase payload (flexible; we store raw) */
type PurchasePayload = Record<string, unknown>;

function getClientIp(req: NextRequest): string | undefined {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    undefined
  );
}

export async function POST(req: NextRequest) {
  // Parse JSON early with a clear 400 if invalid
  let payload: PurchasePayload;
  try {
    payload = (await req.json()) as PurchasePayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  // Read env directly — no strict validators at import time
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""; // server-only
  const table = process.env.PURCHASE_TRACK_TABLE; // e.g., "purchase_events"

  // If Supabase or table isn’t configured, no-op (don’t block UX or builds)
  if (!supabaseUrl || !serviceKey || !table) {
    console.warn("[track/purchase] tracking disabled (missing SUPABASE or PURCHASE_TRACK_TABLE)");
    return NextResponse.json({ ok: true, stored: false }, { status: 200 });
  }

  // Compose row; keep schema minimal and future-proof
  const row = {
    ts: new Date().toISOString(),
    ip: getClientIp(req) ?? null,
    ua: req.headers.get("user-agent") ?? null,
    raw: payload, // full payload for analysis
  } as const;

  try {
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "x-application-name": "safety-plan-site" } },
    });

    const { error } = await supabase.from(table).insert(row as unknown as Record<string, unknown>);
    if (error) {
      console.warn("[track/purchase] insert failed:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, stored: true }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[track/purchase] error:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function GET() {
  // Health check that never throws at build
  const ok = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  return NextResponse.json({
    ok,
    tracking: ok && !!process.env.PURCHASE_TRACK_TABLE,
  });
}
