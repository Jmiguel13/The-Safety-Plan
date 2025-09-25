// src/lib/kits-bom.ts
// Bill of Materials (BOM) for each kit with per-day math + fixed items.

export type Variant = "daily" | "10day" | "30day";
export type KitSlug = "resilient" | "homefront";

export type BomItem = {
  category:
    | "Focus / Energy"
    | "Hydration"
    | "Rest"
    | "Protein / Recovery"
    | "Hygiene";
  title: string;
  sku: string;
  /** Items used per day. Example: 1 stick, 2 gummies, 1 tablet. */
  perDay?: number;
  /** Items included once and not scaled (e.g., one sanitizer). */
  fixed?: number;
  /** Whether we repack (vs. ship full factory container). */
  repack?: boolean;
  /** Short note shown on the kit page. */
  note?: string;
};

/** Resilient Kit — add/adjust items as needed */
export const RESILIENT_BOM: BomItem[] = [
  {
    category: "Focus / Energy",
    title: "Nutrilite Ultra Focus Energy Pack",
    sku: "123842",
    perDay: 1,
    repack: false,
    note: "Keep sticks sealed.",
  },
  {
    category: "Hydration",
    title: "XS Sports Electrolyte — Strawberry Watermelon",
    sku: "110601",
    perDay: 1,
    repack: false,
    note: "Keep sticks sealed.",
  },
  {
    category: "Rest",
    title: "Nutrilite Sleep Health",
    sku: "A8992",
    perDay: 1,
    repack: true,
    note: "Repacked into labeled sachets for 10-/30-Day.",
  },
  {
    category: "Rest",
    title: "n* by Nutrilite Sweet Dreams Sleep Gummies",
    sku: "124506",
    perDay: 2,
    repack: true,
    note: "Food-safe pouches, labeled “2/night”.",
  },
  {
    category: "Protein / Recovery",
    title: "Nutrilite Organics Plant Protein — Vanilla",
    sku: "125923",
    perDay: 1,
    repack: true,
    note: "Portioned scoops for 10-/30-Day; full tub when practical.",
  },
  {
    category: "Hygiene",
    title: "G&H Protect Hand Sanitizer",
    sku: "126855",
    fixed: 1,
    repack: false,
    note: "Included once per kit.",
  },
  {
    category: "Focus / Energy",
    title: "XS Energy 12-pack — Variety Case",
    sku: "127070",
    perDay: 1,
    repack: false,
    note: "One can per day as needed.",
  },
  {
    category: "Protein / Recovery",
    title: "Nutrilite Vitamin C — 180 tablets",
    sku: "109747",
    perDay: 1,
    repack: true,
    note: "Repacked into day-count sleeves.",
  },
  {
    category: "Protein / Recovery",
    title: "Nutrilite Vitamin D — 90 tablets",
    sku: "119346",
    perDay: 1,
    repack: true,
    note: "Repacked into day-count sleeves.",
  },
  {
    category: "Protein / Recovery",
    title: "Nutrilite Advanced Omega — 60 softgels",
    sku: "126136",
    perDay: 1,
    repack: true,
    note: "Repacked into day-count sleeves.",
  },
  {
    category: "Hydration",
    title: "XS Electrolyte (spare sticks)",
    sku: "110601",
    perDay: 1,
    repack: false,
    note: "Additional day coverage.",
  },
];

/** Homefront Kit — add/adjust items as needed */
export const HOMEFRONT_BOM: BomItem[] = [
  {
    category: "Hydration",
    title: "XS Sports Electrolyte — Strawberry Watermelon",
    sku: "110601",
    perDay: 1,
    repack: false,
    note: "Keep sticks sealed.",
  },
  {
    category: "Rest",
    title: "Nutrilite Sleep Health",
    sku: "A8992",
    perDay: 1,
    repack: true,
    note: "Repacked into labeled sachets for 10-/30-Day.",
  },
  {
    category: "Rest",
    title: "n* by Nutrilite Sweet Dreams Sleep Gummies",
    sku: "124506",
    perDay: 2,
    repack: true,
    note: "Food-safe pouches, labeled “2/night”.",
  },
  {
    category: "Protein / Recovery",
    title: "Nutrilite Organics Plant Protein — Vanilla",
    sku: "125923",
    perDay: 1,
    repack: true,
    note: "Portioned scoops for 10-/30-Day; full tub when practical.",
  },
  {
    category: "Hygiene",
    title: "G&H Protect Hand Sanitizer",
    sku: "126855",
    fixed: 1,
    repack: false,
    note: "Included once per kit.",
  },
  {
    category: "Protein / Recovery",
    title: "Nutrilite Vitamin C — 180 tablets",
    sku: "109747",
    perDay: 1,
    repack: true,
    note: "Repacked into day-count sleeves.",
  },
  {
    category: "Protein / Recovery",
    title: "Nutrilite Vitamin D — 90 tablets",
    sku: "119346",
    perDay: 1,
    repack: true,
    note: "Repacked into day-count sleeves.",
  },
  {
    category: "Protein / Recovery",
    title: "Nutrilite Advanced Omega — 60 softgels",
    sku: "126136",
    perDay: 1,
    repack: true,
    note: "Repacked into day-count sleeves.",
  },
  {
    category: "Focus / Energy",
    title: "Nutrilite Ultra Focus Energy Pack",
    sku: "123842",
    perDay: 1,
    repack: false,
    note: "Keep sticks sealed.",
  },
];

export const KITS_BOM: Record<KitSlug, BomItem[]> = {
  resilient: RESILIENT_BOM,
  homefront: HOMEFRONT_BOM,
};

export const VARIANT_SCALE: Record<Variant, number> = {
  daily: 1,
  "10day": 10,
  "30day": 30,
};

export function scaledQty(item: BomItem, variant: Variant): number {
  const n = VARIANT_SCALE[variant];
  return (item.perDay ? item.perDay * n : 0) + (item.fixed ?? 0);
}

export function kitTitle(slug: KitSlug): string {
  return slug === "resilient" ? "Resilient Kit" : "Homefront Kit";
}

/** Customer-facing repack policy text. */
export const REPACK_POLICY = `
Daily is a one-day supply. 10-Day and 30-Day include the same items scaled 10× and 30×.
To keep kits compact, some consumables are repacked into clearly labeled day-count pouches.
When practical (e.g., 30-day bottles), we ship factory-sealed containers.
`.trim();
