// src/app/kits/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { kits } from "@/lib/kits";
import { MYSHOP_BASE, myShopLink, buildCartLink } from "@/lib/amway";
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
  gear?: string[]; // IDs from TSP_PRODUCTS
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
        qty: Math.max(1, Math.floor(Number(it.qty ?? 1))),
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
    kit.title ?? `${params.slug[0]?.toUpperCase() ?? ""}${params.slug.slice(1)} Kit`;

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
    typeof kit.weight_lb === "number" ? `${kit.weight_lb} lb` : kit.weight_lb || "-";

  const hasItems = list.length > 0;

  // Build a full-kit MyShop cart link as fallback if /r/[slug] isn’t wired
  const fullKitCartUrl = hasItems
    ? buildCartLink(list.map((i) => ({ sku: i.sku, qty: i.qty || 1 })))
    : MYSHOP_BASE;

  // Recommended add-ons (Amway SKUs) — always deep-link via your MyShop
  const recommendedAddons =
    Array.isArray(kit.addons) && kit.addons.length > 0
      ? kit.addons.map((sku) => ({
          sku: String(sku),
          title: `SKU ${sku}`,
          url: myShopLink(String(sku)),
        }))
      : [];

  // Quick Add All add-ons button (only if we have recommendations)
  const addAllAddonsUrl =
    recommendedAddons.length > 0
      ? buildCartLink(recommendedAddons.map((a) => ({ sku: a.sku, qty: 1 })))
      : undefined;

  // TSP gear slice (IDs from your local products list)
  const tspGear = (Array.isArray(kit.gear) ? kit.gear : [])
    .map((id) => TSP_PRODUCTS.find((x) => x.id === id))
    .filter(Boolean) as TspProduct[];

  return (
    <section className="space-y-10">
      {/* Top: Title + preview + stats */}
      <header className="grid items-start gap-8 md:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-4">
          <h1 className="text-balance text-5xl font-extrabold tracking-tight">{title}</h1>
          <p className="muted">{subtitle}</p>

          <div className="flex flex-wrap gap-3">
            {/* Prefer your redirect route if it’s implemented */}
            <Link href={`/r/${kit.slug}`} className="btn" aria-label={`Buy ${title} now`}>
              Buy now
            </Link>
            {/* Fallback: direct cart link on MyShop */}
            <a
              href={fullKitCartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              aria-label={`Quick add ${title} on MyShop`}
            >
              Quick Add (MyShop)
            </a>
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

        {!hasItems ? (
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
                    <a
                      href={myShopLink(it.sku)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-chip"
                    >
                      View on MyShop
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Recommended Solo Amway add-ons */}
        {recommendedAddons.length > 0 ? (
          <section className="space-y-3">
            <div className="flex items-end justify-between">
              <h2 className="text-xl font-semibold">Recommended add-ons</h2>
              <a
                href={MYSHOP_BASE}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-sm"
              >
                Browse MyShop
              </a>
            </div>

            <ul className="grid gap-2">
              {recommendedAddons.map((p) => (
                <li key={p.sku} className="glow-row">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.title}</div>
                    <div className="muted text-sm">SKU {p.sku}</div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                    >
                      Add on MyShop
                    </a>
                  </div>
                </li>
              ))}
            </ul>

            {addAllAddonsUrl ? (
              <div className="pt-2">
                <a
                  className="btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={addAllAddonsUrl}
                >
                  Quick Add All Add-ons
                </a>
              </div>
            ) : null}
          </section>
        ) : null}

        {/* The Safety Plan gear */}
        {tspGear.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">The Safety Plan gear</h2>
            <ul className="grid gap-2">
              {tspGear.map((p) => (
                <li key={p.id} className="glow-row">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.title}</div>
                    {p.blurb ? <div className="muted text-sm">{p.blurb}</div> : null}
                  </div>
                  <div className="flex gap-2">
                    {p.url ? (
                      p.url.startsWith("/") ? (
                        <Link href={p.url} className="btn-ghost">
                          {p.inStock ? "View" : "Waitlist"}
                        </Link>
                      ) : (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost"
                        >
                          {p.inStock ? "View" : "Waitlist"}
                        </a>
                      )
                    ) : (
                      <span className="tag">Coming soon</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="flex gap-3 pt-2">
          <Link href={`/r/${kit.slug}`} className="btn">
            Buy now
          </Link>
          <a
            href={fullKitCartUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            Quick Add (MyShop)
          </a>
          <Link href={`/kits/${kit.slug}/items`} className="btn-ghost">
            View SKUs
          </Link>
        </div>
      </section>
    </section>
  );
}
