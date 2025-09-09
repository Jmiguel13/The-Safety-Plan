import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

type DonateBody = { amount?: number | string };

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as DonateBody;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const raw = body?.amount;
    const dollars =
      typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw) : NaN;

    if (!Number.isFinite(dollars) || dollars <= 0) {
      return NextResponse.json({ ok: false, error: "Invalid amount" }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ ok: false, error: "STRIPE_SECRET_KEY missing" }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      submit_type: "donate",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(dollars * 100),
            product_data: {
              name: "Donation to The Safety Plan",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/donate?status=success`,
      cancel_url: `${siteUrl}/donate?status=cancelled`,
      metadata: { source: "donate-page" },
    });

    return NextResponse.json({ ok: true, url: session.url }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { ok: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
