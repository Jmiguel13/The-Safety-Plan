// src/components/KitItemsList.tsx
import { myShopLink } from "@/lib/amway";
import { catalogLookup } from "@/lib/catalog";
import type { NormalizedItem } from "@/lib/kits-helpers";

export default function KitItemsList({ items }: { items: NormalizedItem[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">What’s inside</h2>

      <ul className="divide-y divide-zinc-800 rounded-xl border border-zinc-800">
        {items.map((it, idx) => {
          const cat = catalogLookup(it.sku);
          const title = it.title || cat?.title || it.sku;
          const url = it.buy_url || cat?.url || myShopLink(it.sku);

          return (
            <li
              key={`${it.sku}-${idx}`}
              className="p-4 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="font-medium truncate">{title}</div>
                <div className="text-xs text-zinc-400">
                  SKU {it.sku} • Qty {it.qty}
                  {it.note ? (
                    <>
                      {" "}
                      • <span>{it.note}</span>
                    </>
                  ) : null}
                </div>
              </div>

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-sm whitespace-nowrap"
                aria-label={`View ${title} on MyShop`}
              >
                View on MyShop
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

