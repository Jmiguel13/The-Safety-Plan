// src/components/KitBreakdown.tsx
import * as React from "react";
import {
  KITS_BOM,
  VARIANT_SCALE,
  type Variant,
  type KitSlug,
  type BomItem,
  scaledQty,
} from "@/lib/kits-bom";

type Props = {
  kit: KitSlug; // "resilient" | "homefront"
  className?: string;
};

const VARIANTS: Variant[] = ["daily", "10day", "30day"];

function QtyCell({ item, v }: { item: BomItem; v: Variant }) {
  const q = scaledQty(item, v);
  return (
    <td className="whitespace-nowrap px-2 py-1 text-right tabular-nums">
      {q > 0 ? q : "—"}
    </td>
  );
}

export default function KitBreakdown({ kit, className }: Props) {
  const bom = KITS_BOM[kit] ?? [];
  const totals = (() => {
    const out: Record<Variant, number> = { daily: 0, "10day": 0, "30day": 0 };
    for (const item of bom) for (const v of VARIANTS) out[v] += scaledQty(item, v);
    return out;
  })();

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Supply breakdown</h3>
        <div className="text-xs text-zinc-400">
          Daily × {VARIANT_SCALE["daily"]} • 10-Day × {VARIANT_SCALE["10day"]} • 30-Day × {VARIANT_SCALE["30day"]}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Category</th>
              <th className="px-3 py-2 font-medium">Item</th>
              <th className="px-3 py-2 text-right font-medium">Daily</th>
              <th className="px-3 py-2 text-right font-medium">10-Day</th>
              <th className="px-3 py-2 text-right font-medium">30-Day</th>
            </tr>
          </thead>
          <tbody>
            {bom.map((item, i) => (
              <tr key={`${item.sku}-${i}`} className="border-t border-white/10">
                <td className="px-3 py-2 text-zinc-300">{item.category}</td>
                <td className="px-3 py-2">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-zinc-500">SKU {item.sku}</div>
                </td>
                <QtyCell item={item} v="daily" />
                <QtyCell item={item} v="10day" />
                <QtyCell item={item} v="30day" />
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-white/10 bg-white/[0.03]">
              <td className="px-3 py-2 text-sm font-medium" colSpan={2}>
                Total items
              </td>
              <td className="px-2 py-2 text-right tabular-nums font-semibold">{totals["daily"]}</td>
              <td className="px-2 py-2 text-right tabular-nums font-semibold">{totals["10day"]}</td>
              <td className="px-2 py-2 text-right tabular-nums font-semibold">{totals["30day"]}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="mt-2 text-xs text-zinc-500">
        Some consumables are repacked into clearly labeled day-count pouches for compact kits. Factory-sealed containers
        are included when practical.
      </p>
    </div>
  );
}
