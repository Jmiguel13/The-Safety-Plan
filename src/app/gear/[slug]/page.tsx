// src/app/gear/[slug]/page.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";
import { TSP_PRODUCTS, type TspProduct } from "@/lib/tsp-products";

type CheckoutResult = { url?: string; error?: string };

const toSlug = (id: string) => id.replace(/_/g, "-");
const DIRECT_GEAR = new Set<string>(["morale_patch", "sticker_pack"]);

export default function GearPage() {
  const { slug } = useParams<{ slug: string }>();
  const product: TspProduct | null =
    TSP_PRODUCTS.find((p) => toSlug(p.id) === slug) ?? null;

  const [busy, setBusy] = React.useState(false);

  async function buyNow(stripeProductId: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/checkout/gear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeProductId, quantity: 1 }),
      });

      const ctype = res.headers.get("content-type") || "";
      const data: CheckoutResult = ctype.includes("application/json")
        ? ((await res.json()) as CheckoutResult)
        : { error: await res.text() };

      if (!res.ok || !data.url) {
        throw new Error(data.error || `Checkout failed (${res.status})`);
      }
      window.location.assign(data.url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Checkout failed. Try again.");
      setBusy(false);
    }
  }

  if (!product) {
    return (
      <section className="min-h-[60vh] grid place-items-center px-6">
        <div className="space-y-3 text-center">
          <div className="tag tag-accent mx-auto w-max">Not found</div>
          <h1 className="text-3xl font-extrabold tracking-tight">Gear unavailable</h1>
          <p className="muted">This item isn’t published yet.</p>
          <div className="pt-2">
            <Link href="/shop" className="btn-ghost">Back to Shop</Link>
          </div>
        </div>
      </section>
    );
  }

  const canDirect =
    product.inStock !== false &&
    DIRECT_GEAR.has(product.id) &&
    !!product.stripeProductId;

  return (
    <section className="max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">{product.title}</h1>
        {product.blurb ? <p className="muted">{product.blurb}</p> : null}
      </header>

      {canDirect ? (
        <button
          type="button"
          className="btn"
          onClick={() => buyNow(product.stripeProductId!)}
          disabled={busy}
          aria-busy={busy || undefined}
        >
          {busy ? "Redirecting…" : "Buy"}
        </button>
      ) : product.inStock && product.url ? (
        product.url.startsWith("/") ? (
          <Link href={product.url} className="btn">Buy</Link>
        ) : (
          <a href={product.url} target="_blank" rel="noopener noreferrer" className="btn">Buy</a>
        )
      ) : (
        <WaitlistInline productId={product.id} productTitle={product.title} />
      )}

      <div>
        <Link href="/shop" className="btn-ghost">Back to Shop</Link>
      </div>
    </section>
  );
}

function WaitlistInline({ productId, productTitle }: { productId: string; productTitle: string }) {
  const [email, setEmail] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setDone(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productId }),
      });
      if (!res.ok) throw new Error(`Join failed (${res.status})`);
      setDone("You're on the list. We’ll email when it’s ready.");
      setEmail("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <h2 className="mb-2 text-lg font-semibold">Waitlist</h2>
      <p className="muted mb-3">Get notified when {productTitle} is in stock.</p>
      <form onSubmit={submit} className="flex gap-2">
        <input
          required
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2"
          aria-label={`Email for ${productTitle} waitlist`}
        />
        <button type="submit" className="btn" disabled={busy}>
          {busy ? "Sending…" : "Notify me"}
        </button>
      </form>
      {done ? <p className="mt-2 text-sm text-emerald-300">{done}</p> : null}
      {err ? <p className="mt-2 text-sm text-red-400">{err}</p> : null}
    </div>
  );
}
