import type { Metadata } from "next";
import { kits } from "@/lib/kits";
import type { Kit, KitOption } from "@/lib/kits";
import { storefrontLink } from "@/lib/amway";
import { TSP_PRODUCTS } from "@/lib/tsp-products";
import ShopClient from "./ShopClient";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse official products and kits. MyShop for solos and Stripe for kits/gear.",
};

/* ---------- Shapes passed to the client ---------- */
type SelectOpt = { label: string; sku: string };

type ShopKitOptions = {
  energyFlavor?:
    | {
        type: "select";
        key: "energyFlavor";
        label: string;
        choices: SelectOpt[];
        defaultSku: string;
      }
    | undefined;
  proteinChoice?:
    | {
        type: "select";
        key: "proteinChoice";
        label: string;
        choices: SelectOpt[];
        defaultSku: string;
      }
    | undefined;
  includeMensPack?:
    | {
        type: "checkbox";
        key: "includeMensPack";
        label: string;
        sku: string;
        defaultChecked?: boolean;
      }
    | undefined;
};

type KitLite = {
  slug: string;
  title: string;
  stats: { itemCount: number; skuCount: number };
  options?: ShopKitOptions;
};

/* ---------- Helpers ---------- */
function countsForKit(k: Kit) {
  const skuList = Array.isArray(k.items) ? k.items.map((i) => i.sku) : [];
  const itemCount = Array.isArray(k.items) ? k.items.length : skuList.length;
  const skuCount = skuList.length;
  return { itemCount, skuCount };
}

function pickOption<T extends KitOption>(
  list: KitOption[] | undefined,
  type: T["type"],
  key: "energyFlavor" | "proteinChoice" | "includeMensPack",
) {
  return list?.find(
    (o) => o.type === type && (o as KitOption).key === key,
  ) as unknown as T | undefined;
}

/* ---------- Page ---------- */
export default function ShopPage() {
  const kitsList: KitLite[] = (kits as Kit[]).map((k) => {
    const energyFlavor = pickOption(
      k.options,
      "select",
      "energyFlavor",
    ) as ShopKitOptions["energyFlavor"];
    const proteinChoice = pickOption(
      k.options,
      "select",
      "proteinChoice",
    ) as ShopKitOptions["proteinChoice"];
    const includeMensPack = pickOption(
      k.options,
      "checkbox",
      "includeMensPack",
    ) as ShopKitOptions["includeMensPack"];

    const options: ShopKitOptions = {
      energyFlavor,
      proteinChoice,
      includeMensPack,
    };

    return {
      slug: k.slug,
      title: k.title ?? "",
      stats: countsForKit(k),
      options,
    };
  });

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
