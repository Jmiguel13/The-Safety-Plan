// src/app/api/track/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type EventBody = {
  type: string;
  payload?: Record<string, unknown>;
};

export async function POST(req: Request) {
  let body: EventBody | null = null;
  try {
    body = (await req.json()) as EventBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body?.type) {
    return NextResponse.json({ ok: false, error: "Missing event type" }, { status: 400 });
  }

  try {
    if (supabaseAdmin) {
      await supabaseAdmin.from("events").insert({
        type: body.type,
        payload: body.payload ?? {},
        created_at: new Date().toISOString(),
      });
    } else {
      console.log("⚠️ Track (no DB):", body);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Use POST" }, { status: 405, headers: { Allow: "POST" } });
}
