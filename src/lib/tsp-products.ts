// src/lib/tsp-products.ts

export type TspProduct = {
  id: string;
  title: string;
  blurb?: string;
  url?: string;      // link to PDP, Notion, or placeholder page
  inStock?: boolean; // drives button label "View" vs "Waitlist"
};

export const TSP_PRODUCTS: TspProduct[] = [
  {
    id: "tsp-morale-patch",
    title: "Morale Patch — The Safety Plan",
    blurb: "Hook backing, reflective thread. Field-washable.",
    url: "/products/morale-patch",
    inStock: true,
  },
  {
    id: "tsp-beanie",
    title: "Thermal Beanie",
    blurb: "Low-profile, moisture wicking. One size.",
    url: "/products/beanie",
    inStock: false, // waitlist state
  },
  {
    id: "tsp-sticker-pack",
    title: "Sticker Pack (5)",
    blurb: "Weatherproof vinyl, matte finish.",
    url: "/products/sticker-pack",
    inStock: true,
  },
];
