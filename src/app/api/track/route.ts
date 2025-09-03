import { NextResponse } from "next/server";
export const runtime = "edge";
export async function POST(_req: Request) {
  void _req;
  return NextResponse.json({ ok: true });
}

