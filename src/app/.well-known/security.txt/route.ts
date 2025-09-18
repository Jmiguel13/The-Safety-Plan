// src/app/.well-known/security.txt/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const body = [
    "Contact: mailto:security@thesafetyplan.example",
    "Expires: 2030-01-01T00:00:00Z",
    "Preferred-Languages: en",
    "Canonical: https://example.com/.well-known/security.txt",
  ].join("\n");
  return new NextResponse(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

