// src/app/donate/page.tsx
"use client";

import { useState } from "react";

const PRESETS = [1000, 2500, 5000, 10000]; // $10, $25, $50, $100

export default function DonatePage() {
  const [amount, setAmount] = useState<number>(2500);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const format = (cents: number) => (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

  const go = async () => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const json = await res.json();
      if (!res.ok || !json?.url) throw new Error(json?.error || "Checkout failed");
      window.location.href = json.url as string;
    } catch (e) {
      setError((e as Error).message || "Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="space-y-6 max-w-3xl">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Donate</h1>
        <p className="muted">
          Your donation funds Resilient &amp; Homefront kits and supports veteran suicide prevention.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        {PRESETS.map((c) => (
          <button
            key={c}
            onClick={() => setAmount(c)}
            className={`pill ${amount === c ? "bg-white/5" : ""}`}
            aria-pressed={amount === c}
          >
            {format(c)}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Custom amount</label>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-full rounded-xl border border-[var(--border)] bg-black/30 px-3 py-2 outline-none focus-visible:ring-ok"
          placeholder="25.00"
          value={(amount / 100).toString()}
          onChange={(e) => {
            const dollars = e.target.value.replace(/[^\d.]/g, "");
            const cents = Math.round((Number(dollars || "0") || 0) * 100);
            setAmount(cents);
          }}
        />
        <div className="text-sm muted">Selected: {format(amount)}</div>
      </div>

      {error ? <div className="text-sm text-red-400">{error}</div> : null}

      <div className="flex items-center gap-3">
        <button
          disabled={pending || amount < 100}
          onClick={go}
          className="btn"
        >
          {pending ? "Redirecting…" : `Donate ${format(amount)}`}
        </button>
        <span className="muted text-sm">You’ll be redirected to Stripe Checkout.</span>
      </div>
    </section>
  );
}
