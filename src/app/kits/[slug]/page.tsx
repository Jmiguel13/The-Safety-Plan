// src/app/kits/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { kits, type Kit } from "@/lib/kits";
import { MYSHOP_BASE, myShopLink } from "@/lib/amway";
import { TSP_PRODUCTS, type TspProduct } from "@/lib/tsp-products";

export const dynamic = "force-dynamic";

/** Find a kit by slug */
function findKit(slug: string): Kit | null {
  const list = kits as Kit[];
  return list.find((k) => k.slug === slug) ?? null;
}

/** Normalize items[] for display + quick stats */
function normalizeItems(k: Kit) {
  const list = (k.items ?? []).map((it) => ({
    title: it.title,
    sku: String(it.sku),
    qty: typeof it.qty === "number" ? it.qty : 1,
    buy_url: it.buy_url,
    note: it.note,
  }));
  const itemCount = list.length;
  const skuCount = new Set(list.map((i) => i.sku)).size;
  return { list, itemCount, skuCount };
}

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

  // Optional Safety Plan gear (IDs -> local products)
  const tspGear = (Array.isArray(kit.gear) ? kit.gear : [])
    .map((id) => TSP_PRODUCTS.find((x) => x.id === id))
    .filter(Boolean) as TspProduct[];

  // Hero image (optional, with sensible fallback)
  const heroSrc =
    kit.image ||
    (params.slug === "resilient" ? "/kits/resilient-placeholder.svg" : "/kits/placeholder.svg");
  const heroAlt = kit.imageAlt || `${title} preview`;

  return (
    <section className="space-y-10">
      {/* Top: Title + preview + stats */}
      <header className="grid items-start gap-8 md:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-4">
          <h1 className="text-balance text-5xl font-extrabold tracking-tight">{title}</h1>
          <p className="muted">{subtitle}</p>

          {/* Single primary CTA + secondary “View SKUs” */}
          <div className="flex flex-wrap gap-3">
            <a href={MYSHOP_BASE} target="_blank" rel="noopener noreferrer" className="btn">
              Buy now
            </a>
            <Link href={`/kits/${kit.slug}/items`} className="btn-ghost">
              View SKUs
            </Link>
          </div>

          {/* Quick stats */}
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

        {/* Optimized preview image */}
        <div className="panel p-5 hidden md:block">
          <div className="relative aspect-[4/3] rounded-lg border border-[var(--border)] overflow-hidden">
            <Image
              src={heroSrc}
              alt={heroAlt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 40vw, 100vw"
              priority={false}
            />
          </div>
        </div>
      </header>

      <div className="divider" />

      {/* What’s inside — Amway items */}
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
                    >
                      View on MyShop
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* The Safety Plan gear (optional) */}
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
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
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
      </section>
    </section>
  );
}
