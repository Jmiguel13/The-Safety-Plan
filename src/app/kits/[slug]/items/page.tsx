// src/app/kits/[slug]/items/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { kits, type Kit } from "@/lib/kits";
import { myShopLink, MYSHOP_BASE } from "@/lib/amway";

type NormItem = {
  title?: string;
  sku: string;
  qty: number;
  buy_url?: string;
  note?: string;
};

export const dynamic = "force-dynamic";

/** Find a kit by slug */
function findKit(slug: string): Kit | null {
  const list = kits as Kit[];
  return list.find((k) => k.slug === slug) ?? null;
}

/** Normalize items[] for display */
function normalizeItems(k: Kit): NormItem[] {
  if (!Array.isArray(k.items)) return [];
  return k.items.map((it) => ({
    title: it.title,
    sku: String(it.sku),
    qty: typeof it.qty === "number" ? it.qty : 1,
    buy_url: myShopLink(String(it.sku)),
    note: it.note,
  }));
}

export default function KitItemsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const kit = findKit(slug);
  if (!kit) notFound();

  const title = kit.title ?? `${slug[0]?.toUpperCase() ?? ""}${slug.slice(1)} Kit`;
  const items = normalizeItems(kit);

  return (
    <section className="space-y-8 max-w-4xl">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {title}
          <span aria-hidden="true"> — </span>
          Items
        </h1>
        <p className="muted">Everything included in this kit. View individual SKUs on MyShop.</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a href={MYSHOP_BASE} target="_blank" rel="noopener noreferrer" className="btn">
            Open MyShop
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
            No items yet. Add SKUs under <code>items[]</code> in <code>src/lib/kits.ts</code>.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.sku} className="glow-row">
              <div className="min-w-0">
                <div className="font-medium truncate">{it.title ?? "Product"}</div>
                <div className="text-sm muted">
                  SKU: {it.sku}
                  {it.qty > 1 ? (
                    <>
                      <span aria-hidden="true"> • Qty </span>
                      {it.qty}
                    </>
                  ) : null}
                </div>
                {it.note ? <div className="text-sm muted">{it.note}</div> : null}
              </div>

              <div className="flex items-center gap-2">
                {it.buy_url ? (
                  <a href={it.buy_url} target="_blank" rel="noopener noreferrer" className="link-chip">
                    Buy
                  </a>
                ) : (
                  <a
                    href={myShopLink(it.sku)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-chip"
                    aria-label={`View SKU ${it.sku} on MyShop`}
                  >
                    View on MyShop
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Bottom CTA */}
      <div className="flex flex-wrap gap-3">
        <a href={MYSHOP_BASE} target="_blank" rel="noopener noreferrer" className="btn">
          Open MyShop
        </a>
        <Link href={`/kits/${slug}`} className="btn-ghost">
          Back to kit
        </Link>
      </div>
    </section>
  );
}
