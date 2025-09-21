// src/app/api/checkout/kit/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getKit } from "@/lib/kits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type CreateCheckoutBody = {
  slug: string;
  selections?: { sku: string; qty: number }[];
  quantity?: number;
};

function siteBase() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

function priceIdFor(slug: string): string | null {
  if (slug === "resilient") return process.env.STRIPE_PRICE_RESILIENT ?? null;
  if (slug === "homefront") return process.env.STRIPE_PRICE_HOMEFRONT ?? null;
  return null;
}

export async function POST(req: Request) {
  let payload: CreateCheckoutBody | null = null;
  try {
    payload = (await req.json()) as CreateCheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { slug, selections, quantity = 1 } = payload || {};
  if (!slug) return NextResponse.json({ error: "Missing kit slug" }, { status: 400 });

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "Stripe secret key not configured" }, { status: 500 });

  const kit = getKit(slug);
  if (!kit) return NextResponse.json({ error: "Unknown kit" }, { status: 404 });

  const priceId = priceIdFor(slug);
  if (!priceId) return NextResponse.json({ error: "Stripe price not configured" }, { status: 500 });

  const selectedItems =
    selections && selections.length
      ? selections
      : kit.items?.map((i) => ({ sku: i.sku, qty: i.qty ?? 1 })) ?? [];

  const site = siteBase();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    allow_promotion_codes: true,
    success_url: `${site}/donate/success?kit=${encodeURIComponent(slug)}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site}/kits/${encodeURIComponent(slug)}`,
    line_items: [{ price: priceId, quantity }],
    client_reference_id: `kit:${slug}`,
    metadata: {
      tsp_kit_slug: slug,
      tsp_kit_qty: String(quantity),
      tsp_kit_items: JSON.stringify(selectedItems),
    },
  });

  return NextResponse.json({ url: session.url }, { status: 200 });
}
