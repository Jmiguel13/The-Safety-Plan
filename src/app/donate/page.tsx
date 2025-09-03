// src/app/donate/page.tsx
"use client";

import * as React from "react";

const PRESETS = [1000, 2500, 5000, 10000]; // $10, $25, $50, $100

export default function DonatePage() {
  const [amount, setAmount] = React.useState(2500);
  const [loading, setLoading] = React.useState(false);
  const [notice, setNotice] = React.useState<null | string>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success")) setNotice("Thank you—your donation was received.");
    else if (params.get("canceled")) setNotice("Donation canceled.");
  }, []);

  async function startCheckout(cents: number) {
    setLoading(true);
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cents }),
      });
      const json = await res.json();
      if (json?.url) window.location.href = json.url;
      else alert(json?.error || "Unable to start donation checkout.");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await startCheckout(amount);
  }

  return (
    <div className="mx-auto max-w-2xl py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Support the Mission</h1>
        <p className="text-zinc-400">
          Every dollar helps fund wellness kits for frontline fighters and veterans at risk.
        </p>
        {notice && (
          <p className="text-sm text-emerald-400" role="status" aria-live="polite">
            {notice}
          </p>
        )}
      </header>

      {/* Preset amounts */}
      <div className="flex flex-wrap gap-3" role="group" aria-label="Quick donation amounts">
        {PRESETS.map((cents) => (
          <button
            key={cents}
            onClick={() => startCheckout(cents)}
            disabled={loading}
            aria-label={`Donate $${(cents / 100).toFixed(0)}`}
            className="rounded-full border border-white/20 px-4 py-2 hover:border-white/40 focus:outline-none focus:ring focus:ring-white/20"
          >
            ${ (cents / 100).toFixed(0) }
          </button>
        ))}
      </div>

      {/* Custom amount with explicit label (fixes Axe 'forms/label') */}
      <form onSubmit={onSubmit} className="space-y-3" noValidate>
        <label
          htmlFor="custom-amount"
          className="block text-sm text-zinc-400"
        >
          Custom amount (USD)
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
            <input
              id="custom-amount"
              name="customAmount"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              pattern="[0-9]*"
              value={(amount / 100).toFixed(0)}
              onChange={(e) => {
                const dollars = Math.max(1, Math.floor(Number(e.target.value) || 1));
                setAmount(dollars * 100);
              }}
              placeholder="25"
              title="Enter a donation amount in US dollars"
              aria-describedby="custom-amount-help"
              className="w-40 rounded-md bg-transparent border border-white/20 pl-7 pr-3 py-2 outline-none focus:ring focus:ring-white/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-full border border-white/20 px-4 py-2 hover:border-white/40 focus:outline-none focus:ring focus:ring-white/20"
          >
            {loading ? "Starting…" : `Donate $${(amount / 100).toFixed(0)}`}
          </button>
        </div>

        <p id="custom-amount-help" className="text-xs text-zinc-500">
          Payments are processed securely by Stripe. Minimum $1.
        </p>
      </form>
    </div>
  );
}
