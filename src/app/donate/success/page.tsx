// src/app/donate/success/page.tsx
import Link from "next/link";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const revalidate = 0;

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function DonateSuccess({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const raw = searchParams?.session_id;
  const sessionId = Array.isArray(raw) ? raw[0] : raw;

  let line = "Your donation was received. We appreciate your support.";

  if (sessionId) {
    try {
      const s = await stripe.checkout.sessions.retrieve(sessionId);
      const amount = s.amount_total;
      const currency = (s.currency || "usd").toUpperCase();
      if (typeof amount === "number") {
        line = `We received ${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
        }).format(amount / 100)}. Thank you for supporting the mission.`;
      }
    } catch {
      // Keep the generic line if retrieval fails (e.g., expired/invalid id)
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
