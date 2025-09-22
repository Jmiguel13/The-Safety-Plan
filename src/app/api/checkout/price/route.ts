// Create a Stripe Checkout Session for a single price (e.g., sticker pack).

import { NextRequest } from "next/server";
import { getStripe, getSiteUrl } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { priceId, quantity } = (await req.json().catch(() => ({}))) as {
      priceId?: string;
      quantity?: number;
    };

    const price = String(priceId || "").trim();
    const qty = Number.isFinite(quantity) && (quantity as number) > 0 ? (quantity as number) : 1;

    if (!price || !/^price_/.test(price)) {
      return Response.json(
        { ok: false, error: "Missing or invalid Stripe price id." },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const site = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      success_url: `${site}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/shop?canceled=1`,
      line_items: [{ price, quantity: qty }],
      metadata: { source: "price_checkout", priceId: price, quantity: String(qty) },
    });

    return Response.json({ ok: true, url: session.url }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Price checkout error";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
