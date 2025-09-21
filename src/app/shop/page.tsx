// src/app/shop/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { kits } from "@/lib/kits";
import { storefrontLink, productLink, MYSHOP_BASE } from "@/lib/amway";
import { TSP_PRODUCTS } from "@/lib/tsp-products";

type KitLite = {
  slug: string;
  title?: string;
  items?: Array<{ sku: string; qty?: number; title?: string }>;
  skus?: string[];
};
type SoloItem = { sku: string; title: string; url: string };

// Rebuild this static page at most once per day
export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse kits and curated picks. Checkout happens on Amway (MyShop) with proper credit.",
};

function titleCase(s: string) {
  return s ? s.replace(/^\w/, (c) => c.toUpperCase()) : s;
}

function countsForKit(k: KitLite) {
  const skuList = Array.isArray(k.items)
    ? k.items.map((i) => i.sku)
    : Array.isArray(k.skus)
    ? k.skus
    : [];
  const itemCount = Array.isArray(k.items)
    ? k.items.length
    : Array.isArray(k.skus)
    ? k.skus.length
    : 0;
  const skuCount = new Set(skuList.map(String)).size;
  return { itemCount, skuCount };
}

function soloItems(): SoloItem[] {
  const picks = [
    { sku: "127070", title: "XS Energy 12-pack — Variety Case" },
    { sku: "110601", title: "XS Sports Electrolyte — Strawberry Watermelon" },
    { sku: "109747", title: "Nutrilite Vitamin C — 180 tablets" },
  ];
  return picks.map(({ sku, title }) => ({ sku, title, url: productLink(sku) || "/" }));
}

export default function ShopPage() {
  const kitsList = (kits as unknown as KitLite[]).map((k) => ({
    slug: k.slug,
    title: k.title ?? `${titleCase(k.slug)} Kit`,
    stats: countsForKit(k),
  }));

  const solos = soloItems();
  const hasTsp = Array.isArray(TSP_PRODUCTS) && TSP_PRODUCTS.length > 0;
  const storeHref = storefrontLink("/");

  return (
    <section className="max-w-4xl space-y-10">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-5xl font-extrabold tracking-tight">Shop</h1>
        <p className="muted">
          Checkout happens on Amway (MyShop). All links credit our storefront and include UTM tags.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href={storeHref}
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
      <div className="panel-elevated space-y-1 p-5">
        <h3 className="font-semibold">Our mission</h3>
        <p className="muted">
          The Safety Plan exists to save lives. We provide clean, effective wellness kits that meet
          real needs: hydration, energy, recovery, and rest. Profits support veteran suicide
          prevention and frontline support.
        </p>
      </div>

      {/* Kits */}
      <section id="kits" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-semibold">The Kits</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {kitsList.map((k) => (
            <li key={k.slug} className="panel flex items-center justify-between p-4">
              <div className="min-w-0">
                <div className="truncate font-medium">{k.title}</div>
                <div className="muted text-sm">
                  {k.stats.itemCount} items • {k.stats.skuCount} SKUs
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/kits/${k.slug}`} className="btn-ghost" aria-label={`View ${k.title}`}>
                  View kit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Solo Amway products */}
      <section id="solo" className="scroll-mt-24 space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Solo Amway Products</h2>
          <a
            href={storeHref}
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
                  <div className="truncate font-medium">{p.title}</div>
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
      <section id="tsp" className="scroll-mt-24 space-y-4">
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
                    <div className="truncate font-medium">{p.title}</div>
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

      <p className="text-xs text-zinc-500">
        Storefront base:&nbsp;
        <a href={MYSHOP_BASE || "/"} target="_blank" rel="noopener noreferrer" className="underline">
          {MYSHOP_BASE || "Not configured"}
        </a>
      </p>
    </section>
  );
}
