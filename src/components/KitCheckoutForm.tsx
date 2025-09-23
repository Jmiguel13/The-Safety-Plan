"use client";
import * as React from "react";

type Variant = "daily" | "10day" | "30day";

export default function KitCheckoutForm({
  kit,
  className = "",
  showVariant = true,
  defaultVariant = "10day",
}: {
  kit: { slug: "resilient" | "homefront"; title?: string };
  className?: string;
  showVariant?: boolean;
  defaultVariant?: Variant;
}) {
  const [qty, setQty] = React.useState<number>(1);
  const [variant, setVariant] = React.useState<Variant>(defaultVariant);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onBuy(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: kit.slug, variant, quantity: qty }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data?.url) throw new Error(data?.error || `Checkout failed (${res.status})`);
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onBuy} className={`panel mt-2 flex flex-col gap-3 p-3 ${className}`}>
      {showVariant ? (
        <label className="flex max-w-xs flex-col gap-1">
          <span className="text-xs text-zinc-400">Kit option</span>
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value as Variant)}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2"
          >
            <option value="daily">Daily</option>
            <option value="10day">10-Day Supply</option>
            <option value="30day">30-Day Supply</option>
          </select>
        </label>
      ) : null}

      <div className="flex items-center gap-2">
        <button type="button" className="btn btn-ghost" onClick={() => setQty((q) => Math.max(1, q - 1))}>
          −
        </button>
        <input
          aria-label="Quantity"
          className="w-16 rounded-xl border border-zinc-700 bg-zinc-900 px-2 py-2 text-center"
          type="number"
          min={1}
          max={10}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(10, Number(e.target.value || 1))))}
        />
        <button type="submit" className="btn" disabled={loading} aria-busy={loading}>
          {loading ? "Redirecting…" : "Buy now"}
        </button>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </form>
  );
}
