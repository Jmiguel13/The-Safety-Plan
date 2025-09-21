import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Bundle = "daily" | "10day" | "30day";
type Slug = "resilient" | "homefront";

type CreateCheckoutBody = {
  slug: Slug;
  bundle: Bundle;
  quantity?: number;
  selections?: { sku: string; qty: number }[]; // retained for analytics/debug
};

function siteBase() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

// Live amounts (USD cents)
const PRICE_TABLE: Record<Slug, Record<Bundle, number>> = {
  resilient: { daily: 1500, "10day": 10900, "30day": 29900 },
  homefront: { daily: 1500, "10day": 10900, "30day": 29900 },
};

const NAME_TABLE: Record<Slug, Record<Bundle, string>> = {
  resilient: {
    daily: "Resilient Kit — Daily",
    "10day": "Resilient Kit — 10-Day",
    "30day": "Resilient Kit — Full (30-Day)",
  },
  homefront: {
    daily: "Homefront Kit — Daily",
    "10day": "Homefront Kit — 10-Day",
    "30day": "Homefront Kit — Full (30-Day)",
  },
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateCheckoutBody;
    const { slug, bundle } = body || ({} as CreateCheckoutBody);
    const qty = Math.max(1, Number(body?.quantity ?? 1));

    if (!slug || !bundle) {
      return NextResponse.json({ error: "Missing slug or bundle" }, { status: 400 });
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const amount = PRICE_TABLE[slug]?.[bundle];
    if (!amount) {
      return NextResponse.json({ error: "Unknown kit/bundle" }, { status: 400 });
    }

    const name = NAME_TABLE[slug][bundle];
    const site = siteBase();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      allow_promotion_codes: true,
      success_url: `${site}/donate/success?kit=${encodeURIComponent(
        slug
      )}&bundle=${bundle}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/kits/${encodeURIComponent(slug)}`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amount,
            product_data: {
              name,
              description:
                slug === "resilient"
                  ? "Built for daily carry. Energy, hydration, recovery, morale."
                  : "Best for recovery. Rehydrate, restore, and reset.",
            },
          },
          quantity: qty,
        },
      ],
      client_reference_id: `kit:${slug}:${bundle}`,
      metadata: {
        tsp_kit_slug: slug,
        tsp_bundle: bundle,
        tsp_kit_qty: String(qty),
        tsp_kit_items: body?.selections ? JSON.stringify(body.selections) : "",
        tsp_includes: "morale_card,sticker_pack_option,morale_patch_option",
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    console.error("Stripe kit checkout error:", err);
    return NextResponse.json(
      { error: "Payments are temporarily offline. Please try again shortly." },
      { status: 502 }
    );
  }
}
