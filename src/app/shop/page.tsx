export const viewport = { themeColor: "#0b0f10" };
export const dynamic = "error";

import Link from "next/link";
import { kits } from "@/lib/kits";
import { myShopLink, buildCartLink } from "@/lib/amway";
import CopySkus from "@/components/CopySkus";

/** Local view types (don’t collide with lib types) */
type ViewItem = {
  sku: string;
  qty: number;
  title?: string;
  buy_url?: string;
  kit: { slug: string; title: string };
};

type KitLike = {
  slug: string;
  title: string;
} & Record<string, unknown>;

/** Type guards */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v);
}
function isStringOrNumber(v: unknown): v is string | number {
  return typeof v === "string" || typeof v === "number";
}
function isCartish(o: unknown): o is { sku: unknown; qty?: unknown; title?: unknown; buy_url?: unknown } {
  return isRecord(o) && "sku" in o;
}

/** Normalize a single kit into displayable items */
function toViewItems(k: KitLike): ViewItem[] {
  const itemsRaw = (k as Record<string, unknown>)["items"];
  const skusRaw = (k as Record<string, unknown>)["skus"];

  // Prefer rich items if present
  if (isArray(itemsRaw) && itemsRaw.every(isCartish)) {
    return itemsRaw.map((it) => ({
      sku: String(it.sku),
      qty: typeof it.qty === "number" ? it.qty : 1,
      title: typeof it.title === "string" ? it.title : undefined,
      buy_url: typeof it.buy_url === "string" ? it.buy_url : undefined,
      kit: { slug: k.slug, title: k.title },
    }));
  }

  // Fallback to plain SKU list
  if (isArray(skusRaw) && skusRaw.every(isStringOrNumber)) {
    return (skusRaw as Array<string | number>).map((s) => ({
      sku: String(s),
      qty: 1,
      kit: { slug: k.slug, title: k.title },
    }));
  }

  return [];
}

export const metadata = {
  title: "Shop — The Safety Plan",
  description: "Open the mission-driven storefront.",
};

export default function ShopPage() {
  const storefront = myShopLink();

  // Flatten + normalize all kit items
  const kitList = kits as unknown as KitLike[];
  const all: ViewItem[] = kitList.flatMap(toViewItems);

  // De-dupe by SKU
  const seen = new Set<string>();
  const unique = all.filter((it) => {
    if (seen.has(it.sku)) return false;
    seen.add(it.sku);
    return true;
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="space-y-1">
        <h1>Shop</h1>
        <p className="muted">
          Visit our official Amway storefront. Every order advances the mission.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a href={storefront} target="_blank" rel="noopener noreferrer" className="btn">
            Open Storefront
          </a>
          <Link href="/kits" className="btn-ghost">
            View Kits
          </Link>
        </div>
      </header>

      <div className="divider" />

      {/* Mission */}
      <section className="panel-elevated p-6 space-y-2">
        <h3 className="text-lg font-bold">Our mission</h3>
        <p className="muted">
          The Safety Plan exists to save lives. We provide clean, effective wellness kits that meet
          real needs: hydration, energy, recovery, and rest. Profits support veteran suicide
          prevention and frontline support.
        </p>
      </section>

      {/* Browse by kit */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Browse by kit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {kitList.map((k) => {
            const itemsForKit = toViewItems(k);
            const addAll = itemsForKit.length
              ? buildCartLink(itemsForKit.map((it) => ({ sku: it.sku, qty: it.qty })))
              : null;

            return (
              <div key={k.slug} className="glow-row">
                <div>
                  <div className="font-medium">{k.title}</div>
                  <div className="text-sm muted">{itemsForKit.length} items</div>
                </div>
                <div className="flex items-center gap-2">
                  {addAll && (
                    <a href={addAll} target="_blank" rel="noopener noreferrer" className="link-chip">
                      Add full kit
                    </a>
                  )}
                  <Link href={`/kits/${k.slug}/items`} className="link-chip">
                    View items
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Individual items (one-offs) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Shop individual items</h2>
        {unique.length === 0 ? (
          <div className="panel-elevated p-6">
            <p className="muted">Items coming soon.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {unique.map((it) => (
              <li key={it.sku} className="glow-row">
                <div className="min-w-0">
                  <div className="font-medium truncate">{it.title ?? "Product"}</div>
                  <div className="text-sm muted">
                    SKU: {it.sku}
                    {it.qty > 1 ? ` • Qty ${it.qty}` : ""} • in {it.kit.title}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {it.buy_url ? (
                    <a href={it.buy_url} target="_blank" rel="noopener noreferrer" className="link-chip">
                      Buy
                    </a>
                  ) : (
                    <>
                      <a href={storefront} target="_blank" rel="noopener noreferrer" className="link-chip">
                        Open Storefront
                      </a>
                      <CopySkus items={[{ sku: it.sku, qty: it.qty }]} />
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
