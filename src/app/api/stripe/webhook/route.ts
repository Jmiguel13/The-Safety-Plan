// src/app/api/stripe/webhook/route.ts
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  const secret = requireEnv("STRIPE_WEBHOOK_SECRET");

  if (!sig) {
    return Response.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const payload = await req.text(); // raw body
    event = stripe.webhooks.constructEvent(payload, sig, secret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Invalid webhook signature";
    return Response.json({ error: msg }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // TODO: persist session.id / amount_total / customer_email etc.
        // Mark variable as intentionally used to satisfy no-unused-vars:
        void session.id;
        break;
      }
      default:
        break;
    }

    return Response.json({ received: true }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Webhook handler error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
