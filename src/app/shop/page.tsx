// src/app/shop/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import { kits } from "@/lib/kits";
import { storefrontLink, MYSHOP_BASE } from "@/lib/amway";
import { TSP_PRODUCTS } from "@/lib/tsp-products";
import ShopClient from "./ShopClient";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse official products, solo Amway picks, and kits. MyShop for solos and Stripe for kits/gear.",
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

export default function ShopPage() {
  const kitsList = (kits as unknown as KitLite[]).map((k) => ({
    slug: k.slug,
    title: k.title ?? `${titleCase(k.slug)} Kit`,
    stats: countsForKit(k),
  }));

  const storeHref = storefrontLink("/");

  return (
    <section className="max-w-4xl space-y-10">
      <header className="space-y-3">
        <h1 className="text-5xl font-extrabold tracking-tight">Shop</h1>
        <p className="muted">
          Official products & curated solos at the top. Kits check out on Stripe; solo Amway items check out on MyShop (properly credited).
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <a href={storeHref} target="_blank" rel="noopener noreferrer" className="btn" aria-label="Open our official Amway storefront">
            Open Storefront
          </a>
        </div>

        <nav className="flex flex-wrap gap-2 pt-2" aria-label="Shop sections">
          <a href="#tsp" className="pill" data-active="true">The Safety Plan Products</a>
          <a href="#solo" className="pill">Solo Amway Products</a>
          <a href="#kits" className="pill">The Kits</a>
        </nav>
      </header>

      <Suspense fallback={<div className="panel p-4">Loading shop…</div>}>
        <ShopClient
          kitsList={kitsList}
          storeHref={storeHref}
          tspProducts={TSP_PRODUCTS}
        />
      </Suspense>

      <p className="text-xs text-zinc-500">
        Storefront base:&nbsp;
        <a href={MYSHOP_BASE || "/"} target="_blank" rel="noopener noreferrer" className="underline">
          {MYSHOP_BASE || "Not configured"}
        </a>
      </p>
    </section>
  );
}
