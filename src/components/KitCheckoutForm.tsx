// src/components/KitCheckoutForm.tsx
"use client";

import * as React from "react";

type Variant = "daily" | "10day" | "30day";

const VARIANT_LABEL: Record<Variant, string> = {
  daily: "Daily",
  "10day": "10-Day Supply",
  "30day": "30-Day Supply",
};

type Price = { unitAmount: number; currency: string };
type Prices = Partial<Record<Variant, Price>>;

type Props = {
  kit: { slug: "homefront" | "resilient"; title?: string };
  className?: string;
  /** Optional: pass server-fetched prices for a live total */
  prices?: Prices;
};

type CheckoutSuccess = { url: string };
type CheckoutError = { error: string };

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}
function isCheckoutSuccess(value: unknown): value is CheckoutSuccess {
  return isObject(value) && typeof (value as CheckoutSuccess).url === "string";
}
function isCheckoutError(value: unknown): value is CheckoutError {
  return isObject(value) && typeof (value as CheckoutError).error === "string";
}

/** Small util so we don’t import any server code */
function formatUsd(cents: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(2)}`;
  }
}

export default function KitCheckoutForm({ kit, className, prices }: Props) {
  const [variant, setVariant] = React.useState<Variant>("10day");
  const [qty, setQty] = React.useState<number>(1);
  const [busy, setBusy] = React.useState<boolean>(false);
  const [err, setErr] = React.useState<string | null>(null);

  const qtyId = React.useId();
  const variantId = React.useId();
  const statusRef = React.useRef<HTMLParagraphElement>(null);

  const clamp = (n: number) => Math.max(1, Math.min(10, Number.isFinite(n) ? n : 1));

  const totalCents = React.useMemo(() => {
    const p = prices?.[variant];
    return p ? { total: p.unitAmount * qty, currency: p.currency } : { total: null, currency: "USD" };
  }, [prices, variant, qty]);

  async function onBuy() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/checkout/kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: kit.slug, variant, quantity: qty }),
      });

      const ctype = res.headers.get("content-type") ?? "";
      let payload: unknown;

      if (ctype.includes("json")) {
        payload = (await res.json()) as unknown;
      } else {
        payload = { error: await res.text() } as CheckoutError;
      }

      if (!res.ok || !isCheckoutSuccess(payload)) {
        const message = isCheckoutError(payload) ? payload.error : `Checkout failed (${res.status}).`;
        throw new Error(message);
      }

      // Redirect to Stripe
      window.location.assign(payload.url);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Checkout failed. Try again.";
      setErr(message);
      setBusy(false);
      // Move focus to the status line for screen readers
      queueMicrotask(() => statusRef.current?.focus());
    }
  }

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        if (!busy) void onBuy();
      }}
    >
      <div className="grid gap-3 sm:grid-cols-[1fr,auto]">
        {/* Controls */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Variant */}
          <label htmlFor={variantId} className="flex flex-col gap-1">
            <span className="text-xs text-zinc-400">Kit option</span>
            <select
              id={variantId}
              value={variant}
              onChange={(e) => setVariant(e.target.value as Variant)}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2"
              disabled={busy}
            >
              <option value="daily">{VARIANT_LABEL.daily}</option>
              <option value="10day">{VARIANT_LABEL["10day"]}</option>
              <option value="30day">{VARIANT_LABEL["30day"]}</option>
            </select>
          </label>

          {/* Quantity */}
          <label htmlFor={qtyId} className="flex flex-col gap-1">
            <span className="text-xs text-zinc-400">Quantity</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setQty((q) => clamp(q - 1))}
                aria-label="Decrease quantity"
                aria-controls={qtyId}
                disabled={busy}
              >
                −
              </button>
              <input
                id={qtyId}
                aria-label="Quantity"
                className="w-16 rounded-xl border border-zinc-700 bg-zinc-900 px-2 py-2 text-center"
                type="number"
                inputMode="numeric"
                min={1}
                max={10}
                value={qty}
                onChange={(e) => setQty(clamp(parseInt(e.target.value, 10)))}
                onBlur={(e) => setQty(clamp(parseInt(e.target.value, 10)))}
                disabled={busy}
              />
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setQty((q) => clamp(q + 1))}
                aria-label="Increase quantity"
                aria-controls={qtyId}
                disabled={busy}
              >
                +
              </button>
            </div>
          </label>
        </div>

        {/* Buy button */}
        <button type="submit" className="btn" disabled={busy}>
          {busy ? "Redirecting…" : `Buy now`}
        </button>
      </div>

      {/* Status / price preview */}
      <p
        ref={statusRef}
        tabIndex={-1}
        className={`mt-2 text-xs ${err ? "text-red-400" : "text-zinc-500"}`}
        aria-live="polite"
        role={err ? "alert" : undefined}
      >
        {err
          ? err
          : totalCents.total != null
          ? `Total: ${formatUsd(totalCents.total, totalCents.currency)} for ${qty} × ${VARIANT_LABEL[variant]}`
          : `Variant: ${VARIANT_LABEL[variant]}. Price shown at checkout.`}
      </p>
    </form>
  );
}
