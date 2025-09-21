// src/components/BuyLink.tsx
"use client";

import * as React from "react";

type Bundle = "daily" | "10day" | "30day";
type Props = {
  payload: { slug: "resilient" | "homefront"; bundle?: Bundle; quantity?: number };
  className?: string;
  children?: React.ReactNode;
  label?: string;
};

export default function BuyLink({ payload, className, children, label = "Buy now" }: Props) {
  const [busy, setBusy] = React.useState(false);
  const btnLabel = busy ? "Starting…" : label;

  async function start() {
    if (busy) return;
    try {
      setBusy(true);
      const res = await fetch("/api/checkout/kit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug: payload.slug,
          bundle: payload.bundle ?? "daily",
          quantity: Math.max(1, Number(payload.quantity ?? 1)),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !json?.url) {
        alert(json?.error || `Checkout error (${res.status})`);
        return;
      }
      window.location.assign(json.url);
    } catch (e) {
      console.error(e);
      alert("Unable to start checkout.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className={className ?? "btn"}
      onClick={start}
      disabled={busy}
      aria-busy={busy}
    >
      {children ?? btnLabel}
    </button>
  );
}
