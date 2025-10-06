// src/app/api/subscribe/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const READY = !!SUPABASE_URL && !!SERVICE_KEY;

function admin() {
  if (!READY) throw new Error("Supabase not configured");
  return createClient(SUPABASE_URL!, SERVICE_KEY!, { auth: { persistSession: false } });
}

type SubscribeInput = {
  email?: string;
  name?: string;
  source?: string;
  consent?: string | boolean;
};

type Parsed = {
  email: string;
  name: string;
  source: string;
  consent: boolean;
};

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function toParsed(input: SubscribeInput): Parsed | null {
  const email = (input.email ?? "").toString().trim().toLowerCase();
  if (!email || !isValidEmail(email)) return null;

  const name = (input.name ?? "").toString().trim().slice(0, 200);
  const source = (input.source ?? "subscribe_page").toString().trim().slice(0, 120);
  const consentRaw = input.consent;
  const consent =
    typeof consentRaw === "boolean"
      ? consentRaw
      : (consentRaw ?? "true").toString().toLowerCase() !== "false";

  return { email, name, source, consent };
}

async function readBody(req: Request): Promise<SubscribeInput> {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const data = (await req.json()) as unknown;
    if (data && typeof data === "object") return data as SubscribeInput;
    return {};
  }
  // allow form posts too
  const fd = await req.formData().catch(() => null);
  if (!fd) return {};
  const obj: Record<string, string> = {};
  fd.forEach((v, k) => (obj[k] = v.toString()));
  return obj as SubscribeInput;
}

export async function POST(req: Request) {
  try {
    const raw = await readBody(req);
    const parsed = toParsed(raw);
    if (!parsed) {
      return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
    }

    if (!READY) {
      console.warn("[/api/subscribe] Supabase keys missing; skipping insert");
      return NextResponse.json({ ok: true, queued: true });
    }

    const sb = admin();
    const { error } = await sb
      .from("newsletter_subscribers")
      .upsert(
        {
          email: parsed.email,
          name: parsed.name,
          source: parsed.source,
          consent: parsed.consent,
          unsubscribed_at: null,
        },
        { onConflict: "email" }
      );

    if (error) {
      console.error("[/api/subscribe] upsert error:", error);
      return NextResponse.json({ ok: false, error: "Database error." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/subscribe] error:", err);
    return NextResponse.json({ ok: false, error: "Unexpected error." }, { status: 500 });
  }
}
