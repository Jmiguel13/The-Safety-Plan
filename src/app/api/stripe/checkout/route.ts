// src/app/api/stripe/checkout/route.ts
// Back-compat Shop checkout endpoint used by BuyButtons.
// Always returns JSON; accepts { priceId, quantity, successPath?, cancelPath? }.

import { NextRequest } from "next/server";
import { getStripe, getSiteUrl } from "@/lib/stripe";

export const runtime = "nodejs";

type Body = {
  priceId?: string;
  quantity?: number | string;
  successPath?: string;
  cancelPath?: string;
};

function asInt(v: unknown, d = 1): number {
  const n = Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : d;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Body;
    const priceId = body.priceId?.trim();
    const quantity = asInt(body.quantity, 1);

    if (!priceId) {
      return Response.json({ error: "Missing priceId" }, { status: 400 });
    }

    const stripe = getStripe();
    const site = getSiteUrl();

    const success =
      body.successPath?.startsWith("/")
        ? `${site}${body.successPath}`
        : body.successPath?.startsWith("http")
        ? body.successPath
        : `${site}/shop/success?session_id={CHECKOUT_SESSION_ID}`;

    const cancel =
      body.cancelPath?.startsWith("/")
        ? `${site}${body.cancelPath}`
        : body.cancelPath?.startsWith("http")
        ? body.cancelPath
        : `${site}/shop`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      billing_address_collection: "required",
      allow_promotion_codes: true,
      success_url: success,
      cancel_url: cancel,
      line_items: [{ price: priceId, quantity }],
      metadata: { source: "shop_legacy" },
    });

    return Response.json({ url: session.url }, { status: 200 });
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Stripe checkout session error";
    return Response.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ ok: true, endpoint: "/api/stripe/checkout" });
}
