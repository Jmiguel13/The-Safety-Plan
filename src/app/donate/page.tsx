// src/app/donate/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type DonateResponse =
  | { ok: true; url: string }
  | { ok: false; error: string };

const PRESETS = [10, 25, 50, 100] as const;

export default function DonatePage() {
  const params = useSearchParams();
  const [custom, setCustom] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const success = params.get("success") === "1";
  const canceled = params.get("canceled") === "1";

  const amount = useMemo<number>(() => {
    const n = Number(custom);
    return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
  }, [custom]);

  const submit = async (dollars: number) => {
    setError("");
    setLoading(true);
    try {
      const cents = Math.max(100, Math.min(Math.round(dollars * 100), 1_000_000)); // $1–$10k
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cents }),
      });

      const data = (await res.json()) as DonateResponse;
      if (!data.ok) {
        setError(data.error || "Donation failed.");
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      // no variable needed to satisfy no-unused-vars
      setError("Network error. Try again.");
      setLoading(false);
    }
  };

  return (
    <section className="space-y-8 max-w-2xl">
      <header className="space-y-2">
        <h1 className="text-5xl font-extrabold tracking-tight">Donate</h1>
        <p className="muted">
          Your gift funds Resilient &amp; Homefront kits and suicide-prevention resources for veterans.
        </p>
      </header>

      {success && (
        <div className="panel-elevated p-4">
          <div className="text-green-300 font-medium">Thank you — your donation was received.</div>
        </div>
      )}
      {canceled && (
        <div className="panel-elevated p-4">
          <div className="muted">Donation canceled. You can try again below.</div>
        </div>
      )}

      <div className="panel p-5 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Choose an amount</h2>
          <p className="muted text-sm">Presets or enter a custom amount.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((d) => (
            <button
              key={d}
              className="pill"
              onClick={() => submit(d)}
              disabled={loading}
              aria-disabled={loading}
            >
              ${d}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="custom" className="sr-only">
            Custom amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
            <input
              id="custom"
              inputMode="numeric"
              pattern="[0-9]*"
              className="rounded-full border border-[var(--border)] bg-transparent px-8 py-2 outline-none"
              placeholder="Custom"
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ""))}
            />
          </div>
          <button
            className="btn"
            onClick={() => submit(amount || 25)}
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? "Processing…" : "Donate"}
          </button>
        </div>

        {error ? <div className="text-red-300 text-sm">{error}</div> : null}
      </div>

      <div className="muted text-xs">
        Secure payments are handled by Stripe. You’ll be redirected to a secure checkout page.
      </div>
    </section>
  );
}
