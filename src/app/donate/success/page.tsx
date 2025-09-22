// src/app/donate/success/page.tsx
import Link from "next/link";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

// Next.js 15 passes searchParams as a promise — must await it
export default async function DonateSuccess({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const sessionIdRaw = sp.session_id;
  const sessionId = Array.isArray(sessionIdRaw) ? sessionIdRaw[0] : sessionIdRaw;

  let session: Stripe.Checkout.Session | null = null;

  if (sessionId) {
    try {
      const stripe = getStripe();
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch {
      // swallow errors — show generic success UI
    }
  }

  const amount = session?.amount_total;
  const currency = (session?.currency ?? "usd").toUpperCase();
  const email = session?.customer_details?.email || session?.customer_email || "";

  function formatUsd(cents?: number, curr = "USD") {
    if (!Number.isFinite(cents as number)) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr,
      maximumFractionDigits: 2,
    }).format((cents as number) / 100);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="mb-3 text-2xl font-bold">Thank you for your donation</h1>
      <p className="text-zinc-300">
        Your support helps fund real resources for veterans and first responders.
      </p>

      <div className="mt-6 space-y-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        {typeof amount === "number" && (
          <div className="text-lg">
            <span className="text-zinc-400">Amount:&nbsp;</span>
            <span className="font-semibold">{formatUsd(amount, currency)}</span>
          </div>
        )}

        {email && (
          <div>
            <span className="text-zinc-400">Receipt sent to:&nbsp;</span>
            <span className="font-medium">{email}</span>
          </div>
        )}

        {session?.payment_status && (
          <div>
            <span className="text-zinc-400">Status:&nbsp;</span>
            <span className="font-medium capitalize">
              {session.payment_status.replace(/_/g, " ")}
            </span>
          </div>
        )}

        {session?.id && (
          <div className="text-xs text-zinc-500">Session ID: {session.id}</div>
        )}
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href="/shop"
          className="rounded-md bg-emerald-600 px-4 py-2 font-semibold"
        >
          Continue to Shop
        </Link>
        <Link
          href="/"
          className="rounded-md border border-zinc-700 px-4 py-2 font-semibold"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
