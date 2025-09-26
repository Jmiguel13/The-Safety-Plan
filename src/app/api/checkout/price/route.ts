// src/app/api/checkout/price/route.ts
import { NextResponse } from "next/server";
import { getStripe, getCheckoutRedirects } from "@/lib/stripe";

export const runtime = "nodejs";

type CheckoutBody = {
  priceId?: string;
  quantity?: number;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutBody;
    const priceId = body.priceId;
    const quantity = Number.isFinite(body.quantity)
      ? Math.max(1, Math.min(10, Number(body.quantity)))
      : 1;

    if (!priceId) {
      return NextResponse.json({ error: "Missing `priceId`" }, { status: 400 });
    }
    if (!priceId.startsWith("price_")) {
      return NextResponse.json({ error: `Invalid price id: ${priceId}` }, { status: 400 });
    }

    const stripe = getStripe();

    const { success_url, cancel_url } = getCheckoutRedirects(req);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity }],
      success_url,
      cancel_url,
      metadata: { custom_price_id: priceId },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a URL" }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
