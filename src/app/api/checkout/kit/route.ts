// src/app/api/checkout/kit/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

type Variant = "daily" | "10day" | "30day";

type CheckoutBody = {
  slug?: string;
  variant?: Variant;
  quantity?: number;
};

function getBaseUrl(req: Request): string {
  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";
  try {
    return new URL(origin).origin;
  } catch {
    return "http://localhost:3000";
  }
}

function env(key: string): string | undefined {
  return (process.env as Record<string, string | undefined>)[key];
}

/**
 * Price resolution order (VERY tolerant):
 * 1) STRIPE_PRICE_<SLUG>_<VARIANT>            e.g. STRIPE_PRICE_RESILIENT_10DAY
 * 2) STRIPE_PRICE_KIT_<SLUG>                  e.g. STRIPE_PRICE_KIT_RESILIENT
 * 3) STRIPE_PRICE_<SLUG>_KIT                  e.g. STRIPE_PRICE_RESILIENT_KIT
 * 4) STRIPE_PRICE_<SLUG>                      e.g. STRIPE_PRICE_RESILIENT
 */
function resolvePriceId(slug: string, variant: Variant): string | undefined {
  const upper = slug.toUpperCase();
  const variantKey = `STRIPE_PRICE_${upper}_${variant.toUpperCase().replace("-", "")}`;
  const kitAfterKey = `STRIPE_PRICE_KIT_${upper}`;
  const kitBeforeKey = `STRIPE_PRICE_${upper}_KIT`;
  const genericKey = `STRIPE_PRICE_${upper}`;
  return env(variantKey) || env(kitAfterKey) || env(kitBeforeKey) || env(genericKey);
}

export async function POST(req: Request) {
  try {
    const body: CheckoutBody = await req.json();
    const slug = String(body.slug ?? "").trim().toLowerCase();
    const variant: Variant = (body.variant ?? "10day") as Variant; // default to 10-day
    const quantity = Number.isFinite(body.quantity)
      ? Math.max(1, Math.min(10, Number(body.quantity)))
      : 1;

    if (!slug) {
      return NextResponse.json({ error: "Missing `slug`" }, { status: 400 });
    }

    const secretKey = env("STRIPE_SECRET_KEY");
    if (!secretKey) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    const priceId = resolvePriceId(slug, variant);
    if (!priceId) {
      const upper = slug.toUpperCase();
      return NextResponse.json(
        {
          error:
            `No Stripe price configured for ${slug} (${variant}).\n` +
            `Set one of the following env vars:\n` +
            `  STRIPE_PRICE_${upper}_${variant.toUpperCase().replace("-", "")}\n` +
            `  STRIPE_PRICE_KIT_${upper}\n` +
            `  STRIPE_PRICE_${upper}_KIT\n` +
            `  STRIPE_PRICE_${upper}`,
        },
        { status: 400 }
      );
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: "2024-06-20" as Stripe.LatestApiVersion,
    });
    const base = getBaseUrl(req);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity }],
      success_url: `${base}/checkout/success?item=${encodeURIComponent(slug)}&v=${variant}&q=${quantity}`,
      cancel_url: `${base}/checkout/cancelled?item=${encodeURIComponent(slug)}&v=${variant}`,
      metadata: { kit_slug: slug, kit_variant: variant },
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
