// src/app/api/donate/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = { amount?: number };

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Body;

    // Default $25, min $1, max $10,000
    const centsRaw = Number(body.amount ?? 2500);
    const cents = Math.max(100, Math.min(Number.isFinite(centsRaw) ? centsRaw : 2500, 1_000_000));

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { ok: false, error: "Stripe is not configured." },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation — The Safety Plan",
              description:
                "Support our mission to fund Resilient & Homefront kits and prevent veteran suicide.",
            },
            unit_amount: cents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/donate?success=1`,
      cancel_url: `${origin}/donate?canceled=1`,
      metadata: { campaign: "site_donate_button" },
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    const message =
      (err as { message?: string })?.message ?? "Stripe error creating checkout session";
    console.error("[donate] error:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
