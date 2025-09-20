// src/app/api/stripe/webhook/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Webhook not configured (STRIPE_WEBHOOK_SECRET missing)" },
      { status: 500 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ ok: false, error: "Missing stripe-signature" }, { status: 400 });
  }

  // Stripe requires the *raw* body
  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(buf, signature, WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    // 400 so Stripe will retry (in case of transient header/body mismatch)
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Optional: ensure paid
        // if (session.payment_status !== "paid") break;

        console.log("✅ checkout.session.completed", {
          eventId: event.id,
          live: event.livemode,
          sessionId: session.id,
          amount_total: session.amount_total,
          currency: session.currency,
          email: session.customer_details?.email ?? null,
        });

        // TODO: persist to DB, send an email, queue a job, etc.
        break;
      }

      // Add more handlers as you need:
      // case "payment_intent.succeeded":
      // case "charge.refunded":
      //   break;

      default: {
        // Keep noise low but traceable
        console.log(`ℹ️ Unhandled Stripe event`, { type: event.type, id: event.id });
      }
    }

    // 200 acknowledges receipt to Stripe
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("⚠️ Webhook handler error", {
      eventId: event.id,
      type: event.type,
      error: err instanceof Error ? err.message : String(err),
    });

    // If your side effects are idempotent (recommended), you can still return 200
    // so Stripe doesn’t retry endlessly. If not, return 500 to get a retry.
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

// Helpful 405 for accidental GETs
export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Use POST." },
    { status: 405, headers: { Allow: "POST" } }
  );
}
