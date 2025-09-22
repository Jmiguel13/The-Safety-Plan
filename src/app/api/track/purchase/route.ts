export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

type Body = {
  session_id?: unknown;
  kit?: unknown;
  amount_cents?: unknown;
  currency?: unknown;
  ua?: unknown;
  ts?: unknown;
};

function ok<T>(data: T, init?: number) {
  return NextResponse.json({ ok: true, data }, { status: init ?? 200 });
}
function bad(error: string, init = 400) {
  return NextResponse.json({ ok: false, error }, { status: init });
}

export async function POST(req: NextRequest) {
  let payload: Body;
  try {
    payload = (await req.json()) as Body;
  } catch {
    return bad("Invalid JSON body");
  }

  const session_id = typeof payload.session_id === "string" ? payload.session_id : null;
  if (!session_id) return bad("Missing session_id");

  const kit = typeof payload.kit === "string" ? payload.kit : null;
  const amount_cents =
    typeof payload.amount_cents === "number" && Number.isFinite(payload.amount_cents)
      ? Math.round(payload.amount_cents)
      : null;
  const currency = typeof payload.currency === "string" ? payload.currency : null;
  const ua = typeof payload.ua === "string" ? payload.ua : null;
  const ts =
    typeof payload.ts === "number" && Number.isFinite(payload.ts) ? new Date(payload.ts) : new Date();

  // If Supabase is not configured, still succeed (don’t block UX)
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE) {
    console.warn("[track/purchase] Supabase not configured — skipping persist", {
      session_id,
      kit,
      amount_cents,
      currency,
    });
    return ok({ persisted: false });
  }

  try {
    const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Flexible event table name; create if not exists in your DB:
    // create table if not exists tsp_events (
    //   id uuid primary key default gen_random_uuid(),
    //   kind text not null,
    //   payload jsonb not null,
    //   created_at timestamptz not null default now()
    // );
    const { error } = await admin
      .from("tsp_events")
      .insert([
        {
          kind: "purchase",
          payload: {
            session_id,
            kit,
            amount_cents,
            currency,
            ua,
            ts: ts.toISOString(),
          },
        },
      ]);

    if (error) {
      console.warn("[track/purchase] insert failed:", error);
      return ok({ persisted: false });
    }

    return ok({ persisted: true });
  } catch (e) {
    console.warn("[track/purchase] error:", e);
    return ok({ persisted: false });
  }
}
