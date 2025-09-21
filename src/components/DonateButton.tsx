"use client";

import * as React from "react";

type Props = {
  amountCents?: number; // e.g. 2500 = $25.00
  className?: string;
  children?: React.ReactNode;
};

export default function DonateButton({
  amountCents = 2500,
  className,
  children,
}: Props) {
  const [loading, setLoading] = React.useState(false);

  async function go() {
    try {
      setLoading(true);
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        // IMPORTANT: API expects amount_cents; also sends amount for compatibility
        body: JSON.stringify({ amount_cents: amountCents, amount: amountCents }),
      });
      const json = await res.json();
      if (json?.url) {
        window.location.href = json.url as string;
      } else {
        alert(json?.error || "Unable to start donation checkout.");
      }
    } catch (e) {
      console.error(e);
      alert("Unable to start donation checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={go}
      disabled={loading}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-full px-4 py-2 border border-white/20 hover:border-white/40 transition"
      }
    >
      {children ?? (loading ? "Starting…" : "Donate")}
    </button>
  );
}
