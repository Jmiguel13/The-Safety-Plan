// src/lib/kits.ts

// Types for kits and their contents
export type KitItem = {
  title?: string;
  sku: string;
  qty?: number;
  note?: string;
  // buy_url?: string; // intentionally omitted so CTAs route via your MyShop using SKU
};

export type Kit = {
  slug: string;
  title?: string;
  subtitle?: string;
  description?: string;
  weight_lb?: number | string;
  items?: KitItem[];   // Amway contents shown under “What’s inside”
  gear?: string[];     // Safety Plan product ids (must match TSP_PRODUCTS ids)
  addons?: string[];   // Optional Amway SKUs to recommend
  image?: string;
  imageAlt?: string;
};

export const kits: Kit[] = [
  {
    slug: "resilient",
    title: "Resilient Kit",
    subtitle: "Built for daily carry. Energy, hydration, recovery, morale.",
    weight_lb: "3.0 lb",
    items: [
      // Energy & hydration anchors
      { title: "XS Energy Drink 12-pack – Variety Case", sku: "127070", qty: 1 },
      { title: "XS Sports Electrolyte Drink Mix – Strawberry Watermelon", sku: "110601", qty: 1 },
      { title: "XS Sparkling Juiced Energy – Dragon Fruit (12-pack)", sku: "126985", qty: 1 },

      // Core vitamins & minerals for recovery/focus
      { title: "Nutrilite Vitamin C Extended Release (180)", sku: "109747", qty: 1 },
      { title: "Nutrilite Vitamin D (90)", sku: "119346", qty: 1 },
      { title: "Nutrilite Advanced Omega (60 softgels)", sku: "126136", qty: 1 },
      { title: "Nutrilite Magnesium (60 caps)", sku: "128032", qty: 1 },
      { title: "Nutrilite Ultra Focus Energy Pack", sku: "123842", qty: 1 },

      // Protein / recovery + alt energy flavors
      { title: "XS Protein Pods – Vanilla", sku: "300855", qty: 1 },
      { title: "XS Energy Drink 12-pack – Tropical", sku: "126199", qty: 1 },
      { title: "XS Energy – Caffeine Free Cranberry-Grape (12 oz)", sku: "126983", qty: 1 },
    ],
    // Safety Plan gear shown under “The Safety Plan gear”
    gear: ["morale_patch", "sticker_pack"],
    // Optional upsells on the kit page
    addons: ["110631", "126883"], // Blue Citrus electrolyte, Classic energy
    image: "/kits/resilient-placeholder.svg",
    imageAlt: "Resilient Kit preview",
  },

  {
    slug: "homefront",
    title: "Homefront Kit",
    subtitle: "Support for home base. Hydration, vitamins, recovery, rest.",
    weight_lb: "2.6 lb",
    items: [
      // Hydration & daily support
      { title: "XS Sports Electrolyte Drink Mix – Blue Citrus", sku: "110631", qty: 1 },
      { title: "Nutrilite Vitamin C Extended Release (60)", sku: "109745", qty: 1 },
      { title: "Nutrilite Omega (60 softgels)", sku: "126132", qty: 1 },
      { title: "Nutrilite Concentrated Fruits & Vegetables (60)", sku: "100648", qty: 1 },
      { title: "Nutrilite Double X Multivitamin – 10-day", sku: "123364", qty: 1 },

      // Rest & recovery
      { title: "Nutrilite Sleep Health", sku: "A8992", qty: 1 },
      { title: "n* by Nutrilite Sweet Dreams Sleep Gummies", sku: "124506", qty: 1 },

      // Protein at home
      { title: "Nutrilite Organics Plant Protein – Vanilla", sku: "125923", qty: 1 },

      // Practical home hygiene
      { title: "G&H Protect Hand Sanitizer", sku: "126855", qty: 1 },
    ],
    gear: [],
    addons: ["125894", "110403"], // G&H Hand Soap, Prewash Spray
    image: "/kits/placeholder.svg",
    imageAlt: "Homefront Kit preview",
  },
];
