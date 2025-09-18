// src/components/ItemRow.tsx
import CopySkus from "@/components/CopySkus";
import { myShopLink } from "@/lib/amway";

export type ItemRowProps = {
  title?: string;
  sku: string;
  qty?: number;
  buyUrl?: string;
  /** Optional context displayed on the right (e.g., “in Resilient Kit”) */
  contextRight?: string;
  /** Optional note shown under the subtitle (muted) */
  note?: string;
};

export default function ItemRow({
  title,
  sku,
  qty = 1,
  buyUrl,
  contextRight,
  note,
}: ItemRowProps) {
  return (
    <li className="glow-row">
      {/* Left: title + meta */}
      <div className="min-w-0">
        <div className="font-medium truncate">{title ?? "Product"}</div>
        <div className="text-sm muted flex items-center gap-2">
          <span>SKU: {sku}</span>
          {qty > 1 ? <span className="pill !px-2 !py-0.5 text-xs">Qty {qty}</span> : null}
        </div>
        {note ? <div className="text-sm muted mt-0.5">{note}</div> : null}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {contextRight ? (
          <span className="hidden md:inline text-xs muted">{contextRight}</span>
        ) : null}

        {buyUrl ? (
          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-chip"
            aria-label={`Buy ${title ?? sku}`}
          >
            Buy
          </a>
        ) : (
          <a
            href={myShopLink(sku || "/")}
            target="_blank"
            rel="noopener noreferrer"
            className="link-chip"
            aria-label={`View ${title ?? sku} on MyShop`}
          >
            View on MyShop
          </a>
        )}

        {/* Always offer copy for quick manual add */}
        <CopySkus items={[{ sku, qty }]} />
      </div>
    </li>
  );
}

