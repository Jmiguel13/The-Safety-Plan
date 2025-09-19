// src/components/CopySkus.tsx
"use client";

import { useMemo, useState } from "react";

type Item = { sku: string; qty?: number };

export default function CopySkus({
  items,
  label,
  className,
  /** "button" renders a full button; "chip" renders a small pill. Default auto: >1 items => button, 1 item => chip */
  variant,
}: {
  items: Item[];
  label?: string;
  className?: string;
  variant?: "button" | "chip";
}) {
  const [copied, setCopied] = useState(false);

  const text = useMemo(
    () => items.map((i) => `${i.sku} x${typeof i.qty === "number" ? i.qty : 1}`).join("\n"),
    [items]
  );

  const look = variant ?? (items.length > 1 ? "button" : "chip");
  const classes =
    look === "chip"
      ? `link-chip ${className ?? ""}` // small pill
      : `btn-ghost ${className ?? ""}`; // full ghost button

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
      } catch {}
      document.body.removeChild(el);
    } finally {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  }

  return (
    <button type="button" onClick={onCopy} className={classes.trim()}>
      {copied ? "Copied!" : label ?? (items.length > 1 ? "Copy SKUs" : "Copy")}
    </button>
  );
}
