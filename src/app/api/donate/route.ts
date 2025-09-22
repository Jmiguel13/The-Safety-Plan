export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const MIN_CENTS = 100;     // $1.00
const MAX_CENTS = 500_000; // $5,000.00

function originFrom(req: NextRequest): string {
  const raw =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      amount_cents?: unknown;
      amount?: unknown;
    };

    // Accept both amount_cents and amount for compatibility
    const raw = (body.amount_cents ?? body.amount) as unknown;
    const amount = Number(raw);

    if (!Number.isFinite(amount)) {
      return NextResponse.json(
        { ok: false, error: "Invalid amount." },
        { status: 400 }
      );
    }
    if (amount < MIN_CENTS) {
      return NextResponse.json(
        { ok: false, error: "Minimum donation is $1." },
        { status: 400 }
      );
    }
    if (amount > MAX_CENTS) {
      return NextResponse.json(
        {
          ok: false,
          error: "Maximum donation for this form is $5,000.",
        },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          ok: false,
          error: "Payments temporarily unavailable (Stripe not configured).",
        },
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
    console.error("Stripe donate error:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Payments are temporarily offline. Please try again in a few minutes.",
      },
      { status: 502 }
    );
  }
}
