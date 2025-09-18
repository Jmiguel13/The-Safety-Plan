import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

type Body = {
  amount_cents: number;
  success_url?: string;
  cancel_url?: string;
  customer_email?: string;
  note?: string;
};

function siteUrlFromRequest(req: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, "");
  const u = new URL(req.url);
  return `${u.protocol}//${u.host}`;
}

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { ok: false, error: "Stripe is not configured on the server." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as Body;
    const amount = Math.round(Number(body.amount_cents || 0));

    if (!Number.isFinite(amount) || amount < 100 || amount > 500000) {
      return NextResponse.json(
        { ok: false, error: "Amount must be between $1 and $5,000." },
        { status: 400 }
      );
    }

    const site = siteUrlFromRequest(req);
    const successUrl = body.success_url ?? `${site}/donate/success`;
    const cancelUrl = body.cancel_url ?? `${site}/donate/cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amount,
            product_data: {
              name: "Donation to The Safety Plan",
              description: body.note || undefined,
            },
          },
        },
      ],
      metadata: { source: "website" },
      customer_email: body.customer_email || undefined,
    });

    return NextResponse.json({ ok: true, url: session.url }, { status: 200 });
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : "Unexpected error creating checkout session.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

// Optional: clear error for accidental GETs (handy during testing)
export async function GET() {
  return NextResponse.json({ ok: false, error: "Use POST." }, { status: 405 });
}

