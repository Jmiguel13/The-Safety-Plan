// src/app/donate/success/page.tsx
import Link from "next/link";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const revalidate = 0;

export default async function DonateSuccess({
  searchParams,
}: {
  // 👈 Next 15 expects a Promise here
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let line = "Your donation was received. We appreciate your support.";

  // Try to show the exact amount when we have a session id and Stripe is configured
  if (session_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const s = await stripe.checkout.sessions.retrieve(session_id);
      const amount = typeof s.amount_total === "number" ? s.amount_total : null;
      const currency = (s.currency || "usd").toUpperCase();
      if (amount !== null) {
        line = `We received ${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
        }).format(amount / 100)}. Thank you for supporting the mission.`;
      }
    } catch {
      // keep the generic message on any lookup error
    }
  }

  return (
    <section className="mx-auto max-w-xl space-y-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Thank you!</h1>
      <p className="muted">{line}</p>

      <div className="flex gap-3 pt-2">
        <Link href="/kits" className="btn">Explore kits</Link>
        <Link href="/" className="btn-ghost">Back home</Link>
      </div>
    </section>
  );
}
