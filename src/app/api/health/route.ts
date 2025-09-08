// src/app/api/health/route.ts
import { NextResponse } from "next/server";
import { getEnv, maskSecret } from "@/lib/env";
import { getSupabase } from "@/lib/ssr-supabase";
import { myShopLink } from "@/lib/amway";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Status = "ok" | "warn" | "error";

type HealthResponse = {
  ok: boolean;
  env: {
    site_url: string;
    supabase_url: string;
    supabase_anon_key: string | null;
    service_key: string | null;
    stripe_key_present: boolean;
    myshop: { base?: string | null; shop_id?: string | null };
  };
  checks: {
    supabase: { status: Status; message?: string };
    stripe: { status: Status; message?: string };
    myshop: { status: Status; url: string };
  };
  meta: {
    now: string;
    commit?: string | null;
  };
};

export async function GET() {
  const env = getEnv();

  // --- Supabase anon read check (non-fatal) ---
  let supabaseStatus: Status = "ok";
  let supabaseMsg: string | undefined;
  try {
    const sb = getSupabase();
    const { error } = await sb.from("kits").select("id").limit(1);
    if (error) {
      supabaseStatus = "warn";
      supabaseMsg = `${error.code ?? ""} ${error.message}`.trim();
    }
  } catch (e) {
    supabaseStatus = "error";
    supabaseMsg = e instanceof Error ? e.message : String(e);
  }

  // --- Stripe key presence check (no network call) ---
  let stripeStatus: Status = "ok";
  let stripeMsg: string | undefined;
  if (!env.STRIPE_SECRET_KEY) {
    stripeStatus = "warn";
    stripeMsg = "STRIPE_SECRET_KEY not set (donations disabled).";
  } else {
    try {
      void stripe; // sanity — client constructed
    } catch (e) {
      stripeStatus = "error";
      stripeMsg = e instanceof Error ? e.message : String(e);
    }
  }

  // --- MyShop link synthesis ---
  const myshopUrl = myShopLink("/", "health");
  const myshopStatus: Status = "ok"; // use `let` so the union isn't narrowed to literal "ok"
  // (Add checks here later if you want to validate the URL)

  // Overall status
  const overallOk =
    supabaseStatus !== "error" &&
    stripeStatus !== "error" &&
    myshopStatus !== "error";

  const body: HealthResponse = {
    ok: overallOk,
    env: {
      site_url: env.NEXT_PUBLIC_SITE_URL,
      supabase_url: env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_anon_key: maskSecret(env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      service_key: maskSecret(env.SUPABASE_SERVICE_ROLE_KEY ?? null),
      stripe_key_present: Boolean(env.STRIPE_SECRET_KEY),
      myshop: {
        base: env.NEXT_PUBLIC_MYSHOP_BASE ?? null,
        shop_id: env.NEXT_PUBLIC_AMWAY_SHOP_ID ?? null,
      },
    },
    checks: {
      supabase: { status: supabaseStatus, message: supabaseMsg },
      stripe: { status: stripeStatus, message: stripeMsg },
      myshop: { status: myshopStatus, url: myshopUrl },
    },
    meta: {
      now: new Date().toISOString(),
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    },
  };

  return NextResponse.json(body);
}
