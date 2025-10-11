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
  /** Kept for compatibility; always false so no “Repacked.” text renders */
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
    note: "Keep sealed.",
  },
  {
    category: "Hydration",
    title: "XS Sports Electrolyte — Strawberry Watermelon",
    sku: "110601",
    perDay: 1,
    repack: false,
    note: "Keep sealed.",
  },
  {
    category: "Rest",
    title: "Nutrilite Sleep Health",
    sku: "A8992",
    perDay: 1,
    repack: false,
    note: "Daily portion for multi-day kits.",
  },
  {
    category: "Rest",
    title: "n* by Nutrilite Sweet Dreams Sleep Gummies",
    sku: "124506",
    perDay: 2,
    repack: false,
    note: "Daily serving: 2/night.",
  },
  {
    category: "Protein / Recovery",
    title: "Nutrilite Organics Plant Protein — Vanilla",
    sku: "125923",
    perDay: 1,
    repack: false,
    note: "Daily scoop for multi-day kits; full tub when practical.",
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
    repack: false,
    note: "Daily serving.",
  },
  {
    category: "Protein / Recovery",
    title: "Nutrilite Vitamin D — 90 tablets",
    sku: "119346",
    perDay: 1,
    repack: false,
    note: "Daily serving.",
  },
  {
    category: "Protein / Recovery",
    title: "Nutrilite Advanced Omega — 60 softgels",
    sku: "126136",
    perDay: 1,
    repack: false,
    note: "Daily serving.",
  },
  {
    category: "Hydration",
    title: "XS Electrolyte (spare sticks)",
    sku: "110601",
    perDay: 1,
    repack: false,
    note: "Additional coverage.",
  },
];

/** Home Front Kit — add/adjust items as needed */
export const HOMEFRONT_BOM: BomItem[] = [
  {
    category: "Hydration",
    title: "XS Sports Electrolyte — Strawberry Watermelon",
    sku: "110601",
    perDay: 1,
    repack: false,
    note: "Keep sealed.",
  },
  {
    category: "Rest",
    title: "Nutrilite Sleep Health",
    sku: "A8992",
    perDay: 1,
    repack: false,
    note: "Daily portion for multi-day kits.",
  },
  {
    category: "Rest",
    title: "n* by Nutrilite Sweet Dreams Sleep Gummies",
    sku: "124506",
    perDay: 2,
    repack: false,
    note: "Daily serving: 2/night.",
  },
  {
    category: "Protein / Recovery",
    title: "Nutrilite Organics Plant Protein — Vanilla",
    sku: "125923",
    perDay: 1,
    repack: false,
    note: "Daily scoop for multi-day kits; full tub when practical.",
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
    repack: false,
    note: "Daily serving.",
  },
  {
    category: "Protein / Recovery",
    title: "Nutrilite Vitamin D — 90 tablets",
    sku: "119346",
    perDay: 1,
    repack: false,
    note: "Daily serving.",
  },
  {
    category: "Protein / Recovery",
    title: "Nutrilite Advanced Omega — 60 softgels",
    sku: "126136",
    perDay: 1,
    repack: false,
    note: "Daily serving.",
  },
  {
    category: "Focus / Energy",
    title: "Nutrilite Ultra Focus Energy Pack",
    sku: "123842",
    perDay: 1,
    repack: false,
    note: "Keep sealed.",
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
  return slug === "resilient" ? "Resilient Kit" : "Home Front Kit";
}

/** Customer-facing policy text (no repack wording). */
export const REPACK_POLICY = `
Daily is a one-day supply. 10-Day and 30-Day include the same items scaled 10× and 30×.
When practical (e.g., larger bottles or tubs), we include factory-sealed containers.
`.trim();
