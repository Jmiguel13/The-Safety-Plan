// src/app/api/version/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const data = {
    name: "The Safety Plan",
    env: process.env.NODE_ENV ?? "development",
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
    buildId: process.env.VERCEL_BUILDER_ID ?? null,
    now: new Date().toISOString(),
    features: {
      help_strip: process.env.NEXT_PUBLIC_ENABLE_HELP_STRIP !== "0",
      strict_csp: process.env.NEXT_STRICT_CSP === "1",
    },
  };

  return NextResponse.json(data, {
    headers: {
      "cache-control": "no-store, max-age=0",
      "content-type": "application/json; charset=utf-8",
    },
  });
}
