// src/components/BuyButtons.tsx
"use client";

import { useState } from "react";
import { buyNow } from "@/lib/checkout";

export type BuyButtonsProps = {
  priceId: string;   // Stripe Price ID (LIVE/TEST depending on environment)
  min?: number;
  max?: number;
};

export default function BuyButtons({ priceId, min = 1, max = 10 }: BuyButtonsProps) {
  const [qty, setQty] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function dec() { setQty((q) => Math.max(min, q - 1)); }
  function inc() { setQty((q) => Math.min(max, q + 1)); }

  async function onBuy() {
    try {
      setLoading(true);
      setError(null);
      await buyNow(priceId, qty);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          onClick={dec}
          className="h-9 w-9 rounded-md border border-zinc-700"
          aria-label="Decrease quantity"
        >
          –
        </button>
        <span className="w-8 text-center">{qty}</span>
        <button
          onClick={inc}
          className="h-9 w-9 rounded-md border border-zinc-700"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        onClick={onBuy}
        disabled={loading}
        className="rounded-md bg-emerald-600 px-4 py-2 font-semibold disabled:opacity-50"
      >
        {loading ? "Redirecting…" : "Buy now"}
      </button>

      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
