"use client";

import * as React from "react";

type CheckoutResponse = {
  url?: string;
  error?: string;
  message?: string;
};

type Props = {
  priceId: string;
  quantity?: number;
  className?: string;
  label?: string;
  onStart?: () => void;
  onSuccess?: (checkoutUrl: string) => void;
  onError?: (message: string) => void;
};

export default function BuyPriceButton({
  priceId,
  quantity = 1,
  className,
  label = "Buy",
  onStart,
  onSuccess,
  onError,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  async function start() {
    const qty = Math.max(1, Number.isFinite(quantity as number) ? Number(quantity) : 1);
    const validId = typeof priceId === "string" && /^price_[a-zA-Z0-9]+$/.test(priceId);
    if (!validId) {
      const msg = "Invalid or missing Stripe price id.";
      onError?.(msg);
      alert(msg);
      return;
    }

    try {
      setLoading(true);
      onStart?.();

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const res = await fetch("/api/checkout/price", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ priceId, quantity: qty }),
        signal: abortRef.current.signal,
      });

      let json: CheckoutResponse | null = null;
      try {
        json = (await res.json()) as CheckoutResponse;
      } catch {
        json = null;
      }

      if (!res.ok) {
        const msg = (json?.error || json?.message) ?? "Checkout unavailable.";
        onError?.(msg);
        alert(msg);
        return;
      }

      const url = json?.url;
      if (typeof url !== "string" || !/^https?:\/\//.test(url)) {
        const msg = "Unexpected response from checkout.";
        onError?.(msg);
        alert(msg);
        return;
      }

      onSuccess?.(url);
      window.location.assign(url);
    } catch (e) {
      console.error(e);
      const msg = "Unable to start checkout.";
      onError?.(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  const disabled = !priceId || loading;

  return (
    <button
      type="button"
      onClick={start}
      disabled={disabled}
      aria-busy={loading}
      data-state={loading ? "loading" : "idle"}
      className={
        className ??
        "rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-60"
      }
      title={priceId ? undefined : "Missing Stripe price id"}
    >
      {loading ? "Starting…" : label}
    </button>
  );
}
