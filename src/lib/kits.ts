// src/lib/kits.ts
// Master list of Kits shown on /kits and individual kit pages.

export type KitItem = {
  title?: string;      // UI title
  sku: string;         // Amway SKU
  qty?: number;        // default 1
  note?: string;
  buy_url?: string;    // optional PDP override
};

export type Kit = {
  slug: string;
  title?: string;
  subtitle?: string;
  description?: string;
  weight_lb?: number | string;
  items?: KitItem[];
  gear?: string[];
  addons?: string[];
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
      { title: "XS Energy Drink 12-pack – Variety Case", sku: "127070", qty: 1 },
      { title: "XS Sports Electrolyte Drink Mix – Strawberry Watermelon", sku: "110601", qty: 1 },
      { title: "XS Sparkling Juiced Energy – Dragon Fruit (12-pack)", sku: "126985", qty: 1 },
      { title: "Nutrilite Vitamin C Extended Release (180)", sku: "109747", qty: 1 },
      { title: "Nutrilite Vitamin D (90)", sku: "119346", qty: 1 },
      { title: "Nutrilite Advanced Omega (60 softgels)", sku: "126136", qty: 1 },
      { title: "Nutrilite Magnesium (60 caps)", sku: "128032", qty: 1 },
      { title: "Nutrilite Ultra Focus Energy Pack", sku: "123842", qty: 1 },
      { title: "XS Protein Pods – Vanilla", sku: "300855", qty: 1 },
      { title: "XS Energy Drink 12-pack – Tropical", sku: "126199", qty: 1 },
      { title: "XS Energy – Caffeine Free Cranberry-Grape (12 oz)", sku: "126983", qty: 1 },
    ],
    gear: ["morale_patch", "sticker_pack"],
    addons: ["110631", "126883"],
    image: "/images/kits/resilient-hero.webp",
    imageAlt: "Resilient Kit hero",
  },
  {
    slug: "homefront",
    title: "Homefront Kit",
    subtitle: "Support for home base. Hydration, vitamins, recovery, rest.",
    weight_lb: "2.6 lb",
    items: [
      { title: "XS Sports Electrolyte Drink Mix – Blue Citrus", sku: "110631", qty: 1 },
      { title: "Nutrilite Vitamin C Extended Release (60)", sku: "109745", qty: 1 },
      { title: "Nutrilite Omega (60 softgels)", sku: "126132", qty: 1 },
      { title: "Nutrilite Concentrated Fruits & Vegetables (60)", sku: "100648", qty: 1 },
      { title: "Nutrilite Double X Multivitamin – 10-day", sku: "123364", qty: 1 },
      { title: "Nutrilite Sleep Health", sku: "A8992", qty: 1 },
      { title: "n* by Nutrilite Sweet Dreams Sleep Gummies", sku: "124506", qty: 1 },
      { title: "Nutrilite Organics Plant Protein – Vanilla", sku: "125923", qty: 1 },
      { title: "G&H Protect Hand Sanitizer", sku: "126855", qty: 1 },
    ],
    gear: [],
    addons: ["125894", "110403"],
    image: "/images/kits/homefront-hero.webp",
    imageAlt: "Homefront Kit hero",
  },
];

export const kitsBySlug: Record<string, Kit> = Object.fromEntries(kits.map((k) => [k.slug, k]));
export const getKit = (slug: string): Kit | undefined => kitsBySlug[slug];
