// src/app/api/waitlist/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

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

    const { error } = await supabaseAdmin.from("waitlist").insert({
      email: cleanEmail,
      product_id: cleanProduct,
    });

    if (error) {
      // Log on server; do not leak details to client
      console.error("[waitlist] insert error:", error);
      return NextResponse.json({ ok: false, error: "Unable to save. Try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[waitlist] bad request:", e);
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}

