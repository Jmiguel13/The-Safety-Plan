import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/** Insert an order row into Supabase (if env is present). */
async function insertOrderToSupabase(row: Record<string, unknown>) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return;

  const resp = await fetch(`${base}/rest/v1/orders`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "content-type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });

  if (!resp.ok) {
    const t = await resp.text().catch(() => "");
    throw new Error(`Supabase insert failed (${resp.status}) ${t.slice(0, 300)}`);
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";
  const whsec = process.env.STRIPE_WEBHOOK_SECRET || "";
  const stripe = getStripe(); // <- typed Stripe instance

  let event: Stripe.Event;

  try {
    // ✅ no `any` cast needed; this is properly typed
    event = stripe.webhooks.constructEvent(body, sig, whsec);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const email =
          session.customer_details?.email ||
          (typeof session.customer === "string" ? session.customer : "") ||
          "";

        const amount_total = session.amount_total ?? null;
        const currency = session.currency ?? "usd";

        const md = session.metadata || {};
        const kit_slug = md.kit_slug || "";
        const kit_variant = md.kit_variant || "";

        const opt_energy_sku = md.opt_energy_sku || "";
        const opt_protein_sku = md.opt_protein_sku || "";
        const opt_include_mens_pack = md.opt_include_mens_pack === "1";
        const opt_energy_cans =
          md.opt_energy_cans != null && md.opt_energy_cans !== ""
            ? Number(md.opt_energy_cans)
            : null;

        await insertOrderToSupabase({
          created_at: new Date().toISOString(),
          stripe_session_id: session.id,
          email,
          amount_total,
          currency,
          status: "paid",
          kit_slug,
          kit_variant,
          opt_energy_sku,
          opt_protein_sku,
          opt_include_mens_pack,
          opt_energy_cans,
        });

        break;
      }

      default:
        // ignore other events for now
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook handler error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
