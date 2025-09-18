// src/components/BuyButtons.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { type CartItem, MYSHOP_BASE } from "@/lib/amway";

export default function BuyButtons({
  items,
  fallbackSkusTitle = "Kit Contents (SKUs)",
}: { items: CartItem[]; fallbackSkusTitle?: string }) {
  const [showFallback, setShowFallback] = useState(false);

  const openBuy = () => {
    // Open MyShop storefront root, then show the SKUs helper modal.
    const w = window.open(MYSHOP_BASE, "_blank", "noopener,noreferrer");
    if (!w) {
      // Popup blocked: navigate this tab as a fallback.
      window.location.href = MYSHOP_BASE;
    }
    setShowFallback(true);
  };

  const copySkus = async () => {
    const text = items.map((i) => `${i.sku} x${i.qty ?? 1}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      alert("All SKUs copied.");
    } catch {
      // Silently ignore if clipboard not available
    }
  };

  const copyOne = async (sku: string, qty = 1) => {
    try {
      await navigator.clipboard.writeText(`${sku} x${qty}`);
    } catch {
      /* noop */
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={openBuy}
          className="rounded-full bg-emerald-400 px-4 py-2 text-black hover:bg-emerald-300"
        >
          Buy Now
        </button>

        <a
          href={MYSHOP_BASE}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-zinc-700 px-4 py-2 hover:bg-zinc-900"
        >
          Open Storefront
        </a>

        <Link
          href="/kits"
          className="rounded-full border border-zinc-700 px-4 py-2 hover:bg-zinc-900"
        >
          View Kit Details
        </Link>
      </div>

      {showFallback && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowFallback(false)}
          />
          <div className="absolute inset-0 mx-auto flex max-w-lg items-center justify-center p-4">
            <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Add these items to your cart</h3>
                <button
                  onClick={() => setShowFallback(false)}
                  className="rounded-md border border-zinc-700 px-2 py-1 text-xs hover:bg-zinc-900"
                >
                  Close
                </button>
              </div>

              <p className="mt-2 text-sm text-zinc-300">
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
                        className="rounded-md border border-zinc-700 px-2 py-1 text-xs hover:bg-zinc-800"
                      >
                        Copy
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex gap-3">
                <a
                  href={MYSHOP_BASE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white px-4 py-2 text-black hover:bg-zinc-100"
                >
                  Open Storefront
                </a>
                <button
                  onClick={copySkus}
                  className="rounded-full border border-zinc-700 px-4 py-2 hover:bg-zinc-900"
                >
                  Copy All
                </button>
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

