// src/app/donate/success/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Thank you",
  description:
    "Your donation helps prevent veteran suicide. A receipt has been emailed by Stripe.",
  alternates: { canonical: "/donate/success" },
};

export default async function DonateSuccess({
  searchParams,
}: {
  // Next 15 passes a Promise for server components
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = sp.session_id;
  const sessionId = Array.isArray(raw) ? raw[0] : raw;

  let line =
    "Your donation was received. We appreciate your support.";

  if (sessionId && process.env.STRIPE_SECRET_KEY) {
    try {
      // Get the Checkout Session to confirm amount & currency
      const s = await stripe.checkout.sessions.retrieve(sessionId);

      const amount =
        typeof s.amount_total === "number" ? s.amount_total : null;
      const currency = (s.currency || "usd").toUpperCase();

      if (amount !== null) {
        const nice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
        }).format(amount / 100);
        line = `We received ${nice}. Thank you for supporting the mission.`;
      }
    } catch {
      // Keep the generic line on lookup issues (expired/invalid session, etc.)
    }
  }

  return (
    <section className="mx-auto max-w-xl space-y-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Thank you!</h1>
      <p className="muted">{line}</p>

      <div className="flex gap-3 pt-2">
        <Link href="/kits" className="btn">
          Explore kits
        </Link>
        <Link href="/" className="btn-ghost">
          Back home
        </Link>
      </div>
    </section>
  );
}
