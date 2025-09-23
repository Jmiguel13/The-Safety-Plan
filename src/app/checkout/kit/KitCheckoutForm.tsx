"use client";

import * as React from "react";

export type KitSlug = "resilient" | "homefront" | (string & {}); // future-proof: allows any string
export type KitCheckoutInput = {
  slug: KitSlug;
  title?: string;
};

type Props = {
  kit: KitCheckoutInput;
  stickerPrice?: string;
  patchPrice?: string;
};

export default function KitCheckoutForm({ kit }: Props) {
  const [qty, setQty] = React.useState<number>(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: kit.slug, quantity: qty }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `HTTP ${res.status}`);
      }
      const { url } = (await res.json()) as { url: string };
      window.location.assign(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onCheckout} className="panel mt-6 flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {kit.title ?? `${String(kit.slug).slice(0, 1).toUpperCase()}${String(kit.slug).slice(1)} Kit`}
          </h2>
          <p className="muted text-sm">Secure checkout via Stripe</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="qty" className="sr-only">
            Quantity
          </label>
          <input
            id="qty"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value || 1))}
            className="w-20 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-right"
          />
          <button
            type="submit"
            className="btn"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Redirecting…" : "Buy now"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-400">
          {error}
        </p>
      ) : null}
    </form>
  );
}
