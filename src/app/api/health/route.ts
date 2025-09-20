// src/app/api/health/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Status = "ok" | "warn" | "error";

type HealthResponse = {
  ok: boolean;
  env: {
    site_url: string | null;
    supabase_url: string | null;
    supabase_anon_key: string | null; // masked
    service_key: string | null;       // masked
    stripe_key_present: boolean;
    myshop: { url: string | null };
  };
  checks: {
    supabase: {
      status: Status;
      message?: string;
      auth_health?: { ok: boolean; status?: number; error?: string };
    };
    stripe: { status: Status; message?: string };
    myshop: { status: Status; url?: string | null; message?: string };
  };
  meta: { now: string; commit: string | null };
};

function env(name: string): string | null {
  return process.env[name] ?? null;
}

function maskSecret(v: string | null): string | null {
  if (!v) return null;
  const s = String(v);
  if (s.length <= 8) return "*".repeat(s.length);
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
}

async function probeSupabaseAuth(baseUrl: string) {
  const url = `${baseUrl.replace(/\/+$/, "")}/auth/v1/health`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 3000);
  try {
    const r = await fetch(url, { cache: "no-store", signal: ctrl.signal });
    return { ok: r.ok, status: r.status } as const;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg } as const;
  } finally {
    clearTimeout(t);
  }
}

export async function GET() {
  const SITE_URL = env("NEXT_PUBLIC_SITE_URL");
  const SUPABASE_URL = env("NEXT_PUBLIC_SUPABASE_URL");
  const SUPABASE_ANON = env("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const SUPABASE_SERVICE = env("SUPABASE_SERVICE_ROLE_KEY");
  const STRIPE_SECRET = env("STRIPE_SECRET_KEY");
  const MYSHOP_URL = env("NEXT_PUBLIC_AMWAY_MYSHOP_URL");

  // Supabase: presence + optional live Auth health (doesn't require secrets)
  const supabaseAuth = SUPABASE_URL ? await probeSupabaseAuth(SUPABASE_URL) : null;

  const supabase: HealthResponse["checks"]["supabase"] = (() => {
    if (!SUPABASE_URL || !SUPABASE_ANON) {
      return {
        status: "error",
        message:
          "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
      };
    }
    if (supabaseAuth && !supabaseAuth.ok) {
      return {
        status: "warn",
        message: "Supabase Auth health check failed",
        auth_health: {
          ok: false,
          status: "status" in supabaseAuth ? supabaseAuth.status : undefined,
          error: "error" in supabaseAuth ? supabaseAuth.error : undefined,
        },
      };
    }
    return {
      status: "ok",
      message: "Supabase URL and anon key present",
      auth_health: supabaseAuth ? { ok: true, status: supabaseAuth.status } : undefined,
    };
  })();

  const stripe: HealthResponse["checks"]["stripe"] = STRIPE_SECRET
    ? { status: "ok", message: "Stripe secret key present" }
    : { status: "error", message: "Missing STRIPE_SECRET_KEY" };

  const myshop: HealthResponse["checks"]["myshop"] = (() => {
    if (!MYSHOP_URL) {
      return { status: "error", url: null, message: "NEXT_PUBLIC_AMWAY_MYSHOP_URL is missing" };
    }
    try {
      const u = new URL(MYSHOP_URL);
      if (!/^https?:$/i.test(u.protocol)) throw new Error("must be http/https");
      return { status: "ok", url: MYSHOP_URL };
    } catch {
      return { status: "error", url: MYSHOP_URL, message: "NEXT_PUBLIC_AMWAY_MYSHOP_URL is invalid" };
    }
  })();

  const overallOk =
    supabase.status !== "error" &&
    stripe.status !== "error" &&
    myshop.status !== "error";

  const body: HealthResponse = {
    ok: overallOk,
    env: {
      site_url: SITE_URL,
      supabase_url: SUPABASE_URL,
      supabase_anon_key: maskSecret(SUPABASE_ANON),
      service_key: maskSecret(SUPABASE_SERVICE),
      stripe_key_present: Boolean(STRIPE_SECRET),
      myshop: { url: MYSHOP_URL },
    },
    checks: { supabase, stripe, myshop },
    meta: {
      now: new Date().toISOString(),
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    },
  };

  return NextResponse.json(body, {
    status: overallOk ? 200 : 500,
    headers: {
      "cache-control": "no-store, max-age=0",
      "content-type": "application/json; charset=utf-8",
    },
  });
}
