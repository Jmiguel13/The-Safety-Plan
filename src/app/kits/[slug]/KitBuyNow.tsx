"use client";

import * as React from "react";

type Variant = "daily" | "10day" | "30day";

export default function KitBuyNow({
  slug,
  defaultQty = 1,
  defaultVariant = "10day",
}: {
  slug: string;
  defaultQty?: number;
  defaultVariant?: Variant;
}) {
  const [qty, setQty] = React.useState<number>(defaultQty);
  const [variant, setVariant] = React.useState<Variant>(defaultVariant);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function onBuy() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/checkout/kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, variant, quantity: qty }),
      });

      // Parse either JSON or text to be tolerant
      const ctype = res.headers.get("content-type") || "";
      let url: string | undefined;
      if (res.ok) {
        if (ctype.includes("application/json")) {
          const data = (await res.json()) as { url?: string };
          url = data?.url;
        } else {
          const txt = await res.text();
          try {
            const data = JSON.parse(txt) as { url?: string };
            url = data?.url;
          } catch {
            // ignore; will fall through to error
          }
        }
      }
      if (!url) {
        throw new Error(`Checkout error (${res.status}).`);
      }
      window.location.assign(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Checkout failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Variant selector */}
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

      {/* Quantity + Buy */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
        </div>
        <input
          aria-label="Quantity"
          className="w-16 rounded-xl border border-zinc-700 bg-zinc-900 px-2 py-2 text-center"
          type="number"
          min={1}
          max={10}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(10, Number(e.target.value || 1))))}
        />
        <button type="button" className="btn" disabled={loading} onClick={onBuy}>
          {loading ? "Redirecting…" : "Buy now"}
        </button>
      </div>

      {err ? <p className="text-sm text-red-400">{err}</p> : null}
    </div>
  );
}
