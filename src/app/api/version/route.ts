// src/app/api/version/route.ts
import { NextResponse } from "next/server";
import { ENV, ENV_PUBLIC, maskSecret } from "@/lib/env";

export async function GET() {
  const payload = {
    ok: true,
    app: "The Safety Plan",
    env: process.env.NODE_ENV,
    now: new Date().toISOString(),
    siteUrl: ENV_PUBLIC.NEXT_PUBLIC_SITE_URL,
    myshopUrl: ENV_PUBLIC.NEXT_PUBLIC_AMWAY_MYSHOP_URL ?? null,
    supabase: {
      url: ENV_PUBLIC.NEXT_PUBLIC_SUPABASE_URL,
      anonKeyMasked: maskSecret(ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      hasServiceRoleKey: Boolean(ENV.SUPABASE_SERVICE_ROLE_KEY),
    },
  };

  return NextResponse.json(payload, { status: 200 });
}
