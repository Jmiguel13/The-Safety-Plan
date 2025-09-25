// src/app/api/checkout/gear/route.ts
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

/**
 * POST JSON:
 *  - stripeProductId?: string  (preferred) → will use product.default_price
 *  - priceId?: string          (optional direct path)
 *  - quantity?: number         (default 1)
 */
export async function POST(req: Request) {
  try {
    const { stripeProductId, priceId: directPriceId, quantity = 1 } =
      (await req.json()) as {
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
      const stripe = getStripe();
      const product = await stripe.products.retrieve(stripeProductId, {
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
          { error: `No default price for product ${stripeProductId}` },
          { status: 400 }
        );
      }
    }

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
