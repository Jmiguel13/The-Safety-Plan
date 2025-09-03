// app/api/health/route.ts
import { NextResponse } from "next/server";

type HealthPayload = {
  ok: true;
  service: "safety-plan";
  time: string;        // ISO date
  timestamp: number;   // ms since epoch
  uptimeSec: number | null;
  env: string;         // NODE_ENV / fallback
};

function getUptimeSec(): number | null {
  try {
    // Works in Node; Edge may not have process.uptime
    if (typeof process !== "undefined" && typeof process.uptime === "function") {
      return Math.round(process.uptime());
    }
  } catch {
    // ignore
  }
  return null;
}

export function GET() {
  const now = Date.now();
  const payload: HealthPayload = {
    ok: true,
    service: "safety-plan",
    time: new Date(now).toISOString(),
    timestamp: now,
    uptimeSec: getUptimeSec(),
    env: process.env.NODE_ENV ?? "unknown",
  };

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}
