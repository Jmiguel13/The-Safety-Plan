"use client";

import * as React from "react";

type Variant = "daily" | "10day" | "30day";

const VARIANT_LABEL: Record<Variant, string> = {
  daily: "Daily",
  "10day": "10-Day Supply",
  "30day": "30-Day Supply",
};

type Props = {
  kit: { slug: "homefront" | "resilient"; title?: string };
  className?: string;
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

export default function KitCheckoutForm({ kit, className }: Props) {
  const [variant, setVariant] = React.useState<Variant>("10day");
  const [qty, setQty] = React.useState<number>(1);
  const [busy, setBusy] = React.useState<boolean>(false);
  const [err, setErr] = React.useState<string | null>(null);

  const clamp = (n: number) =>
    Math.max(1, Math.min(10, Number.isFinite(n) ? n : 1));

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
        const text = await res.text();
        payload = { error: text } as CheckoutError;
      }

      if (!res.ok || !isCheckoutSuccess(payload)) {
        const message = isCheckoutError(payload)
          ? payload.error
          : `Checkout failed (${res.status}).`;
        throw new Error(message);
      }

      window.location.assign(payload.url);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Checkout failed. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className={className}>
      <div className="grid gap-3 sm:grid-cols-[1fr,auto]">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-400">Kit option</span>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as Variant)}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2"
            >
              <option value="daily">{VARIANT_LABEL.daily}</option>
              <option value="10day">{VARIANT_LABEL["10day"]}</option>
              <option value="30day">{VARIANT_LABEL["30day"]}</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-400">Quantity</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setQty((q) => clamp(q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                aria-label="Quantity"
                className="w-16 rounded-xl border border-zinc-700 bg-zinc-900 px-2 py-2 text-center"
                type="number"
                min={1}
                max={10}
                value={qty}
                onChange={(e) => setQty(clamp(parseInt(e.target.value, 10)))}
              />
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setQty((q) => clamp(q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </label>
        </div>

        <button type="button" className="btn" onClick={onBuy} disabled={busy}>
          {busy ? "Redirecting…" : "Buy now"}
        </button>
      </div>

      {err ? <p className="mt-2 text-sm text-red-400">{err}</p> : null}
      {!err ? (
        <p className="mt-2 text-xs text-zinc-500">
          Variant: <span className="uppercase">{VARIANT_LABEL[variant]}</span>
        </p>
      ) : null}
    </div>
  );
}
