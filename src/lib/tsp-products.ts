// src/lib/tsp-products.ts
export type TspProduct = {
  id: string;           // e.g., "morale_patch"
  title: string;
  blurb?: string;
  url?: string;         // external or internal; omit to use /gear/[slug]
  inStock?: boolean;    // false -> shows waitlist form on /gear/[slug]
};

export const TSP_PRODUCTS: TspProduct[] = [
  {
    id: "morale_patch",
    title: "Morale Patch",
    blurb: "PVC hook-backed patch — built for rucks, caps, and plate carriers.",
    inStock: true,
    // no url -> /gear/morale-patch handled by the dynamic page
  },
  {
    id: "sticker_pack",
    title: "Sticker Pack",
    blurb: "Die-cut, weatherproof stickers. Mark your kit, bottle, or case.",
    inStock: true,
  },
  {
    id: "thermal_beanie",
    title: "Thermal Beanie",
    blurb: "Cold-weather beanie to keep the mission going in low temps.",
    inStock: false, // triggers WaitlistForm
  },
];

