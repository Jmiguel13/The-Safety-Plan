// src/components/KitCheckoutForm.tsx
"use client";

import * as React from "react";
import type { Kit } from "@/lib/kits";

type Props = {
  kit: Kit;
  className?: string;
};

export default function KitCheckoutForm({ kit, className }: Props) {
  const [qty, setQty] = React.useState<number>(1);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  function clamp(n: number) {
    if (!Number.isFinite(n)) return 1;
    return Math.max(1, Math.min(99, Math.round(n)));
  }

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const selections =
        kit.items?.map((i) => ({
          sku: String(i.sku),
          qty: Number.isFinite(Number(i.qty)) ? Number(i.qty) : 1,
        })) ?? [];

      const res = await fetch("/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug: kit.slug as "resilient" | "homefront",
          quantity: clamp(qty),
          selections,
        }),
      });

      const json = (await res.json()) as { url?: string; error?: string };
      if (json?.url) {
        window.location.href = json.url;
        return;
      }
      throw new Error(json?.error || "Unable to start checkout.");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Unable to start checkout.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={
        className ??
        "mt-6 flex w-full flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
      }
    >
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor="kit-qty"
          className="text-xs uppercase tracking-wider text-zinc-400"
        >
          Quantity
        </label>

        <div className="inline-flex items-center rounded-lg border border-zinc-800 bg-black/20">
          <button
            type="button"
            onClick={() => setQty((n) => clamp(n - 1))}
            disabled={loading || qty <= 1}
            className="px-3 py-2 text-zinc-300 hover:text-white disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            id="kit-qty"
            inputMode="numeric"
            pattern="[0-9]*"
            value={qty}
            onChange={(e) => setQty(clamp(Number(e.target.value)))}
            className="w-12 bg-transparent text-center text-sm outline-none"
          />
          <button
            type="button"
            onClick={() => setQty((n) => clamp(n + 1))}
            disabled={loading || qty >= 99}
            className="px-3 py-2 text-zinc-300 hover:text-white disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-60"
      >
        {loading ? "Starting checkout…" : "Buy now"}
      </button>

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <p className="text-xs text-zinc-500">
        You’ll be redirected to our secure Stripe checkout. Success returns you
        here with your receipt.
      </p>
    </div>
  );
}
