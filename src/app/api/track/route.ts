// src/app/api/track/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type EventPayload = Record<string, unknown>;

function clientIp(req: NextRequest): string | undefined {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    undefined
  );
}

export async function POST(req: NextRequest) {
  let payload: EventPayload;
  try {
    payload = (await req.json()) as EventPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const table = process.env.SITE_TRACK_TABLE; // e.g. "site_events"

  if (!supabaseUrl || !serviceKey || !table) {
    return NextResponse.json({ ok: true, stored: false }, { status: 200 });
  }

  const row = {
    created_at: new Date().toISOString(),
    ip: clientIp(req) ?? null,
    ua: req.headers.get("user-agent") ?? null,
    raw: payload
  };

  try {
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "x-application-name": "safety-plan-site" } }
    });

    const { error } = await supabase.from(table).insert(row as Record<string, unknown>);
    if (error) {
      console.warn("[track] insert failed:", error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, stored: true }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[track] error:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function GET() {
  const ok = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  return NextResponse.json({ ok, tracking: ok && !!process.env.SITE_TRACK_TABLE });
}
