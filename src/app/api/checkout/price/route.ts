// src/app/api/checkout/price/route.ts
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { priceId, quantity = 1 } = (await req.json()) as {
      priceId: string;
      quantity?: number;
    };
    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    const stripe = getStripe();
    const origin = new URL(req.url).origin;
    const successUrl =
      process.env.NEXT_PUBLIC_CHECKOUT_SUCCESS_URL ?? `${origin}/thanks`;
    const cancelUrl =
      process.env.NEXT_PUBLIC_CHECKOUT_CANCEL_URL ?? `${origin}/shop`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      automatic_tax: { enabled: false },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
