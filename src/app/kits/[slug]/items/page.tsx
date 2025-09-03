import Link from "next/link";
import { notFound } from "next/navigation";
import CopySkus from "@/components/CopySkus";
import { kits } from "@/lib/kits";
import { myShopLink, buildCartLink } from "@/lib/amway";

type AnyRec = Record<string, unknown>;

function findKit(slug: string): AnyRec | null {
  const list = kits as unknown as AnyRec[];
  return list.find((k) => (k as Record<string, unknown>).slug === slug) ?? null;
}

export const dynamic = "force-dynamic";

type ParamsObj = { slug: string };

export default async function KitItemsPage({
  params,
}: {
  params: ParamsObj | Promise<ParamsObj>;
}) {
  const resolved = (params instanceof Promise ? await params : params) as ParamsObj;
  const { slug } = resolved;

  const kit = findKit(slug);
  if (!kit) notFound();

  const k = kit as {
    title?: string;
    items?: Array<{ title?: string; sku: string; qty?: number; buy_url?: string; note?: string }>;
    skus?: string[];
  };

  const title =
    typeof k.title === "string" ? k.title : `${slug[0]?.toUpperCase()}${slug.slice(1)} Kit`;

  // Normalize items: prefer kit.items; fallback to kit.skus
  const normalized: Array<{
    title?: string;
    sku: string;
    qty: number;
    buy_url?: string;
    note?: string;
  }> = Array.isArray(k.items)
    ? k.items.map((it) => ({
        title: it.title,
        sku: String(it.sku),
        qty: Number(it.qty ?? 1),
        buy_url: it.buy_url,
        note: it.note,
      }))
    : Array.isArray(k.skus)
    ? k.skus.map((s) => ({ sku: String(s), qty: 1 }))
    : [];

  const addAllUrl =
    normalized.length > 0
      ? buildCartLink(normalized.map((i) => ({ sku: i.sku, qty: i.qty })))
      : null;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {title} — Items
        </h1>
        <p className="muted">
          Everything included in this kit. Buy individually or add the full kit to cart.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          {addAllUrl ? (
            <a href={addAllUrl} target="_blank" rel="noopener noreferrer" className="btn">
              Add full kit to cart
            </a>
          ) : null}

          {normalized.length > 0 ? (
            // CopySkus only takes { items: { sku, qty }[] }
            <CopySkus items={normalized.map((i) => ({ sku: i.sku, qty: i.qty }))} />
          ) : null}

          <Link href={`/kits/${slug}`} className="btn-ghost">
            Back to kit
          </Link>
        </div>
      </header>

      {/* Items list */}
      {normalized.length === 0 ? (
        <div className="panel-elevated p-6">
          <p className="muted">
            No items yet. Add SKUs in <code>src/lib/kits.ts</code>.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {normalized.map((it) => (
            <li key={it.sku} className="glow-row">
              <div className="min-w-0">
                <div className="font-medium truncate">{it.title ?? "Product"}</div>
                <div className="text-sm muted">
                  SKU: {it.sku}
                  {it.qty > 1 ? ` • Qty ${it.qty}` : ""}
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
                    <a
                      href={myShopLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-chip"
                    >
                      Open Storefront
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
          <a href={addAllUrl} target="_blank" rel="noopener noreferrer" className="btn">
            Add full kit to cart
          </a>
        ) : null}
        <Link href={`/kits/${slug}`} className="btn-ghost">
          Back to kit
        </Link>
      </div>
    </div>
  );
}
