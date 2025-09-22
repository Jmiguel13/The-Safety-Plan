// Create a Stripe Checkout Session for a kit bundle by slug.
// Uses env price IDs if available. Returns JSON only.

import { NextRequest } from "next/server";
import { getStripe, getSiteUrl } from "@/lib/stripe";

export const runtime = "nodejs";

const PRICE_BY_SLUG: Record<string, string | undefined> = {
  resilient: process.env.STRIPE_PRICE_KIT_RESILIENT,
  homefront: process.env.STRIPE_PRICE_KIT_HOMEFRONT,
};

export async function POST(req: NextRequest) {
  try {
    const { slug, quantity } = (await req.json().catch(() => ({}))) as {
      slug?: string;
      quantity?: number;
    };

    const q = Number.isFinite(quantity) && (quantity as number) > 0 ? (quantity as number) : 1;
    if (!slug || (slug !== "resilient" && slug !== "homefront")) {
      return Response.json({ ok: false, error: "Unknown kit." }, { status: 400 });
    }

    const priceId = PRICE_BY_SLUG[slug];
    if (!priceId || !/^price_/.test(priceId)) {
      const need =
        slug === "resilient" ? "STRIPE_PRICE_KIT_RESILIENT" : "STRIPE_PRICE_KIT_HOMEFRONT";
      return Response.json(
        {
          ok: false,
          error: `Stripe price missing. Set ${need} in your environment to enable checkout for “${slug}”.`,
        },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const site = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      allow_promotion_codes: true,
      billing_address_collection: "required",
      success_url: `${site}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/shop?canceled=1`,
      line_items: [{ price: priceId, quantity: q }],
      metadata: { source: "kit_checkout", slug, quantity: String(q) },
    });

    return Response.json({ ok: true, url: session.url }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Kit checkout error";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
