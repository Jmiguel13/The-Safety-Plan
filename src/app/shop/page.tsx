// src/app/shop/page.tsx
import Link from "next/link";
import { kits } from "@/lib/kits";
import { PRODUCT_URLS } from "@/lib/amway_product_urls";
import { myShopLink } from "@/lib/amway";
import { TSP_PRODUCTS } from "@/lib/tsp-products";

/** ---------- Types & helpers ---------- */
type KitLite = {
  slug: string;
  title?: string;
  items?: Array<{ sku: string; qty?: number; title?: string }>;
  skus?: string[];
};

type SoloItem = { sku: string; title: string; url?: string };

function titleCase(s: string) {
  return s ? s.replace(/^\w/, (c) => c.toUpperCase()) : s;
}

/** Count items/SKUs from either items[] or skus[] */
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

/** Curate a simple “solo products” strip from PRODUCT_URLS */
function soloItems(): SoloItem[] {
  const picks = ["127070", "110601", "109747"]; // tweak as you like
  return picks.map((sku) => ({
    sku,
    title: `SKU ${sku}`,
    url: PRODUCT_URLS[sku],
  }));
}

export const dynamic = "force-dynamic";

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
          <a href={myShopLink()} target="_blank" rel="noopener noreferrer" className="btn">
            Open Storefront
          </a>
          <Link href="/kits" className="btn-ghost">
            View Kits
          </Link>
        </div>

        {/* local section nav */}
        <nav className="flex flex-wrap gap-2 pt-2">
          <a href="#kits" className="pill" data-active="true">The Kits</a>
          <a href="#solo" className="pill">Solo Amway Products</a>
          <a href="#tsp" className="pill">The Safety Plan Products</a>
        </nav>
      </header>

      {/* Our mission */}
      <div className="panel-elevated p-5 space-y-1">
        <h3 className="font-semibold">Our mission</h3>
        <p className="muted">
          The Safety Plan exists to save lives. We provide clean, effective wellness kits that
          meet real needs: hydration, energy, recovery, and rest. Profits support veteran suicide
          prevention and frontline support.
        </p>
      </div>

      {/* Section 1: The Kits */}
      <section id="kits" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold">The Kits</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {kitsList.map((k) => (
            <li key={k.slug} className="panel p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{k.title}</div>
                <div className="muted text-sm">
                  {k.stats.itemCount} items • {k.stats.skuCount} SKUs
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/kits/${k.slug}`} className="btn-ghost">
                  View items
                </Link>
                <Link href={`/r/${k.slug}`} className="btn">
                  Add full kit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Section 2: Solo Amway Products */}
      <section id="solo" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold">Solo Amway Products</h2>
        {solos.length === 0 ? (
          <div className="panel p-4">
            <p className="muted text-sm">Curated picks coming soon.</p>
          </div>
        ) : (
          <ul className="grid gap-2">
            {solos.map((p) => (
              <li key={p.sku} className="glow-row">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="muted text-sm">Quick-buy single item</div>
                </div>
                <div>
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                    >
                      Buy
                    </a>
                  ) : (
                    <a
                      href={myShopLink("solo-product")}
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
        )}
      </section>

      {/* Section 3: The Safety Plan Products */}
      <section id="tsp" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold">The Safety Plan Products</h2>
        {!hasTsp ? (
          <div className="panel p-4">
            <p className="muted text-sm">Our custom gear is in progress. Check back soon.</p>
          </div>
        ) : (
          <ul className="grid gap-2">
            {TSP_PRODUCTS.map((p) => (
              <li key={p.id} className="glow-row">
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
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
