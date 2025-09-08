// src/lib/kits.ts

export type KitItem = {
  sku: string;
  qty?: number;
  title?: string;
  buy_url?: string;
  note?: string;
};

export type Kit = {
  slug: string;
  title?: string;
  subtitle?: string;
  description?: string;
  weight_lb?: number | string;
  /** Prefer items[]; skus[] is a quick fallback */
  items?: KitItem[];
  skus?: string[];
  /** Optional extras used by the kit page */
  addons?: string[]; // Solo Amway SKUs to recommend
  gear?: string[];   // IDs from TSP_PRODUCTS
};

export const kits: Kit[] = [
  {
    slug: "resilient",
    title: "Resilient Kit",
    subtitle: "Built for daily carry. Energy, hydration, recovery, morale.",
    weight_lb: "-",
    /** 11 items */
    items: [
      {
        sku: "127070",
        qty: 1,
        title: "XS™ Energy Drink — Variety (12-pack)",
        note: "Clean energy when you need it most.",
      },
      {
        sku: "110601",
        qty: 1,
        title: "XS™ Sports Electrolyte — Strawberry Watermelon (sticks)",
        note: "Hydration sticks for fast re-up on the move.",
      },
      {
        sku: "109747",
        qty: 1,
        title: "Nutrilite™ Vitamin C Extended Release (180 ct)",
        note: "Daily immune support, slow release.",
      },
      {
        sku: "R-PRO-12",
        qty: 1,
        title: "Protein Bars — Variety (12-pack)",
        note: "Compact calories for long days.",
      },
      {
        sku: "R-OMEGA-90",
        qty: 1,
        title: "Omega-3 Softgels (90 ct)",
        note: "Daily essential fats.",
      },
      {
        sku: "R-MG-60",
        qty: 1,
        title: "Magnesium Tablets (60 ct)",
        note: "Recovery + muscle support.",
      },
      {
        sku: "R-B12-30",
        qty: 1,
        title: "B12 Quick-Melt (30 ct)",
        note: "Pick-me-up without the crash.",
      },
      {
        sku: "R-FOCUS-30",
        qty: 1,
        title: "Focus Support (30 ct)",
        note: "Stay sharp when it counts.",
      },
      {
        sku: "R-REHYD-10",
        qty: 1,
        title: "Hydration Tablets (10 ct)",
        note: "Backup hydration in pocket size.",
      },
      {
        sku: "R-SLEEP-30",
        qty: 1,
        title: "Sleep Support (30 ct)",
        note: "Lights out when you finally can.",
      },
      {
        sku: "R-FIRSTAID-1",
        qty: 1,
        title: "Mini First-Aid Sheet",
        note: "Wipes + bandages for quick fixes.",
      },
    ],
    addons: ["127070", "110601"], // quick add-ons on the kit page
    gear: ["tsp-patch", "tsp-nalgene"], // custom TSP gear IDs (see tsp-products.ts)
  },

  {
    slug: "homefront",
    title: "Homefront Kit",
    subtitle: "Support for home base. Hydration, vitamins, recovery, rest.",
    weight_lb: "-",
    /** 9 items */
    items: [
      {
        sku: "110601",
        qty: 1,
        title: "XS™ Sports Electrolyte — Strawberry Watermelon (sticks)",
        note: "Stay topped off through the day.",
      },
      {
        sku: "109747",
        qty: 1,
        title: "Nutrilite™ Vitamin C Extended Release (180 ct)",
        note: "Baseline immune maintenance.",
      },
      {
        sku: "H-MULTI-90",
        qty: 1,
        title: "Daily Multivitamin (90 ct)",
        note: "Foundational micronutrients.",
      },
      {
        sku: "H-OMEGA-90",
        qty: 1,
        title: "Omega-3 Softgels (90 ct)",
        note: "Heart + brain support.",
      },
      {
        sku: "H-MAG-120",
        qty: 1,
        title: "Magnesium Glycinate (120 ct)",
        note: "Recovery + sleep quality.",
      },
      {
        sku: "H-ZINC-60",
        qty: 1,
        title: "Zinc (60 ct)",
        note: "Immune + recovery cofactor.",
      },
      {
        sku: "H-SLEEP-60",
        qty: 1,
        title: "Sleep Support (60 ct)",
        note: "Wind-down routine on standby.",
      },
      {
        sku: "H-HYDR-20",
        qty: 1,
        title: "Hydration Packets (20 ct)",
        note: "Everyday water upgrade.",
      },
      {
        sku: "H-ORAL-CARE",
        qty: 1,
        title: "Oral Care Mini",
        note: "Compact daily hygiene backup.",
      },
    ],
    addons: ["109747"],
    gear: ["tsp-patch"],
  },
];
