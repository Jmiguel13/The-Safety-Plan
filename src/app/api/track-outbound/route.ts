// app/api/track-outbound/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---- payload & types ----
const BodySchema = z.object({
  /** What was clicked: kit | product | other */
  kind: z.enum(["kit", "product", "other"]),
  /** Identifier for the thing (slug, sku, or arbitrary key) */
  key: z.string().min(1),
  /** Destination URL that was opened */
  url: z.string().url(),
  /** Optional context (e.g., page, section, campaign code) */
  source: z.string().optional(),
});

type Body = z.infer<typeof BodySchema>;

type OutboundRow = {
  id?: string;
  kind: string;
  key: string;
  url: string;
  source: string | null;
  referrer: string | null;
  user_agent: string | null;
  ip: string | null;
  created_at?: string;
};

// ---- helpers ----
function jsonErr(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "safety-plan-admin" } },
  });
}

function getClientIp(req: Request): string | null {
  // Next/Node behind a proxy will set x-forwarded-for
  const h = req.headers.get("x-forwarded-for");
  if (!h) return null;
  // Could be a comma-separated list; first is original client
  const first = h.split(",")[0]?.trim();
  return first || null;
}

// ---- handler ----
export async function POST(req: Request) {
  let bodyUnknown: unknown;
  try {
    bodyUnknown = await req.json();
  } catch {
    return jsonErr("Invalid JSON", 400);
  }

  const parsed = BodySchema.safeParse(bodyUnknown);
  if (!parsed.success) {
    return jsonErr(parsed.error.message, 400);
  }
  const body: Body = parsed.data;

  const referrer = req.headers.get("referer") ?? null;
  const userAgent = req.headers.get("user-agent") ?? null;
  const ip = getClientIp(req);

  const row: OutboundRow = {
    kind: body.kind,
    key: body.key,
    url: body.url,
    source: body.source ?? null,
    referrer,
    user_agent: userAgent,
    ip,
  };

  try {
    const sb = getClient();
    // Adjust table/column names if your schema differs
    const { error } = await sb
      .from("outbound_clicks")
      .insert(row)
      .single();

    if (error) {
      return jsonErr(error.message, 500);
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Insert failed";
    return jsonErr(msg, 500);
  }

  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } }
  );
}
