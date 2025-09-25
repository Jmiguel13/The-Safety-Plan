// src/app/api/track/kit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Payloads accepted from server-side and client-side trackers */
type ClientPayload = {
  type?: "kit_purchase_client";
  session_id?: string | null;
  kit?: string | null;
  amount_total?: number | null; // cents
  currency?: string | null;
  ts?: number | null; // epoch ms
  extra?: unknown;
};

type ServerPayload = {
  type: "kit_purchase_server";
  session_id: string;
  kit?: string | null;
  email?: string | null;
  amount_total?: number | null; // cents
  currency?: string | null;
  meta?: unknown;
};

type DBInsertRow = {
  session_id: string | null;
  kit: string | null;
  amount_total: number | null;
  currency: string | null;
  email: string | null;
  raw: Record<string, unknown> | null;
};

const TABLE_SERVER = "kit_purchases";
const TABLE_CLIENT = "kit_purchase_client_events";

/* ----------------------------- type guards ----------------------------- */

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function asFiniteIntOrNull(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.round(n) : null;
}

function isServerPayload(p: unknown): p is ServerPayload {
  if (!isObject(p)) return false;
  if ((p.type as string) !== "kit_purchase_server") return false;
  return typeof p.session_id === "string" && p.session_id.length > 0;
}

function isClientPayload(p: unknown): p is ClientPayload {
  if (!isObject(p)) return false;
  // allow undefined type for robustness, or explicitly "kit_purchase_client"
  if ("type" in p && p.type !== undefined && p.type !== "kit_purchase_client") return false;
  return true;
}

/* -------------------------------- route -------------------------------- */

export async function POST(req: NextRequest) {
  // Parse JSON early with a clear 400 if invalid
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  // Read env directly, avoid strict validators at import time.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || // preferred for server writes
    ""; // do not fall back to anon for writes

  // If Supabase isn’t configured, no-op but succeed to avoid blocking UX
  const supabaseConfigured = Boolean(supabaseUrl && serviceKey);
  if (!supabaseConfigured) {
    console.warn("[track/kit] Supabase not configured — skipping persist");
    return NextResponse.json({ ok: true, stored: false }, { status: 200 });
  }

  // Build row + table based on payload shape
  let table: typeof TABLE_SERVER | typeof TABLE_CLIENT;
  let row: DBInsertRow;

  if (isServerPayload(payload)) {
    table = TABLE_SERVER;
    row = {
      session_id: payload.session_id ?? null,
      kit: (payload.kit ?? null) as string | null,
      amount_total: asFiniteIntOrNull(payload.amount_total),
      currency: (payload.currency ?? null) as string | null,
      email: (payload.email ?? null) as string | null,
      raw: payload as Record<string, unknown>,
    };
  } else if (isClientPayload(payload)) {
    const p = payload as ClientPayload;
    table = TABLE_CLIENT;
    row = {
      session_id: (p.session_id ?? null) as string | null,
      kit: (p.kit ?? null) as string | null,
      amount_total: asFiniteIntOrNull(p.amount_total),
      currency: (p.currency ?? null) as string | null,
      email: null,
      raw: (payload as Record<string, unknown>) ?? null,
    };
  } else {
    return NextResponse.json({ ok: false, error: "unsupported payload shape" }, { status: 400 });
  }

  // Persist
  try {
    const supabase = createClient(supabaseUrl!, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "x-application-name": "safety-plan-site" } },
    });

    const { error } = await supabase.from(table).insert(row);
    if (error) {
      console.warn("[track/kit] insert failed:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, stored: true }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[track/kit] error:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function GET() {
  // Simple health check that never throws at build
  const ok =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  return NextResponse.json({ ok, tracking: ok });
}
