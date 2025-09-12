import { NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

if (!STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY is not set — donate will fail.");
}

const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  try {
    const { amount, currency = "usd", metadata } = await req.json();

    // amount should be in cents
    if (
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 9_000_000_00 // safety cap: $9M
    ) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // (Stripe may infer methods; keeping explicit is fine)
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: "Donation" },
            unit_amount: Math.round(amount),
          },
          quantity: 1,
        },
      ],
      success_url: `${SITE_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/donate`,
      ...(metadata ? { metadata } : {}),
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Stripe donate error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
