"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const PRESETS = [10, 25, 50, 100] as const;
const MIN_CENTS = 100;     // $1.00
const MAX_CENTS = 500_000; // $5,000.00

const PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const TEST_MODE = PK.startsWith("pk_test_");

// --- helpers ---
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

export default function DonatePage() {
  const search = useSearchParams();
  const [amountStr, setAmountStr] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [banner, setBanner] = useState<null | { kind: "ok" | "warn"; text: string }>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // prefills
  useEffect(() => {
    const q = search?.get("amount") ?? search?.get("a");
    if (q) {
      const c = dollarsToCents(q);
      if (c) setAmountStr(centsToTidyDollars(c));
    }
    if (search?.get("success") === "1") {
      setBanner({ kind: "ok", text: "Thank you! Your donation was processed." });
    } else if (search?.get("canceled") === "1") {
      setBanner({ kind: "warn", text: "Checkout canceled — no charge made." });
    }
  }, [search]);

  const amountCents = useMemo(() => dollarsToCents(amountStr), [amountStr]);
  const isValid =
    typeof amountCents === "number" &&
    amountCents >= MIN_CENTS &&
    amountCents <= MAX_CENTS;

  async function donate() {
    if (busy || !isValid) return;
    setMsg(null);
    try {
      setBusy(true);
      const res = await fetch("/api/checkout/donate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount_cents: amountCents }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        url?: string;
        error?: string;
        queued?: boolean;
      };

      if (res.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      if (res.ok && data.queued) {
        setMsg("Donation processing is temporarily offline. We’ve recorded your intent and will follow up.");
        return;
      }
      setMsg(data?.error || `Checkout error (${res.status}).`);
    } catch {
      setMsg("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Donate</h1>
        <p className="muted">
          Your donation <strong>helps with</strong> prevention, outreach, and response for veterans in crisis.
        </p>

        {TEST_MODE && (
          <span className="inline-block rounded-md border border-yellow-500/40 bg-yellow-500/10 px-2 py-1 text-xs text-yellow-200">
            Test mode (no real charges)
          </span>
        )}
        {banner && (
          <div
            className={[
              "mt-2 rounded-md px-3 py-2 text-sm",
              banner.kind === "ok"
                ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                : "border border-zinc-500/40 bg-zinc-500/10 text-zinc-200",
            ].join(" ")}
            role="status"
          >
            {banner.text}
          </div>
        )}
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          donate();
        }}
        className="rounded-2xl border border-[color:var(--border)] bg-white/[0.03] p-4 md:p-5"
      >
        {/* presets */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const selected = amountCents === p * 100;
            return (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setAmountStr(String(p));
                  requestAnimationFrame(() => {
                    inputRef.current?.focus();
                    inputRef.current?.select();
                  });
                }}
                className={[
                  "rounded-full border px-3 py-1.5 text-sm transition",
                  selected
                    ? "border-emerald-500/60 bg-emerald-500/10"
                    : "border-white/10 hover:border-white/20",
                ].join(" ")}
                aria-pressed={selected}
                aria-label={`Set amount to $${p}`}
              >
                ${p}
              </button>
            );
          })}
        </div>

        {/* amount input */}
        <div className="mt-4">
          <label htmlFor="donation" className="block text-sm muted mb-1">
            Donation amount (USD)
          </label>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md border border-[color:var(--border)] px-3 select-none">
              $
            </span>
            <input
              ref={inputRef}
              id="donation"
              name="donation"
              inputMode="decimal"
              placeholder="25"
              className="w-full rounded-md border border-[color:var(--border)] bg-transparent px-3 py-2 outline-none focus:border-white/30"
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
              aria-invalid={!isValid}
            />
          </div>
          <p id="donation-help" className="mt-2 text-xs muted" aria-live="polite">
            {amountCents
              ? `You’re giving $${(amountCents / 100).toFixed(2)}.`
              : "Enter any amount (min $1, max $5,000)."}
          </p>
          {!isValid && amountStr ? (
            <p className="mt-1 text-xs text-red-400">
              Amount must be between $1 and $5,000.
            </p>
          ) : null}
        </div>

        {/* submit */}
        <div className="mt-5">
          <button
            type="submit"
            className="btn"
            disabled={!isValid || busy}
            aria-disabled={!isValid || busy}
            aria-busy={busy}
          >
            {busy ? "Redirecting…" : "Donate"}
          </button>
        </div>

        {/* inline error */}
        {msg ? (
          <div
            className="mt-3 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
            role="status"
            aria-live="polite"
          >
            {msg}
          </div>
        ) : null}
      </form>

      {/* trust row */}
      <div className="rounded-2xl border border-[color:var(--border)] bg-white/[0.03] p-4">
        <ul className="grid gap-3 text-sm sm:grid-cols-3">
          <li><span className="font-semibold">Secure:</span> Stripe Checkout</li>
          <li><span className="font-semibold">Receipts:</span> Emailed after payment</li>
          <li><span className="font-semibold">Impact:</span> Helps with outreach &amp; response</li>
        </ul>
      </div>

      <p className="text-sm text-zinc-400">
        Need help? Email{" "}
        <a className="underline underline-offset-4" href="mailto:contactsafetyplan@yahoo.com">
          contactsafetyplan@yahoo.com
        </a>.
      </p>
    </section>
  );
}
