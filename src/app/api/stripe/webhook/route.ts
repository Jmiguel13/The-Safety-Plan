import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

function siteBase() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

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

  // Stripe requires the raw body
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
          sessionId: session.id,
          amount_total: session.amount_total,
          currency: session.currency,
          email: session.customer_details?.email ?? null,
        });

        // Best-effort tracking (ignore network errors)
        const payload = {
          type: "kit_purchase_server" as const,
          session_id: session.id,
          kit:
            (session.metadata?.tsp_kit_slug as string | undefined) ??
            (session.client_reference_id?.startsWith("kit:")
              ? session.client_reference_id.slice(4)
              : undefined) ??
            undefined,
          email: session.customer_details?.email ?? null,
          amount_total: session.amount_total ?? null,
          currency: session.currency ?? null,
        };

        const base = siteBase();
        fetch(`${base}/api/track/kit`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
        break;
      }

      default: {
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

    // If your side effects are idempotent, you can still return 200
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
