"use client";

import * as React from "react";

type Props = {
  kit: { slug: "resilient" | "homefront"; title?: string };
  className?: string;
};

export default function KitCheckoutForm({ kit, className }: Props) {
  const [qty, setQty] = React.useState(1);
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  async function buyNow() {
    if (busy) return;
    setMsg(null);
    try {
      setBusy(true);
      const res = await fetch("/api/checkout/kit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: kit.slug, quantity: qty }),
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
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            disabled={busy}
          >
            –
          </button>
          <span className="min-w-[2ch] text-center tabular-nums">{qty}</span>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            aria-label="Increase quantity"
            disabled={busy}
          >
            +
          </button>
        </div>

        <button
          type="button"
          className="btn"
          onClick={buyNow}
          disabled={busy}
          aria-busy={busy}
        >
          {busy ? "Starting…" : "Buy now"}
        </button>
      </div>

      {msg ? (
        <p className="mt-2 text-sm text-red-400" role="status" aria-live="polite">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
