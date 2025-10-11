import { NextResponse } from "next/server";

type Body = { email?: string; list?: string; note?: string };

function isEmail(v?: string) {
  return !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

async function maybeForwardToWebhook(payload: Record<string, unknown>) {
  const url = process.env.WAITLIST_WEBHOOK_URL;
  if (!url) return;
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Upstream error (${r.status})`);
}

async function maybeInsertSupabase(row: Record<string, unknown>) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return;

  const resp = await fetch(`${base}/rest/v1/waitlist`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "content-type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`Supabase error (${resp.status}) ${text?.slice(0, 300)}`);
  }
}

/**
 * Waitlist endpoint
 * - Validates email
 * - Inserts a row into Supabase (table: waitlist) when envs exist
 * - Optionally forwards to WAITLIST_WEBHOOK_URL
 */
export async function POST(req: Request) {
  let data: Body = {};
  try {
    data = (await req.json()) as Body;
  } catch {
    // ignore bad JSON; fall through to invalid email response
  }

  const email = (data.email || "").trim().toLowerCase();
  const list = (data.list || "general").trim();
  const note = (data.note || "").trim();

  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "";
  const ua = req.headers.get("user-agent") ?? "";
  const ts = new Date().toISOString();

  const payload = { email, list, note, ip, user_agent: ua, created_at: ts };

  try {
    await Promise.allSettled([
      maybeInsertSupabase(payload),
      maybeForwardToWebhook(payload),
    ]);
  } catch (err) {
    // surface upstream-ish issues to caller so they can retry
    const msg = err instanceof Error ? err.message : "Upstream error";
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }

  return NextResponse.json({ ok: true, email, list });
}
