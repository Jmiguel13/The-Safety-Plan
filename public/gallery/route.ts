// src/app/api/version/route.ts
import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function readPkgVersion() {
  try {
    const p = path.join(process.cwd(), "package.json");
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw)?.version || null;
  } catch {
    return null;
  }
}

export async function GET() {
  const version = readPkgVersion();
  const commit =
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GIT_COMMIT ||
    null;

  const builtAt = new Date().toISOString();
  return NextResponse.json({ ok: true, version, commit, builtAt });
}
