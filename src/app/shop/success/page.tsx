// src/app/shop/success/page.tsx
import Link from "next/link";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const metadata = {
  title: "Order confirmed",
};
export const runtime = "nodejs";

function formatUsd(cents?: number, currency = "USD") {
  if (!Number.isFinite(cents as number)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format((cents as number) / 100);
}

// Next 15: searchParams is a Promise
export default async function ShopSuccess({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const idRaw = sp.session_id;
  const sessionId = Array.isArray(idRaw) ? idRaw[0] : idRaw;

  let session: Stripe.Checkout.Session | null = null;

  if (sessionId) {
    try {
      const stripe = getStripe();
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items.data.price.product"],
      });
    } catch {
      // fall back to generic UI
    }
  }

  const amount = session?.amount_total;
  const currency = (session?.currency ?? "usd").toUpperCase();
  const email =
    (session?.customer_details?.email || session?.customer_email || "") ?? "";

  const items =
    (session?.line_items?.data ?? []).map((li) => {
      const name =
        (li.price?.product as Stripe.Product | undefined)?.name ??
        li.description ??
        "Item";
      return { name, qty: li.quantity ?? 1 };
    }) ?? [];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="mb-3 text-2xl font-bold">Thank you — order confirmed</h1>
      <p className="text-zinc-300">
        We’ve received your order. A receipt has been sent to your email.
      </p>

      <div className="mt-6 space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        {typeof amount === "number" && (
          <div className="text-lg">
            <span className="text-zinc-400">Total:&nbsp;</span>
            <span className="font-semibold">{formatUsd(amount, currency)}</span>
          </div>
        )}
        {email && (
          <div>
            <span className="text-zinc-400">Receipt sent to:&nbsp;</span>
            <span className="font-medium">{email}</span>
          </div>
        )}
        {items.length > 0 && (
          <div className="text-sm">
            <div className="mb-1 text-zinc-400">Items:</div>
            <ul className="list-inside list-disc">
              {items.map((it, i) => (
                <li key={`${it.name}-${i}`}>
                  {it.name} <span className="text-zinc-400">× {it.qty}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {session?.id && (
          <div className="text-xs text-zinc-500">Session ID: {session.id}</div>
        )}
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href="/kits"
          className="rounded-md bg-emerald-600 px-4 py-2 font-semibold"
        >
          Explore more kits
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
