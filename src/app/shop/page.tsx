import Link from "next/link";
import { kits } from "@/lib/kits";
import { myShopLink, MYSHOP_BASE } from "@/lib/amway";
import { TSP_PRODUCTS } from "@/lib/tsp-products";

type KitLite = {
  slug: string;
  title?: string;
  items?: Array<{ sku: string; qty?: number; title?: string }>;
  skus?: string[];
};
type SoloItem = { sku: string; title: string; url: string };

// Rebuild this static page at most once per day
export const revalidate = 86400;

function titleCase(s: string) {
  return s ? s.replace(/^\w/, (c) => c.toUpperCase()) : s;
}
function countsForKit(k: KitLite) {
  const arr = Array.isArray(k.items)
    ? k.items.map((i) => i.sku)
    : Array.isArray(k.skus)
    ? k.skus
    : [];
  const itemCount = Array.isArray(k.items)
    ? k.items.length
    : Array.isArray(k.skus)
    ? k.skus.length
    : 0;
  const skuCount = new Set(arr.map(String)).size;
  return { itemCount, skuCount };
}
function soloItems(): SoloItem[] {
  const picks = [
    { sku: "127070", title: "XS Energy 12-pack — Variety Case" },
    { sku: "110601", title: "XS Sports Electrolyte — Strawberry Watermelon" },
    { sku: "109747", title: "Nutrilite Vitamin C — 180 tablets" },
  ];
  return picks.map(({ sku, title }) => ({ sku, title, url: myShopLink(sku) }));
}

export default function ShopPage() {
  const kitsList = (kits as unknown as KitLite[]).map((k) => ({
    slug: k.slug,
    title: k.title ?? `${titleCase(k.slug)} Kit`,
    stats: countsForKit(k),
  }));
  const solos = soloItems();
  const hasTsp = Array.isArray(TSP_PRODUCTS) && TSP_PRODUCTS.length > 0;

  return (
    <section className="space-y-10 max-w-4xl">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-5xl font-extrabold tracking-tight">Shop</h1>
        <p className="muted">
          Visit our official Amway storefront. Every order advances the mission.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href={MYSHOP_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            aria-label="Open our official Amway storefront"
          >
            Open Storefront
          </a>
        </div>

        <nav className="flex flex-wrap gap-2 pt-2" aria-label="Shop sections">
          <a href="#kits" className="pill" data-active="true">
            The Kits
          </a>
          <a href="#solo" className="pill">
            Solo Amway Products
          </a>
          <a href="#tsp" className="pill">
            The Safety Plan Products
          </a>
        </nav>
      </header>

      {/* Mission blurb */}
      <div className="panel-elevated p-5 space-y-1">
        <h3 className="font-semibold">Our mission</h3>
        <p className="muted">
          The Safety Plan exists to save lives. We provide clean, effective wellness kits that
          meet real needs: hydration, energy, recovery, and rest. Profits support veteran suicide
          prevention and frontline support.
        </p>
      </div>

      {/* Kits */}
      <section id="kits" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold">The Kits</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {kitsList.map((k) => (
            <li key={k.slug} className="panel p-4 flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium truncate">{k.title}</div>
                <div className="muted text-sm">
                  {k.stats.itemCount} items • {k.stats.skuCount} SKUs
                </div>
              </div>
              <div className="flex gap-2">
                {/* Single clear CTA: send users to the kit detail page */}
                <Link
                  href={`/kits/${k.slug}`}
                  className="btn-ghost"
                  aria-label={`View ${k.title}`}
                >
                  View kit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Solo Amway products */}
      <section id="solo" className="space-y-4 scroll-mt-24">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Solo Amway Products</h2>
          <a
            href={MYSHOP_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-sm"
          >
            Open MyShop
          </a>
        </div>

        {solos.length === 0 ? (
          <div className="panel p-4">
            <p className="muted text-sm">Curated picks coming soon.</p>
          </div>
        ) : (
          <ul className="grid gap-2">
            {solos.map((p) => (
              <li key={p.sku} className="glow-row">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.title}</div>
                  <div className="muted text-sm">Quick-buy single item · SKU {p.sku}</div>
                </div>
                <div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                    aria-label={`Buy ${p.title}`}
                  >
                    Buy
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* The Safety Plan gear */}
      <section id="tsp" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold">The Safety Plan Products</h2>
        {!hasTsp ? (
          <div className="panel p-4">
            <p className="muted text-sm">Our custom gear is in progress. Check back soon.</p>
          </div>
        ) : (
          <ul className="grid gap-2">
            {TSP_PRODUCTS.map((p) => {
              const slug = p.id.replace(/_/g, "-");
              const label = p.inStock ? "View" : "Waitlist";
              const href = p.url ? (p.url.startsWith("/") ? p.url : p.url) : `/gear/${slug}`;
              const isInternal = p.url?.startsWith("/") || !p.url;

              return (
                <li key={p.id} className="glow-row">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.title}</div>
                    {p.blurb ? <div className="muted text-sm">{p.blurb}</div> : null}
                  </div>

                  <div className="flex gap-2">
                    {isInternal ? (
                      <Link href={href} className="btn-ghost">
                        {label}
                      </Link>
                    ) : (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                        {label}
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </section>
  );
}

