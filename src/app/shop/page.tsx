import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { kits } from "@/lib/kits";
import { storefrontLink, productLink, MYSHOP_BASE } from "@/lib/amway";
import { TSP_PRODUCTS } from "@/lib/tsp-products";

// Rebuild this static page at most once per day
export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse kits and curated picks. Checkout happens on Amway (MyShop) for solos and Stripe for kits/gear.",
};

type KitLite = {
  slug: string;
  title?: string;
  items?: Array<{ sku: string; qty?: number; title?: string }>;
  skus?: string[];
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

function soloItems() {
  const picks = [
    { sku: "127070", title: "XS Energy 12-pack — Variety Case" },
    { sku: "110601", title: "XS Sports Electrolyte — Strawberry Watermelon" },
    { sku: "109747", title: "Nutrilite Vitamin C — 180 tablets" },
  ];
  return picks.map(({ sku, title }) => ({ sku, title, url: productLink(sku) || "/" }));
}

// ✅ Load the client UI only on the client; prevents “undefined .call” and hydration drift
const ShopClient = dynamic(() => import("./ShopClient"), {
  ssr: false,
  loading: () => <div className="panel p-4">Loading shop…</div>,
});

export default function ShopPage() {
  const kitsList = (kits as unknown as KitLite[]).map((k) => ({
    slug: k.slug,
    title: k.title ?? `${titleCase(k.slug)} Kit`,
    stats: countsForKit(k),
  }));

  const solos = soloItems();
  const storeHref = storefrontLink("/");
  const stickerPrice = process.env.STRIPE_PRICE_STICKER_PACK || "";
  const patchPrice = process.env.STRIPE_PRICE_MORALE_PATCH_GREEN || "";

  return (
    <section className="max-w-4xl space-y-10">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-5xl font-extrabold tracking-tight">Shop</h1>
        <p className="muted">
          Kits & Safety Plan gear checkout on Stripe. Solo Amway products checkout on MyShop
          (properly credited).
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

      {/* Client section renders Stripe + interactive buttons */}
      <ShopClient
        kitsList={kitsList}
        solos={solos}
        tspProducts={TSP_PRODUCTS}
        storeHref={storeHref}
        stickerPrice={stickerPrice}
        patchPrice={patchPrice}
      />

      <p className="text-xs text-zinc-500">
        Storefront base:&nbsp;
        <a href={MYSHOP_BASE || "/"} target="_blank" rel="noopener noreferrer" className="underline">
          {MYSHOP_BASE || "Not configured"}
        </a>
      </p>
    </section>
  );
}
