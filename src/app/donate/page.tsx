"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const PRESETS = [10, 25, 50, 100] as const;
const MIN_CENTS = 100;     // $1.00
const MAX_CENTS = 500000;  // $5,000.00

function dollarsToCents(input: string): number | null {
  // allow digits and a single dot
  const clean = (input ?? "").replace(/[^\d.]/g, "");
  if (!clean) return null;

  // collapse multiple dots to one (keeps the first)
  const parts = clean.split(".");
  const normalized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : clean;

  const n = Number(normalized);
  if (!Number.isFinite(n)) return null;

  const cents = Math.round(n * 100);
  return cents > 0 ? cents : null;
}

function centsToTidyDollars(cents: number): string {
  // 2500 -> "25"; 2550 -> "25.5"; 2599 -> "25.99"
  const s = (cents / 100).toFixed(2);
  return s.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

export default function DonatePage() {
  const search = useSearchParams();
  const [amountStr, setAmountStr] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Prefill from query string ?amount=25 (or ?a=25)
  useEffect(() => {
    const q = search?.get("amount") ?? search?.get("a");
    if (q) {
      const c = dollarsToCents(q);
      if (c) setAmountStr(centsToTidyDollars(c));
    }
  }, [search]);

  const amountCents = useMemo(() => dollarsToCents(amountStr), [amountStr]);

  async function donate() {
    if (busy) return;

    setMsg(null);

    const cents = dollarsToCents(amountStr);
    if (!cents) {
      setMsg("Please enter an amount (minimum $1).");
      return;
    }
    if (cents < MIN_CENTS) {
      setMsg("Minimum donation is $1.");
      return;
    }
    if (cents > MAX_CENTS) {
      setMsg("Maximum donation for this form is $5,000.");
      return;
    }

    try {
      setBusy(true);
      const res = await fetch("/api/checkout/donate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount_cents: cents }),
      });

      if (!res.ok) {
        // Make 404/500 obvious in the UI
        const text = await res.text().catch(() => "");
        try {
          const asJson = JSON.parse(text) as { error?: string };
          setMsg(asJson?.error || `Checkout error (${res.status})`);
        } catch {
          setMsg(text || `Checkout error (${res.status})`);
        }
        return;
      }

      const data = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (!data.ok || !data.url) {
        setMsg(data.error || "Could not start checkout. Try again.");
        return;
      }

      window.location.assign(data.url);
    } catch {
      setMsg("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-8 max-w-xl">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Donate</h1>
        <p className="muted">Your donation funds resources for veterans in crisis.</p>
      </header>

      {/* Preset buttons */}
      <div className="panel p-4">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              className="btn-ghost"
              onClick={() => {
                setAmountStr(String(p));
                // Keep caret in the input so users can tweak the value immediately
                requestAnimationFrame(() => {
                  if (inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.select();
                  }
                });
              }}
              aria-label={`Set amount to $${p}`}
            >
              ${p}
            </button>
          ))}
        </div>

        {/* Amount input */}
        <div className="mt-4">
          <label htmlFor="donation" className="block text-sm muted mb-1">
            Donation amount (USD)
          </label>
          <div className="flex gap-2">
            <span className="inline-flex items-center rounded-md border px-3">$</span>
            <input
              ref={inputRef}
              id="donation"
              name="donation"
              inputMode="decimal"
              placeholder="25"
              className="w-full rounded-md border bg-transparent px-3 py-2 outline-none"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              onBlur={() => {
                const c = dollarsToCents(amountStr);
                if (c) setAmountStr(centsToTidyDollars(c));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") donate();
                // (optional) prevent typing 'e'/'E' in some browsers numeric input handling
                if (e.key.toLowerCase() === "e") e.preventDefault();
              }}
              aria-describedby="donation-help"
            />
          </div>
          <p id="donation-help" className="text-xs muted mt-2" aria-live="polite">
            {amountCents
              ? `You’re giving $${(amountCents / 100).toFixed(2)}.`
              : "Enter any amount."}
          </p>
        </div>
      </div>

      {/* Donate button — only disabled while redirecting */}
      <div>
        <button
          type="button"
          className="btn"
          onClick={donate}
          disabled={busy}
          aria-disabled={busy}
          aria-busy={busy}
        >
          {busy ? "Redirecting…" : "Donate"}
        </button>
      </div>

      {/* Status note */}
      {msg ? (
        <p className="text-sm text-red-400" role="status" aria-live="polite">
          {msg}
        </p>
      ) : null}
    </section>
  );
}
