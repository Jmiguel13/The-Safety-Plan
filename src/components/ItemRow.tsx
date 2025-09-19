// src/components/ItemRow.tsx
import CopySkus from "./CopySkus";

type Props = {
  title?: string;           // <-- make optional
  sku: string;
  qty?: number;
  note?: string;
  /** External buy URL (e.g., Amway product page). If omitted, we only show the Copy chip. */
  buyUrl?: string;
  /** Small context hint on the right (e.g., "in Homefront Kit") */
  contextRight?: string;
};

export default function ItemRow({
  title,
  sku,
  qty = 1,
  note,
  buyUrl,
  contextRight,
}: Props) {
  const displayTitle = title?.trim() || `SKU ${sku}`;  // <-- safe fallback

  return (
    <li className="glow-row">
      <div className="min-w-0">
        <div className="font-medium truncate">{displayTitle}</div>
        <div className="muted text-sm">
          <span className="opacity-80">SKU</span>{" "}
          <code className="rounded bg-black/40 px-1">{sku}</code>
          {qty > 1 ? <> × {qty}</> : null}
          {note ? <> • {note}</> : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {buyUrl ? (
          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            aria-label={`Buy ${displayTitle}`}
          >
            Buy
          </a>
        ) : null}

        <CopySkus items={[{ sku, qty }]} variant="chip" label="Copy" />

        {contextRight ? (
          <span className="hidden sm:inline text-xs text-zinc-500">{contextRight}</span>
        ) : null}
      </div>
    </li>
  );
}
