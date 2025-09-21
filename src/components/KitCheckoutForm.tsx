// src/components/KitCheckoutForm.tsx
"use client";

import { useState, useMemo } from "react";
import { type Kit } from "@/lib/kits";

type Props = { kit: Kit };

export default function KitCheckoutForm({ kit }: Props) {
  const [fullKit, setFullKit] = useState(true);
  const [qty, setQty] = useState(1);

  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    (kit.items ?? []).forEach((i) => (init[i.sku] = true));
    return init;
  });

  const selections = useMemo(() => {
    if (fullKit) return (kit.items ?? []).map((i) => ({ sku: i.sku, qty: i.qty ?? 1 }));
    return (kit.items ?? [])
      .filter((i) => selected[i.sku])
      .map((i) => ({ sku: i.sku, qty: i.qty ?? 1 }));
  }, [fullKit, selected, kit.items]);

  async function onCheckout() {
    const res = await fetch("/api/checkout/kit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug: kit.slug, quantity: qty, selections }),
    });
    if (!res.ok) {
      const txt = await res.text();
      alert(`Checkout error: ${txt}`);
      return;
    }
    const data = (await res.json()) as { url?: string };
    if (data.url) window.location.href = data.url;
  }

  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              className="size-4 accent-emerald-400"
              checked={fullKit}
              onChange={(e) => setFullKit(e.target.checked)}
            />
            Buy full kit
          </label>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-400">Qty</span>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
              className="w-16 rounded-md border border-zinc-800 bg-black px-2 py-1 text-right"
            />
          </div>
        </div>

        {!fullKit && (
          <div className="mt-4 grid gap-2">
            {(kit.items ?? []).map((item) => (
              <label
                key={item.sku}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2"
              >
                <span className="text-sm text-white">{item.title}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500">SKU {item.sku}</span>
                  <input
                    type="checkbox"
                    className="size-4 accent-emerald-400"
                    checked={!!selected[item.sku]}
                    onChange={(e) => setSelected((s) => ({ ...s, [item.sku]: e.target.checked }))}
                  />
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onCheckout}
        className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-black hover:bg-emerald-300"
      >
        Buy now with Stripe
      </button>

      <div className="text-xs text-zinc-500">
        Want single items? Use our MyShop links on the kit items page.
      </div>
    </div>
  );
}
