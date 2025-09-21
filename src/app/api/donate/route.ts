export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// Bounds
const MIN_CENTS = 100;     // $1.00
const MAX_CENTS = 500_000; // $5,000.00

function originFrom(req: NextRequest) {
  return (
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { amount_cents?: unknown; amount?: unknown };
    // Accept both amount_cents and amount for compatibility with older clients
    const raw = (body?.amount_cents ?? body?.amount) as unknown;
    const amount = Number(raw);

    if (!Number.isFinite(amount)) {
      return NextResponse.json({ ok: false, error: "Invalid amount." }, { status: 400 });
    }
    if (amount < MIN_CENTS) {
      return NextResponse.json({ ok: false, error: "Minimum donation is $1." }, { status: 400 });
    }
    if (amount > MAX_CENTS) {
      return NextResponse.json({ ok: false, error: "Maximum donation for this form is $5,000." }, { status: 400 });
    }

    // Hard fail if Stripe isn’t configured—prevents confusing 401s later
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { ok: false, error: "Payments temporarily unavailable (missing Stripe secret)." },
        { status: 503 }
      );
    }

    const base = originFrom(req);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amount),
            product_data: {
              name: "Donation",
              description: "Donation to The Safety Plan",
            },
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: false,
      success_url: `${base}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/donate?canceled=1`,
      metadata: { kind: "donation" },
    });

    return NextResponse.json({ ok: true, url: session.url }, { status: 200 });
  } catch (err) {
    // Don’t leak Stripe’s raw message to the browser
    console.error("Stripe donate error:", err);
    return NextResponse.json(
      { ok: false, error: "Payments are temporarily offline. Please try again shortly." },
      { status: 502 }
    );
  }
}
