import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type StripeAccountMinimal = {
  id: string;
  email: string | null;
  business_type: Stripe.Account.BusinessType | null;
  live: boolean; // inferred from your secret key
  test: boolean; // inferred from your secret key
  charges_enabled: boolean;
  details_submitted: boolean;
};

export async function GET() {
  try {
    const account = await stripe.accounts.retrieve();

    const secret = process.env.STRIPE_SECRET_KEY ?? "";
    const live = secret.startsWith("sk_live_");
    const test = secret.startsWith("sk_test_");

    const minimal: StripeAccountMinimal = {
      id: account.id,
      email: account.email ?? null,
      business_type: account.business_type ?? null,
      live,
      test,
      charges_enabled: !!account.charges_enabled,
      details_submitted: !!account.details_submitted,
    };

    const mode = live ? "live" : test ? "test" : "unknown";
    const publishableSet = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const webhookConfigured = !!process.env.STRIPE_WEBHOOK_SECRET;

    return NextResponse.json(
      {
        ok: true,
        mode,
        publishableSet,
        webhookConfigured,
        account: minimal,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Stripe ping failed:", err);
    return NextResponse.json(
      { ok: false, error: "Stripe not configured" },
      { status: 500 }
    );
  }
}
