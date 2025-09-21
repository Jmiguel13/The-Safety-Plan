// src/app/api/track/kit/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ClientPayload = {
  type?: "kit_purchase_client";
  session_id?: string | null;
  kit?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  ts?: number | null;
};

type ServerPayload = {
  type?: "kit_purchase_server";
  session_id?: string;
  kit?: string;
  email?: string | null;
  amount_total?: number | null;
  currency?: string | null;
};

type DBInsertRow = {
  session_id: string | null;
  kit: string | null;
  amount_total: number | null;
  currency: string | null;
  email: string | null;
  raw: object | null;
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isServerPayload(p: unknown): p is ServerPayload {
  return (
    isObject(p) &&
    ("type" in p ? (p as { type?: string }).type === "kit_purchase_server" : false)
  );
}

function isClientPayload(p: unknown): p is ClientPayload {
  return (
    isObject(p) &&
    // if provided, must match client type; or allow undefined for robustness
    (!("type" in p) || (p as { type?: string | undefined }).type === "kit_purchase_client")
  );
}

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  const isSupabaseConfigured = !!(supabaseUrl && serviceKey);

  let payloadUnknown: unknown = null;
  try {
    payloadUnknown = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  if (!isSupabaseConfigured) {
    // Minimal console trace when DB isn’t configured
    console.log("kit tracking (no-db)", payloadUnknown);
    return NextResponse.json({ ok: true, stored: false });
  }

  const sb = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "safety-plan-site" } },
  });

  try {
    let tableName: "kit_purchases" | "kit_purchase_client_events";
    let row: DBInsertRow;

    if (isServerPayload(payloadUnknown)) {
      tableName = "kit_purchases";
      row = {
        session_id: payloadUnknown.session_id ?? null,
        kit: payloadUnknown.kit ?? null,
        amount_total: payloadUnknown.amount_total ?? null,
        currency: payloadUnknown.currency ?? null,
        email: payloadUnknown.email ?? null,
        raw: payloadUnknown as object,
      };
    } else if (isClientPayload(payloadUnknown)) {
      tableName = "kit_purchase_client_events";
      row = {
        session_id: payloadUnknown.session_id ?? null,
        kit: payloadUnknown.kit ?? null,
        amount_total: payloadUnknown.amount_total ?? null,
        currency: payloadUnknown.currency ?? null,
        email: null,
        raw: payloadUnknown as object,
      };
    } else {
      return NextResponse.json({ ok: false, error: "unsupported payload shape" }, { status: 400 });
    }

    const { error } = await sb.from(tableName).insert(row);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
