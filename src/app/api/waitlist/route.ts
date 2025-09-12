// src/app/api/waitlist/route.ts
import { NextResponse } from "next/server";

// Ephemeral in-memory list (dev/prototype only)
const mem: Array<{ email: string; productId: string; ts: number }> = [];

export async function POST(req: Request) {
  try {
    const { email, productId } = await req.json();
    const cleanEmail = String(email ?? "").trim().toLowerCase();
    const cleanProduct = String(productId ?? "").trim();

    if (!cleanEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
      return NextResponse.json({ ok: false, error: "Valid email required." }, { status: 400 });
    }
    if (!cleanProduct) {
      return NextResponse.json({ ok: false, error: "Missing product id." }, { status: 400 });
    }

    mem.push({ email: cleanEmail, productId: cleanProduct, ts: Date.now() });
    console.log("[waitlist] saved", { email: cleanEmail, productId: cleanProduct });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}
