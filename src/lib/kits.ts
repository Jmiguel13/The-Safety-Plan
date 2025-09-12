// src/lib/kits.ts

// Types here are illustrative; align with your existing file if it already defines them.
export type Kit = {
  slug: string;
  title?: string;
  subtitle?: string;
  description?: string;
  weight_lb?: number | string;

  // Amway contents (what shows under “What’s inside”)
  items?: Array<{
    title?: string;
    sku: string;
    qty?: number;
    note?: string;
    buy_url?: string; // optional hard link override; otherwise the UI will build a MyShop link from the SKU
  }>;

  // Link Safety Plan products by id (must match TSP_PRODUCTS ids, e.g. "morale_patch", "sticker_pack", "thermal_beanie")
  gear?: string[];

  // Optional: “you may also like” Amway SKUs (shown as Recommended add-ons)
  addons?: string[];

  // Optional display image (served from /public)
  image?: string;
  imageAlt?: string;
};

export const kits: Kit[] = [
  /**
   * Resilient — primary EDC kit
   * - Concrete “What’s inside” list for the product page & items page
   * - Safety Plan gear included (morale patch + sticker pack)
   * - Optional upsells via `addons`
   */
  {
    slug: "resilient",
    title: "Resilient Kit",
    subtitle: "Built for daily carry. Energy, hydration, recovery, morale.",
    weight_lb: 3,
    image: "/kits/resilient-placeholder.svg",
    imageAlt: "Resilient Kit preview",
    items: [
      // ——— Amway products included in the kit ———
      { title: "XS™ Energy — 12-pack (Variety Case)", sku: "127070", qty: 1 },
      { title: "XS™ Sports Electrolyte — Strawberry Watermelon", sku: "110601", qty: 1 },
      { title: "Nutrilite™ Vitamin C Extended Release — 180 tablets", sku: "109747", qty: 1 },
      // Add/adjust SKUs as inventory evolves. Titles are UI-only.
    ],
    // ——— The Safety Plan gear included with this kit ———
    gear: ["morale_patch", "sticker_pack"],
    // Optional upsells (Amway → deep links in UI)
    addons: ["127070", "110601"],
  },

  /**
   * Homefront — support at home base
   * Keep/edit as needed. You can flesh this list with final SKUs/titles later.
   */
  {
    slug: "homefront",
    title: "Homefront Kit",
    subtitle: "Support for home base. Hydration, vitamins, recovery, rest.",
    weight_lb: 3.5,
    image: "/kits/placeholder.svg",
    imageAlt: "Homefront Kit preview",
    items: [
      { title: "XS™ Sports Electrolyte — Strawberry Watermelon", sku: "110601", qty: 2 },
      { title: "Nutrilite™ Vitamin C Extended Release — 180 tablets", sku: "109747", qty: 1 },
      // Add your actual mix: sleep/recovery aids, etc.
    ],
    // If this kit ships with gear, list TSP product ids here:
    gear: ["thermal_beanie"], // this one can render a Waitlist form if not in stock
    addons: ["127070"],       // optional Amway upsells
  },
];
