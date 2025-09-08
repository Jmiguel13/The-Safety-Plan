// src/app/kits/[slug]/items/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import CopySkus from "@/components/CopySkus";
import { kits, type Kit, type KitItem } from "@/lib/kits";
import { myShopLink, buildCartLink } from "@/lib/amway";

type NormItem = {
  title?: string;
  sku: string;
  qty: number;
  buy_url?: string;
  note?: string;
};

export const dynamic = "force-dynamic";

/** Find a kit by slug (typed) */
function findKit(slug: string): Kit | null {
  const list = kits as Kit[];
  return list.find((k) => k.slug === slug) ?? null;
}

/** Prefer items[]; fallback to skus[] */
function normalizeItems(k: Kit): NormItem[] {
  if (Array.isArray(k.items)) {
    return k.items.map((it: KitItem) => ({
      title: it.title,
      sku: String(it.sku),
      qty: typeof it.qty === "number" ? it.qty : 1,
      buy_url: it.buy_url,
      note: it.note,
    }));
  }
  if (Array.isArray(k.skus)) {
    return k.skus.map((s) => ({ sku: String(s), qty: 1 }));
  }
  return [];
}

export default function KitItemsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const kit = findKit(slug);
  if (!kit) notFound();

  const title = kit.title ?? `${slug[0]?.toUpperCase() ?? ""}${slug.slice(1)} Kit`;

  const items = normalizeItems(kit);
  const addAllUrl = items.length
    ? buildCartLink(items.map((i) => ({ sku: i.sku, qty: i.qty })))
    : null;

  return (
    <section className="space-y-8 max-w-4xl">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {title}
          <span aria-hidden="true">{" — "}</span>
          Items
        </h1>
        <p className="muted">
          Everything included in this kit. Buy individually or add the full kit.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          {addAllUrl ? (
            <a
              href={addAllUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              aria-label="Add full kit to MyShop cart"
            >
              Add full kit to cart
            </a>
          ) : null}

          {items.length > 0 ? (
            <CopySkus items={items.map((i) => ({ sku: i.sku, qty: i.qty }))} />
          ) : null}

          <a
            href={myShopLink("/")} // root storefront
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            Open Storefront
          </a>

          <Link href={`/kits/${slug}`} className="btn-ghost">
            Back to kit
          </Link>
        </div>
      </header>

      {/* Items list */}
      {items.length === 0 ? (
        <div className="panel-elevated p-6">
          <p className="muted">
            No items yet. Add SKUs in <code>src/lib/kits.ts</code>.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.sku} className="glow-row">
              <div className="min-w-0">
                <div className="font-medium truncate">
                  {it.title ?? "Product"}
                </div>
                <div className="text-sm muted">
                  SKU: {it.sku}
                  {it.qty > 1 ? (
                    <>
                      <span aria-hidden="true">{" • Qty "}</span>
                      {it.qty}
                    </>
                  ) : null}
                </div>
                {it.note ? <div className="text-sm muted">{it.note}</div> : null}
              </div>

              <div className="flex items-center gap-2">
                {it.buy_url ? (
                  <a
                    href={it.buy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-chip"
                  >
                    Buy
                  </a>
                ) : (
                  <>
                    {/* Direct to the single product on your MyShop when possible */}
                    <a
                      href={myShopLink(it.sku)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-chip"
                      aria-label={`View SKU ${it.sku} on MyShop`}
                    >
                      View on MyShop
                    </a>
                    {/* Single-SKU copier */}
                    <CopySkus items={[{ sku: it.sku, qty: it.qty }]} />
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Bottom CTA */}
      <div className="flex flex-wrap gap-3">
        {addAllUrl ? (
          <a
            href={addAllUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            aria-label="Add full kit to MyShop cart"
          >
            Add full kit to cart
          </a>
        ) : null}
        <Link href={`/kits/${slug}`} className="btn-ghost">
          Back to kit
        </Link>
      </div>
    </section>
  );
}
