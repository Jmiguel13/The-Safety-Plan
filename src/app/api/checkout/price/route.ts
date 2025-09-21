import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function siteBase() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

type Body = { priceId?: unknown; quantity?: unknown };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    const priceId = typeof body?.priceId === "string" ? body.priceId : "";
    const quantity = Math.max(1, Number(body?.quantity ?? 1)) || 1;

    if (!priceId) {
      return NextResponse.json({ error: "Missing Stripe price id" }, { status: 400 });
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    const site = siteBase();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      allow_promotion_codes: true,
      success_url: `${site}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/shop?canceled=1`,
      line_items: [{ price: priceId, quantity }],
      client_reference_id: `price:${priceId}`,
      metadata: {
        tsp_kind: "standalone_price",
        tsp_price_id: priceId,
        tsp_qty: String(quantity),
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    console.error("Stripe price checkout error:", err);
    return NextResponse.json(
      { error: "Payments are temporarily offline. Please try again shortly." },
      { status: 502 }
    );
  }
}
