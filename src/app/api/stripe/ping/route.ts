// src/app/api/stripe/ping/route.ts
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET() {
  try {
    const stripe = getStripe();
    const acct = await stripe.accounts.retrieve();

    // Stripe typings for Account may not expose `livemode`.
    // Infer from the secret key prefix instead.
    const key = process.env.STRIPE_SECRET_KEY ?? "";
    const livemode = /^sk_live_/.test(key);

    return Response.json(
      {
        ok: true,
        account: acct.id,
        charges_enabled: acct.charges_enabled,
        payouts_enabled: acct.payouts_enabled,
        livemode,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Stripe ping error";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
