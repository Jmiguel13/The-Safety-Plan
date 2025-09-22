"use client";

import * as React from "react";

type Props = {
  priceId: string;           // Stripe Price ID (e.g. price_123)
  quantity?: number;         // default 1
  className?: string;
  children?: React.ReactNode;
};

export default function BuyPriceButton({
  priceId,
  quantity = 1,
  className,
  children = "Buy",
}: Props) {
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  async function start() {
    if (busy) return;
    setMsg(null);

    if (!priceId || !/^price_/.test(priceId)) {
      setMsg("Missing or invalid Stripe price id. Configure your price in env.");
      return;
    }

    try {
      setBusy(true);
      const res = await fetch("/api/checkout/price", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ priceId, quantity }),
      });

      const data = (await res
        .json()
        .catch(() => ({ ok: false, error: "Unexpected response from server." }))) as
        | { ok: true; url: string }
        | { ok: false; error: string };

      if (!res.ok || !("ok" in data) || !data.ok || !("url" in data)) {
        setMsg(("error" in data && data.error) || `Checkout error (${res.status}).`);
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
    <div className={className}>
      <button type="button" className="btn-ghost" onClick={start} disabled={busy} aria-busy={busy}>
        {busy ? "Starting…" : children}
      </button>
      {msg ? (
        <p className="mt-2 text-xs text-red-400" role="status" aria-live="polite">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
