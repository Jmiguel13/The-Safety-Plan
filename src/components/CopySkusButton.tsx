// src/components/CopySkusButton.tsx
"use client";

import { useState } from "react";

type SkuQty = { sku: string; qty: number };
type Props = { skus: SkuQty[] };

export default function CopySkusButton({ skus }: Props) {
  const [copied, setCopied] = useState<"idle" | "ok" | "err">("idle");

  async function onCopy() {
    const csv = skus.map(({ sku, qty }) => `${sku} x${qty}`).join(", ");
    const lines = skus.map(({ sku, qty }) => `${sku},${qty}`).join("\n");
    const payload = `${csv}\n\nCSV:\nsku,qty\n${lines}\n`;

    try {
      await navigator.clipboard.writeText(payload);
      setCopied("ok");
      setTimeout(() => setCopied("idle"), 1500);
    } catch {
      setCopied("err");
      setTimeout(() => setCopied("idle"), 1500);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex items-center rounded-full border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900"
      aria-live="polite"
    >
      {copied === "ok" ? "Copied ✓" : copied === "err" ? "Copy failed" : "Copy SKUs"}
    </button>
  );
}
