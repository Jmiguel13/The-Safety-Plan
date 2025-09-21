export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

function siteBase() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

type Body = { priceId?: string; quantity?: number };

export async function POST(req: Request) {
  try {
    const { priceId, quantity = 1 } = (await req.json()) as Body;

    if (!priceId || typeof priceId !== "string" || !priceId.startsWith("price_")) {
      return NextResponse.json({ error: "Invalid priceId" }, { status: 400 });
    }

    const site = siteBase();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${site}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/shop`,
      allow_promotion_codes: true,
      line_items: [{ price: priceId, quantity: Math.max(1, Number(quantity || 1)) }],
      client_reference_id: `price:${priceId}`,
      metadata: { tsp_kind: "gear" },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    console.error("Stripe price checkout error:", err);
    return NextResponse.json({ error: "Checkout unavailable" }, { status: 502 });
  }
}
