// src/app/api/version/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const version =
    process.env.APP_VERSION ||
    process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
    "dev";
  const commit = process.env.VERCEL_GIT_COMMIT_SHA || null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || null;

  return NextResponse.json({
    name: "The Safety Plan",
    version,
    commit,
    siteUrl,
    ts: new Date().toISOString(),
  });
}

