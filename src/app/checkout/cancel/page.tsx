// src/app/checkout/cancel/page.tsx
import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

export const metadata = {
  title: "Checkout Canceled — The Safety Plan",
};

type RawSearch = {
  // Kit flow
  item?: string; // "resilient" | "homefront"
  v?: "daily" | "10day" | "30day";
  q?: string; // quantity
  // Price flow
  priceId?: string; // e.g. "price_123"
};

function titleCase(s?: string) {
  return s ? s.replace(/^\w/, (c) => c.toUpperCase()) : s ?? "";
}
function prettyVariant(v?: string) {
  if (!v) return "";
  return v.replace("day", "-day");
}

function isStripeProduct(
  p: Stripe.Product | Stripe.DeletedProduct | string
): p is Stripe.Product {
  return typeof p !== "string" && !p.deleted;
}

export default async function CheckoutCancel({
  // Next.js 15+ provides `searchParams` as a Promise
  searchParams,
}: {
  searchParams: Promise<RawSearch>;
}) {
  const sp = await searchParams;
  const { item, v, q, priceId } = sp || {};

  const qNum = Number(q);
  const qty = Number.isFinite(qNum) && qNum > 0 ? Math.floor(qNum) : 1;

  let humanItem: string | null = null;
  let backHref = "/kits";

  if (item) {
    // Kit-based checkout
    humanItem = `${titleCase(item)}${v ? ` — ${prettyVariant(v)}` : ""}`;
    backHref = `/kits/${item}`;
  } else if (priceId) {
    // One-off price checkout: fetch product name for friendlier messaging
    try {
      const stripe = getStripe();
      const price: Stripe.Price = await stripe.prices.retrieve(priceId, {
        expand: ["product"],
      });

      let name = "Item";
      if (isStripeProduct(price.product)) {
        name = price.product.name;
      }

      humanItem = name;
      backHref = "/shop";
    } catch {
      humanItem = "Item";
      backHref = "/shop";
    }
  }

  return (
    <section className="mx-auto max-w-2xl py-16 text-center space-y-6">
      <h1 className="text-3xl font-bold">Checkout canceled</h1>

      <p className="text-zinc-400">
        {humanItem ? (
          <>
            You were checking out{" "}
            <strong className="text-white">
              {humanItem}
              {qty ? ` (x${qty})` : ""}
            </strong>
            . No charges were made.
          </>
        ) : (
          <>No worries — nothing was charged. You can continue shopping or pick up where you left off.</>
        )}
      </p>

      <div className="flex justify-center gap-3">
        <Link href={backHref} className="btn">
          {item ? `Return to ${titleCase(item)}` : "Return to Shop"}
        </Link>
        <Link href="/shop" className="btn-ghost">
          Shop
        </Link>
        <Link href="/" className="btn-ghost">
          Home
        </Link>
      </div>
    </section>
  );
}
