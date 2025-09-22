"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

/** Quick-pick buttons */
const PRESETS = [10, 25, 50, 100] as const;
/** Server-side limits for this simple form */
const MIN_CENTS = 100;      // $1.00
const MAX_CENTS = 500_000;  // $5,000.00

const PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const TEST_MODE = PK.startsWith("pk_test_");

/* ------------ currency helpers (no locale surprises) ------------ */
function dollarsToCents(input: string): number | null {
  const clean = (input ?? "").replace(/[^\d.]/g, "");
  if (!clean) return null;
  const parts = clean.split(".");
  const normalized =
    parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : clean;
  const n = Number(normalized);
  if (!Number.isFinite(n)) return null;
  const cents = Math.round(n * 100);
  return cents > 0 ? cents : null;
}

function centsToTidyDollars(cents: number): string {
  const s = (cents / 100).toFixed(2);
  return s.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

type ApiOk = { ok: true; url: string };
type ApiErr = { ok: false; error: string };

/* ------------------------------ UI ------------------------------ */
export default function DonateClient() {
  const search = useSearchParams();
  const [amountStr, setAmountStr] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Prefill from ?amount=25 or ?a=25 (run once on mount)
  useEffect(() => {
    const q = search?.get("amount") ?? search?.get("a");
    if (q) {
      const c = dollarsToCents(q);
      if (c) setAmountStr(centsToTidyDollars(c));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const amountCents = useMemo(() => dollarsToCents(amountStr), [amountStr]);

  async function donate() {
    if (busy) return;
    setMsg(null);

    const cents = dollarsToCents(amountStr);
    if (!cents) return setMsg("Please enter an amount (minimum $1).");
    if (cents < MIN_CENTS) return setMsg("Minimum donation is $1.");
    if (cents > MAX_CENTS) return setMsg("Maximum donation for this form is $5,000.");

    try {
      setBusy(true);

      // ✅ Send CENTS to the API (exact, no floating error)
      const res = await fetch("/api/checkout/donate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount_cents: cents }),
      });

      const data = (await res.json().catch(() => ({}))) as ApiOk | ApiErr | { url?: string; error?: string };

      // Be tolerant of legacy shapes ({url} without ok)
      const url =
        "url" in data && typeof data.url === "string"
          ? data.url
          : (data as ApiOk).ok
          ? (data as ApiOk).url
          : undefined;

      if (!res.ok || !url) {
        const err =
          ("error" in data && typeof data.error === "string" && data.error) ||
          `Unable to start Stripe Checkout (status ${res.status}).`;
        setMsg(err);
        return;
      }

      window.location.assign(url);
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
        {TEST_MODE && (
          <p className="text-xs rounded-md border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 text-yellow-200 inline-block">
            Test mode (no real charges).
          </p>
        )}
      </header>

      <div className="panel p-4">
        {/* Quick picks */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              className={`btn-ghost ${amountStr === String(p) ? "ring-1 ring-emerald-500/50" : ""}`}
              onClick={() => {
                setAmountStr(String(p));
                requestAnimationFrame(() => {
                  inputRef.current?.focus();
                  inputRef.current?.select();
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
          <div className="flex gap-2 items-center">
            <span className="inline-flex items-center rounded-md border px-3 select-none">$</span>
            <input
              ref={inputRef}
              id="donation"
              name="donation"
              type="text"           // text + inputMode avoids browser number quirks
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
                const k = e.key.toLowerCase();
                if (k === "e" || k === "+" || k === "-") e.preventDefault();
              }}
              aria-describedby="donation-help"
            />
          </div>
          <p id="donation-help" className="text-xs muted mt-2" aria-live="polite">
            {amountCents ? `You’re giving $${(amountCents / 100).toFixed(2)}.` : "Enter any amount."}
          </p>
        </div>
      </div>

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

      {msg ? (
        <p className="text-sm text-red-400" role="status" aria-live="polite">
          {msg}
        </p>
      ) : null}
    </section>
  );
}
