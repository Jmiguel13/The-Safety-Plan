import Link from "next/link";
import { notFound } from "next/navigation";
import { kits } from "@/lib/kits";
import { PRODUCT_URLS } from "@/lib/amway_product_urls";
import { myShopLink } from "@/lib/amway";
import { TSP_PRODUCTS, type TspProduct } from "@/lib/tsp-products";

/** --- Types --- */
type AnyKit = {
  slug: string;
  title?: string;
  subtitle?: string;
  description?: string;
  weight_lb?: number | string;
  items?: Array<{ title?: string; sku: string; qty?: number; buy_url?: string; note?: string }>;
  skus?: string[];
};

// optional extras you may add to each kit object in kits.ts
type KitExtras = AnyKit & {
  addons?: string[]; // Solo Amway SKUs to recommend
  gear?: string[];   // IDs from TSP_PRODUCTS
};

type NormItem = {
  title?: string;
  sku: string;
  qty: number;
  buy_url?: string;
  note?: string;
};

export const dynamic = "force-dynamic";

/** --- Helpers --- */
function findKit(slug: string): KitExtras | null {
  const list = kits as unknown as KitExtras[];
  return list.find((k) => k.slug === slug) ?? null;
}

function normalizeItems(k: AnyKit) {
  const list: NormItem[] = Array.isArray(k.items)
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

  const itemCount = list.length;
  const skuCount = new Set(list.map((i) => i.sku)).size;

  return { list, itemCount, skuCount };
}

/** --- Page --- */
export default function KitPage({ params }: { params: { slug: string } }) {
  const kit = findKit(params.slug);
  if (!kit) notFound();

  const title =
    kit.title ??
    `${params.slug[0]?.toUpperCase() ?? ""}${params.slug.slice(1)} Kit`;

  const subtitle =
    kit.description ??
    kit.subtitle ??
    (params.slug === "resilient"
      ? "Built for daily carry. Energy, hydration, recovery, morale."
      : params.slug === "homefront"
      ? "Support for home base. Hydration, vitamins, recovery, rest."
      : "Focused wellness kit.");

  const { list, itemCount, skuCount } = normalizeItems(kit);
  const weight =
    typeof kit.weight_lb === "number"
      ? `${kit.weight_lb} lb`
      : kit.weight_lb || "-";

  return (
    <section className="space-y-10">
      {/* Top: Title + preview + stats */}
      <header className="grid items-start gap-8 md:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-4">
          <h1 className="text-balance text-5xl font-extrabold tracking-tight">
            {title}
          </h1>
          <p className="muted">{subtitle}</p>

          <div className="flex flex-wrap gap-3">
            <Link href={`/r/${kit.slug}`} className="btn">
              Buy now
            </Link>
            <Link href={`/kits/${kit.slug}/items`} className="btn-ghost">
              View SKUs
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="panel p-4">
              <div className="stat" role="group" aria-label="Weight">
                <div className="label">Weight</div>
                <div className="value">{weight}</div>
              </div>
            </div>
            <div className="panel p-4">
              <div className="stat" role="group" aria-label="Items">
                <div className="label">Items</div>
                <div className="value">{itemCount}</div>
              </div>
            </div>
            <div className="panel p-4">
              <div className="stat" role="group" aria-label="SKUs">
                <div className="label">SKUs</div>
                <div className="value">{skuCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview card */}
        <div className="panel p-5 hidden md:block">
          <div className="preview-surface bg-grid aspect-[4/3] rounded-lg border border-[var(--border)] overflow-hidden grid place-items-center">
            <div className="pulse-dot" />
          </div>
        </div>
      </header>

      <div className="divider" />

      {/* What’s inside */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">What&apos;s inside</h2>

        {list.length === 0 ? (
          <p className="muted">Item list coming soon.</p>
        ) : (
          <ul className="grid gap-2">
            {list.map((it, i) => (
              <li key={`${it.sku}-${i}`} className="glow-row">
                <div className="min-w-0">
                  <div className="font-medium truncate">{it.title ?? "Product"}</div>
                  <div className="text-sm muted">
                    SKU: {it.sku}
                    {it.qty > 1 ? ` • Qty ${it.qty}` : ""}
                  </div>
                  {it.note ? (
                    <div className="text-sm muted">{it.note}</div>
                  ) : null}
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
                    <Link href={`/kits/${kit.slug}/items`} className="link-chip">
                      Copy
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Recommended Solo Amway add-ons */}
        {Array.isArray(kit.addons) && kit.addons.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Recommended add-ons</h2>
            <ul className="grid gap-2">
              {kit.addons.map((sku: string) => (
                <li key={sku} className="glow-row">
                  <div>
                    <div className="font-medium">SKU {sku}</div>
                    <div className="muted text-sm">Single-item add-on</div>
                  </div>
                  <div>
                    {PRODUCT_URLS[sku] ? (
                      <a
                        href={PRODUCT_URLS[sku] as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost"
                      >
                        Buy
                      </a>
                    ) : (
                      <a
                        href={myShopLink("addon")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost"
                      >
                        Open Storefront
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* The Safety Plan gear */}
        {Array.isArray(kit.gear) && kit.gear.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">The Safety Plan gear</h2>
            <ul className="grid gap-2">
              {kit.gear.map((id: string) => {
                const p: TspProduct | undefined = TSP_PRODUCTS.find((x) => x.id === id);
                if (!p) return null;
                return (
                  <li key={id} className="glow-row">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{p.title}</div>
                      {p.blurb ? <div className="muted text-sm">{p.blurb}</div> : null}
                    </div>
                    <div className="flex gap-2">
                      {p.url ? (
                        <Link href={p.url} className="btn-ghost">
                          {p.inStock ? "View" : "Waitlist"}
                        </Link>
                      ) : (
                        <span className="tag">Coming soon</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <div className="flex gap-3 pt-2">
          <Link href={`/r/${kit.slug}`} className="btn">
            Buy now
          </Link>
          <Link href={`/kits/${kit.slug}/items`} className="btn-ghost">
            View SKUs
          </Link>
        </div>
      </section>
    </section>
  );
}
