// src/app/checkout/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Body =
  | {
      slug: "resilient" | "homefront";
      quantity?: number;
      // optional per-kit custom selections to store in metadata
      selections?: { sku: string; qty: number }[];
    }
  | null;

function siteBase() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

// Map kit slug -> Stripe Price ID via env
function priceIdFor(slug: string): string | null {
  if (slug === "resilient") return process.env.STRIPE_PRICE_RESILIENT ?? null;
  if (slug === "homefront") return process.env.STRIPE_PRICE_HOMEFRONT ?? null;
  return null;
}

export async function POST(req: Request) {
  let body: Body = null;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body?.slug) {
    return NextResponse.json({ error: "Missing kit slug" }, { status: 400 });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
  }

  const price = priceIdFor(body.slug);
  if (!price) {
    return NextResponse.json({ error: `Missing Stripe price for ${body.slug}` }, { status: 500 });
  }

  const quantity = Math.max(1, Number(body.quantity ?? 1));
  const site = siteBase();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    allow_promotion_codes: true,
    success_url: `${site}/donate/success?kit=${encodeURIComponent(
      body.slug
    )}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site}/kits/${encodeURIComponent(body.slug)}`,
    line_items: [{ price, quantity }],
    client_reference_id: `kit:${body.slug}`,
    metadata: {
      tsp_kit_slug: body.slug,
      tsp_kit_qty: String(quantity),
      tsp_kit_items: body.selections ? JSON.stringify(body.selections) : "",
    },
  });

  return NextResponse.json({ url: session.url }, { status: 200 });
}
