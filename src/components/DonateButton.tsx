// src/components/DonateButton.tsx
"use client";

import { useState } from "react";
import { startDonation } from "@/lib/checkout";

export default function DonateButton({ defaultAmount = 100 }: { defaultAmount?: number }) {
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    try {
      setLoading(true);
      setError(null);
      await startDonation(amount, 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payments are temporarily offline.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-zinc-800 px-2 py-1">$</span>
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value || 0))}
          className="w-32 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
        />
      </div>

      <button
        onClick={onClick}
        disabled={loading || amount <= 0}
        className="rounded-md bg-emerald-600 px-4 py-2 font-semibold disabled:opacity-50"
      >
        {loading ? "Redirecting…" : "Donate"}
      </button>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
