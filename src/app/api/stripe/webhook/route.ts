// src/app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export async function POST(req: Request) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Webhook not configured" },
      { status: 500 }
    );
  }

  // Stripe needs the raw body string for signature verification
  const signature = req.headers.get("stripe-signature") ?? "";
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // If you want full details:
      // const full = await stripe.checkout.sessions.retrieve(session.id, {
      //   expand: ["payment_intent", "customer_details"],
      // });

      // TODO: persist to DB, send email, etc.
      console.log("✅ donation paid", {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        email: session.customer_details?.email ?? null,
      });
    }

    // Acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook handler error:", err);
    // Return 200 to avoid infinite retries if your handler is idempotent.
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Use POST." }, { status: 405, headers: { Allow: "POST" } });
}
