// src/components/BuyButtons.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { type CartItem, MYSHOP_BASE } from "@/lib/amway";
import CopySkus from "./CopySkus";

export default function BuyButtons({
  items,
  fallbackSkusTitle = "Kit Contents (SKUs)",
}: {
  items: CartItem[];
  fallbackSkusTitle?: string;
}) {
  const [showFallback, setShowFallback] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  function openBuy() {
    // Open MyShop in a new tab. If blocked, navigate this tab.
    const w = window.open(MYSHOP_BASE, "_blank", "noopener,noreferrer");
    if (!w) window.location.href = MYSHOP_BASE;
    setShowFallback(true);
  }

  async function copyOne(sku: string, qty = 1) {
    try {
      await navigator.clipboard.writeText(`${sku} x${qty}`);
    } catch {
      // Best-effort; no toast to keep it quiet in prod
    }
  }

  // Focus the close button when dialog opens (basic a11y affordance)
  useEffect(() => {
    if (showFallback) closeBtnRef.current?.focus();
  }, [showFallback]);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button onClick={openBuy} className="btn" aria-haspopup="dialog">
          Buy Now
        </button>

        <a
          href={MYSHOP_BASE}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
          aria-label="Open MyShop storefront"
        >
          Open Storefront
        </a>

        {/* Optional extra CTA back to kits index */}
        <Link href="/kits" className="btn-ghost">
          View Kit Details
        </Link>
      </div>

      {showFallback && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="skus-helper-title"
          aria-describedby="skus-helper-desc"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowFallback(false)}
          />
          <div className="absolute inset-0 mx-auto flex max-w-lg items-center justify-center p-4">
            <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-center justify-between">
                <h3 id="skus-helper-title" className="text-lg font-semibold">
                  Add these items to your cart
                </h3>
                <button
                  ref={closeBtnRef}
                  onClick={() => setShowFallback(false)}
                  className="btn-ghost px-2 py-1 text-xs"
                >
                  Close
                </button>
              </div>

              <p id="skus-helper-desc" className="mt-2 text-sm text-zinc-300">
                We opened your MyShop in a new tab. Paste each SKU into the Amway search bar and
                click <span className="font-medium">Add to Cart</span>. Use “Copy” for quick paste.
              </p>

              <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm">
                <div className="mb-2 text-xs uppercase tracking-wide text-zinc-400">
                  {fallbackSkusTitle}
                </div>
                <ul className="grid gap-1">
                  {items.map((i) => (
                    <li
                      key={i.sku}
                      className="flex items-center justify-between gap-3 text-zinc-200"
                    >
                      <span>
                        <code className="rounded bg-zinc-950 px-1">{i.sku}</code> × {i.qty ?? 1}
                      </span>
                      <button
                        onClick={() => copyOne(i.sku, i.qty ?? 1)}
                        className="btn-ghost px-2 py-1 text-xs"
                      >
                        Copy
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={MYSHOP_BASE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  Open Storefront
                </a>

                <CopySkus items={items} label="Copy All" />
              </div>

              <p className="mt-3 text-xs text-zinc-500">
                Tip: Search by SKU, add to cart, repeat. If a SKU is out of stock, pick a close
                variant.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
