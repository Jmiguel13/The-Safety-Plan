// src/app/api/checkout/gear/route.ts
import { NextResponse } from "next/server";
import { getStripe, getSiteUrl } from "@/lib/stripe";
import type Stripe from "stripe";

/**
 * POST JSON:
 *  - stripeProductId?: string  → will use product.default_price
 *  - priceId?: string          → use this directly if provided
 *  - quantity?: number         → defaults to 1, clamped to [1,10]
 *
 * Returns: { url: string } or { error: string }
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      stripeProductId?: string;
      priceId?: string;
      quantity?: number;
    };

    const qty = clamp(body.quantity ?? 1);
    let priceId = body.priceId;

    // Resolve a price from the product if needed
    if (!priceId) {
      const productId = body.stripeProductId;
      if (!productId) {
        return NextResponse.json(
          { error: "Missing stripeProductId or priceId" },
          { status: 400 }
        );
      }

      const stripe = getStripe();
      const product = await stripe.products.retrieve(productId, {
        expand: ["default_price"],
      });

      if (typeof product.default_price === "string") {
        priceId = product.default_price;
      } else if (
        product.default_price &&
        (product.default_price as Stripe.Price).id
      ) {
        priceId = (product.default_price as Stripe.Price).id;
      }

      if (!priceId) {
        return NextResponse.json(
          { error: `No default price for product ${productId}` },
          { status: 400 }
        );
      }
    }

    // Build absolute URLs for Stripe callbacks
    const origin = getSiteUrl(req);
    const successUrl =
      process.env.NEXT_PUBLIC_CHECKOUT_SUCCESS_URL ?? `${origin}/thanks`;
    const cancelUrl =
      process.env.NEXT_PUBLIC_CHECKOUT_CANCEL_URL ?? `${origin}/shop`;

    // Create Checkout Session directly (no internal HTTP fetch)
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: qty }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      automatic_tax: { enabled: false },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[checkout/gear] error:", e);
    return NextResponse.json(
      { error: "Checkout unavailable. Please try again later." },
      { status: 500 }
    );
  }
}

function clamp(n: number) {
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(10, Math.trunc(n)));
}
