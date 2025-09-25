// src/lib/tsp-products.ts
export type TspProduct = {
  id: string;            // e.g., "morale_patch"
  title: string;
  blurb?: string;
  url?: string;          // external or internal; omit to use /gear/[slug]
  inStock?: boolean;     // false -> shows waitlist
  stripeProductId?: string; // Stripe PRODUCT id (e.g., "prod_...")
};

// Set these with the values you sent:
// Morale  : prod_T5wV6MYwLmOEga
// Sticker : prod_T5wUYJP5c8hgyA
export const TSP_PRODUCTS: TspProduct[] = [
  {
    id: "morale_patch",
    title: "Morale Patch",
    blurb: "PVC hook-backed patch — built for rucks, caps, and plate carriers.",
    inStock: true,
    stripeProductId: "prod_T5wV6MYwLmOEga",
  },
  {
    id: "sticker_pack",
    title: "Sticker Pack",
    blurb: "Die-cut, weatherproof stickers. Mark your kit, bottle, or case.",
    inStock: true,
    stripeProductId: "prod_T5wUYJP5c8hgyA",
  },
  {
    id: "thermal_beanie",
    title: "Thermal Beanie",
    blurb: "Cold-weather beanie to keep the mission going in low temps.",
    inStock: false, // waitlist only
  },
];
