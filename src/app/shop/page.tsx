import type { Metadata } from "next";
import { kits } from "@/lib/kits";
import { storefrontLink } from "@/lib/amway";
import { TSP_PRODUCTS } from "@/lib/tsp-products";
import ShopClient from "./ShopClient";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse official products and kits. MyShop for solos and Stripe for kits/gear.",
};

type KitLite = {
  slug: string;
  title?: string;
  items?: Array<{ sku: string; qty?: number; title?: string }>;
  skus?: string[];
};

function countsForKit(k: KitLite) {
  const skuList = Array.isArray(k.items)
    ? k.items.map((i) => i.sku)
    : Array.isArray(k.skus)
    ? k.skus
    : [];
  const itemCount = Array.isArray(k.items) ? k.items.length : skuList.length;
  const skuCount = skuList.length;
  return { itemCount, skuCount };
}

export default function ShopPage() {
  const kitsList = (kits ?? []).map((k) => ({
    slug: k.slug,
    title: k.title ?? "",
    stats: countsForKit(k),
  }));

  const storeHref = storefrontLink();

  return (
    <main id="main" className="container py-8">
      <h1 className="mb-6 text-2xl font-bold">The Kits</h1>
      <ShopClient
        kitsList={kitsList}
        storeHref={storeHref}
        tspProducts={TSP_PRODUCTS}
      />
    </main>
  );
}
