// src/app/checkout/success/page.tsx
import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

export const metadata = {
  title: "Order Successful — The Safety Plan",
};

type RawSearch = {
  session_id?: string;
};

function formatCurrency(amount: number | null | undefined, currency = "usd") {
  const v = typeof amount === "number" ? amount : 0;
  // Stripe amounts are in the smallest currency unit (e.g., cents)
  const major = v / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(major);
}

function isStripeProduct(
  p: Stripe.Product | Stripe.DeletedProduct | string
): p is Stripe.Product {
  return typeof p !== "string" && !p.deleted;
}

export default async function CheckoutSuccess({
  // Next.js 15+ provides `searchParams` as a Promise — must await
  searchParams,
}: {
  searchParams: Promise<RawSearch>;
}) {
  const sp = await searchParams;
  const sessionId = sp?.session_id;

  // If we didn't receive a session id, show a generic success page
  if (!sessionId) {
    return (
      <section className="mx-auto max-w-2xl py-16 text-center space-y-6">
        <h1 className="text-3xl font-bold">Thank you!</h1>
        <p className="text-zinc-400">
          Your order was completed successfully. A receipt has been sent to your email.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/shop" className="btn">Continue Shopping</Link>
          <Link href="/kits" className="btn-ghost">Browse Kits</Link>
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </section>
    );
  }

  // Fetch session + line items for a friendly summary (no PII shown)
  let session: Stripe.Checkout.Session | null = null;
  let lineItems: Stripe.ApiList<Stripe.LineItem> | null = null;

  try {
    const stripe = getStripe();
    session = await stripe.checkout.sessions.retrieve(sessionId);
    lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 50,
      expand: ["data.price.product"],
    });
  } catch {
    // Fall back to generic success UI if Stripe lookup fails
    return (
      <section className="mx-auto max-w-2xl py-16 text-center space-y-6">
        <h1 className="text-3xl font-bold">Thank you!</h1>
        <p className="text-zinc-400">
          Your order was completed. We’re finalizing your receipt.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/shop" className="btn">Continue Shopping</Link>
          <Link href="/kits" className="btn-ghost">Browse Kits</Link>
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </section>
    );
  }

  const total = formatCurrency(session?.amount_total, session?.currency ?? "usd");

  const items = (lineItems?.data ?? []).map((li) => {
    const price = li.price as Stripe.Price | null | undefined;
    const prodRef = price?.product;
    let name = li.description ?? "Item";
    if (prodRef && isStripeProduct(prodRef)) {
      name = prodRef.name ?? name;
    }
    const qty = li.quantity ?? 1;
    return { name, qty };
  });

  return (
    <section className="mx-auto max-w-2xl py-16 text-center space-y-8">
      <h1 className="text-3xl font-bold">Thank you for your order</h1>

      <p className="text-zinc-400">
        Your payment was successful. A receipt has been sent to your email.
      </p>

      <div className="mx-auto w-full max-w-xl rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] p-5 text-left">
        <div className="mb-3 text-sm text-zinc-400">
          <span className="font-medium text-zinc-200">Order Summary</span>
        </div>
        <ul className="space-y-2 text-sm">
          {items.length > 0 ? (
            items.map((it, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span className="text-zinc-200">{it.name}</span>
                <span className="tabular-nums text-zinc-400">x{it.qty}</span>
              </li>
            ))
          ) : (
            <li className="text-zinc-400">Your items are being prepared…</li>
          )}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-[color:var(--border)] pt-3">
          <span className="text-sm text-zinc-400">Total</span>
          <span className="font-semibold text-white">{total}</span>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <Link href="/shop" className="btn">Continue Shopping</Link>
        <Link href="/kits" className="btn-ghost">Browse Kits</Link>
        <Link href="/" className="btn-ghost">Home</Link>
      </div>
    </section>
  );
}
