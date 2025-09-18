// src/app/api/health/route.ts
import { NextResponse } from "next/server";

type HealthResponse = {
  ok: boolean;
  env: {
    site_url: string | null;
    supabase_url: string | null;
    supabase_anon_key: string | null;
    service_key: string | null;
    stripe_key_present: boolean;
    myshop: {
      url: string | null;
    };
  };
  checks: {
    supabase: { status: "ok" | "warn" | "error"; message?: string };
    stripe: { status: "ok" | "warn" | "error"; message?: string };
    myshop: { status: "ok" | "warn" | "error"; url?: string | null; message?: string };
  };
  meta: {
    now: string;
    commit: string | null;
  };
};

/** Local helpers (no external imports) */
function env(name: string): string | null {
  return process.env[name] ?? null;
}
function maskSecret(v: string | null): string | null {
  if (!v) return null;
  const s = String(v);
  if (s.length <= 8) return "*".repeat(s.length);
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
}

export async function GET() {
  // Read env once
  const SITE_URL = env("NEXT_PUBLIC_SITE_URL");
  const SUPABASE_URL = env("NEXT_PUBLIC_SUPABASE_URL");
  const SUPABASE_ANON = env("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const SUPABASE_SERVICE = env("SUPABASE_SERVICE_ROLE_KEY");
  const STRIPE_SECRET = env("STRIPE_SECRET_KEY");
  const MYSHOP_URL = env("NEXT_PUBLIC_AMWAY_MYSHOP_URL");

  // --- Basic, synchronous “is configured” checks ---
  const supabase: HealthResponse["checks"]["supabase"] =
    SUPABASE_URL && SUPABASE_ANON
      ? { status: "ok", message: "Supabase URL and anon key present" }
      : { status: "error", message: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY" };

  const stripe: HealthResponse["checks"]["stripe"] =
    !!STRIPE_SECRET
      ? { status: "ok", message: "Stripe secret key present" }
      : { status: "error", message: "Missing STRIPE_SECRET_KEY" };

  const myshop: HealthResponse["checks"]["myshop"] =
    MYSHOP_URL && /^https?:\/\//i.test(MYSHOP_URL)
      ? { status: "ok", url: MYSHOP_URL }
      : { status: "error", url: MYSHOP_URL, message: "NEXT_PUBLIC_AMWAY_MYSHOP_URL is missing or invalid" };

  const overallOk = supabase.status !== "error" && stripe.status !== "error" && myshop.status !== "error";

  const body: HealthResponse = {
    ok: overallOk,
    env: {
      site_url: SITE_URL,
      supabase_url: SUPABASE_URL,
      supabase_anon_key: maskSecret(SUPABASE_ANON),
      service_key: maskSecret(SUPABASE_SERVICE),
      stripe_key_present: Boolean(STRIPE_SECRET),
      myshop: {
        url: MYSHOP_URL,
      },
    },
    checks: {
      supabase,
      stripe,
      myshop,
    },
    meta: {
      now: new Date().toISOString(),
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    },
  };

  return NextResponse.json(body, { status: overallOk ? 200 : 500 });
}

