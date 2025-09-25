// src/app/api/checkout/gear/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * POST body:
 *  - stripeProductId?: string  (preferred)
 *  - priceId?: string          (optional direct path)
 *  - quantity?: number         (default 1)
 *
 * Returns: { url: string }
 */
export async function POST(req: Request) {
  try {
    const { stripeProductId, priceId: directPriceId, quantity = 1 } = (await req.json()) as {
      stripeProductId?: string;
      priceId?: string;
      quantity?: number;
    };

    let priceId = directPriceId;

    if (!priceId) {
      if (!stripeProductId) {
        return NextResponse.json(
          { error: "Missing stripeProductId or priceId" },
          { status: 400 }
        );
      }

      const secret =
        process.env.STRIPE_SECRET_KEY ||
        process.env.STRIPE_SK ||
        process.env.STRIPE_API_KEY;

      if (!secret) {
        return NextResponse.json(
          { error: "Stripe secret key not configured on server" },
          { status: 500 }
        );
      }

      // Do not fix apiVersion literal; rely on package's default typing
      const stripe = new Stripe(secret);

      const product = await stripe.products.retrieve(stripeProductId, {
        expand: ["default_price"],
      });

      let defaultPriceId: string | undefined;
      if (typeof product.default_price === "string") {
        defaultPriceId = product.default_price;
      } else if (
        product.default_price &&
        typeof product.default_price === "object" &&
        "id" in product.default_price
      ) {
        defaultPriceId = (product.default_price as Stripe.Price).id;
      }

      if (!defaultPriceId) {
        return NextResponse.json(
          { error: `No default price for product ${stripeProductId}` },
          { status: 400 }
        );
      }

      priceId = defaultPriceId;
    }

    // Reuse existing price checkout endpoint
    const resp = await fetch(new URL("/api/checkout/price", req.url).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, quantity }),
    });

    const ctype = resp.headers.get("content-type") || "";
    const data =
      ctype.includes("application/json") ? await resp.json() : { error: await resp.text() };

    if (!resp.ok || !data?.url) {
      return NextResponse.json(
        { error: data?.error || `Checkout failed (${resp.status})` },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.url as string });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
