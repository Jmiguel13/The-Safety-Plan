import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Bundle = "daily" | "10day" | "30day";
type CreateCheckoutBody = {
  slug: "resilient" | "homefront";
  bundle: Bundle;
  quantity?: number;
  selections?: { sku: string; qty: number }[];
};

function siteBase() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

function priceIdFor(slug: "resilient" | "homefront", bundle: Bundle): string | null {
  const map: Record<string, string | undefined> = {
    "resilient|daily":  process.env.STRIPE_PRICE_RESILIENT_DAILY,
    "resilient|10day":  process.env.STRIPE_PRICE_RESILIENT_10DAY,
    "resilient|30day":  process.env.STRIPE_PRICE_RESILIENT_30DAY,
    "homefront|daily":  process.env.STRIPE_PRICE_HOMEFRONT_DAILY,
    "homefront|10day":  process.env.STRIPE_PRICE_HOMEFRONT_10DAY,
    "homefront|30day":  process.env.STRIPE_PRICE_HOMEFRONT_30DAY,
  };
  return map[`${slug}|${bundle}`] ?? null;
}

export async function POST(req: Request) {
  let payload: CreateCheckoutBody;
  try {
    payload = (await req.json()) as CreateCheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { slug, bundle, quantity = 1, selections } = payload || ({} as CreateCheckoutBody);
  if (!slug || !bundle) return NextResponse.json({ error: "Missing slug or bundle" }, { status: 400 });

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const priceId = priceIdFor(slug, bundle);
  if (!priceId) {
    return NextResponse.json({ error: `Missing Stripe price for ${slug}/${bundle}` }, { status: 500 });
  }

  const site = siteBase();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    allow_promotion_codes: true,
    success_url: `${site}/donate/success?kit=${encodeURIComponent(slug)}&bundle=${bundle}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site}/kits/${encodeURIComponent(slug)}`,
    line_items: [{ price: priceId, quantity: Math.max(1, Number(quantity || 1)) }],
    client_reference_id: `kit:${slug}:${bundle}`,
    metadata: {
      tsp_kit_slug: slug,
      tsp_bundle: bundle,
      tsp_kit_qty: String(quantity || 1),
      tsp_kit_items: selections ? JSON.stringify(selections) : "",
      tsp_includes: "morale_card,sticker_pack_option,morale_patch_option",
    },
  });

  return NextResponse.json({ url: session.url }, { status: 200 });
}
