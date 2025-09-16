/**
 * Canonical Amway catalog entries that we care about.
 * - Provides titles and (optional) canonical Amway PDP URLs.
 * - Use getCatalogItem(sku) for safe lookups and title fallbacks.
 */

export type CatalogItem = {
  sku: string;
  title: string;
  /** Canonical public Amway PDP URL (optional convenience) */
  amwayUrl?: string;
};

/** Normalize keys so " 127070 " and 127070 resolve the same */
function normSku(sku: string | number): string {
  return String(sku).trim().toUpperCase();
}

/** Core catalog map keyed by normalized SKU (NOTE: string index signature fixes TS7053) */
const CATALOG: Record<string, CatalogItem> = {
  // ⚡ Energy & Hydration
  ["127070"]: {
    sku: "127070",
    title: "XS™ Energy Drink 12-pack – Variety Case",
    amwayUrl:
      "https://www.amway.com/XS%E2%84%A2-Energy-Drink-12-oz-%E2%80%93-Variety-Case-p-127070",
  },
  ["126883"]: {
    sku: "126883",
    title: "XS™ Energy Drink 12-pack – Classic",
    amwayUrl:
      "https://www.amway.com/XS%E2%84%A2-Energy-Drink-12-oz---Classic-p-126883",
  },
  ["126985"]: {
    sku: "126985",
    title: "XS™ Sparkling Juiced Energy – Dragon Fruit (12-pack)",
    amwayUrl:
      "https://www.amway.com/XS%E2%84%A2-Sparkling-Juiced-Energy-Drink-Dragon-Fruit-p-126985",
  },
  ["126199"]: {
    sku: "126199",
    title: "XS™ Energy Drink 12-pack – Tropical",
    amwayUrl:
      "https://www.amway.com/XS%E2%84%A2-Energy-Drink-12-oz---Tropical-p-126199",
  },
  ["110601"]: {
    sku: "110601",
    title: "XS™ Sports Electrolyte Drink Mix – Strawberry Watermelon",
    amwayUrl:
      "https://www.amway.com/XS%E2%84%A2-CocoWater-Hydration-Drink-Mix-Strawberry-Watermelon-p-110601",
  },
  ["110631"]: {
    sku: "110631",
    title: "XS™ Sports Electrolyte Drink Mix – Blue Citrus",
    amwayUrl:
      "https://www.amway.com/XS%E2%84%A2-CocoWater-Hydration-Drink-Mix-Blue-Citrus-p-110631",
  },
  ["126983"]: {
    sku: "126983",
    title: "XS™ Energy Drink – Caffeine Free Cranberry-Grape (12 oz)",
    amwayUrl:
      "https://www.amway.com/XS%E2%84%A2-Energy-Drink-12-oz-Caffeine-Free-Cranberry-Grape-p-126983",
  },

  // 🌱 Nutrilite™ Core
  ["109745"]: {
    sku: "109745",
    title: "Nutrilite™ Vitamin C Extended Release (60 tablets)",
    amwayUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Vitamin-C-Extended-Release-p-109745",
  },
  ["109747"]: {
    sku: "109747",
    title: "Nutrilite™ Vitamin C Extended Release (180 tablets)",
    amwayUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Vitamin-C-Extended-Release-p-109747",
  },
  ["119346"]: {
    sku: "119346",
    title: "Nutrilite™ Vitamin D (90 tablets)",
    amwayUrl: "https://www.amway.com/Nutrilite%E2%84%A2-Vitamin-D-p-119346",
  },
  ["126132"]: {
    sku: "126132",
    title: "Nutrilite™ Omega – 60 softgels",
    amwayUrl: "https://www.amway.com/Nutrilite%E2%84%A2-Omega-p-126132",
  },
  ["126136"]: {
    sku: "126136",
    title: "Nutrilite™ Advanced Omega – 60 softgels",
    amwayUrl: "https://www.amway.com/Nutrilite%E2%84%A2-Advanced-Omega-p-126136",
  },
  ["128032"]: {
    sku: "128032",
    title: "Nutrilite™ Magnesium (60 capsules)",
    amwayUrl: "https://www.amway.com/Nutrilite%E2%84%A2-Magnesium-p-128032",
  },
  ["A8992"]: {
    sku: "A8992",
    title: "Nutrilite™ Sleep Health",
    amwayUrl: "https://www.amway.com/Nutrilite%E2%84%A2-Sleep-Health-p-A8992",
  },
  ["124506"]: {
    sku: "124506",
    title: "n* by Nutrilite™ Sweet Dreams Sleep Gummies (Melatonin)",
    amwayUrl:
      "https://www.amway.com/n-by-Nutrilite%E2%84%A2-Sweet-Dreams-Sleep-Gummies-p-124506",
  },
  ["100648"]: {
    sku: "100648",
    title: "Nutrilite™ Concentrated Fruits & Vegetables (60 tablets)",
    amwayUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Concentrated-Fruits-and-Vegetables-p-100648",
  },
  ["123364"]: {
    sku: "123364",
    title: "Nutrilite™ Double X™ Multivitamin – 10-day Supply",
    amwayUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Double-X%E2%84%A2-Multivitamin-10-day-Supply-p-123364",
  },
  ["123046"]: {
    sku: "123046",
    title: "Nutrilite™ Kids Complete Immunity Fast-Melt Powder",
    amwayUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Kids-Complete-Immunity-Fast-Melt-Powder-p-123046",
  },
  ["125557"]: {
    sku: "125557",
    title: "Nutrilite™ Men’s Daily Multivitamin Tablets",
    amwayUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Men%E2%80%99s-Daily-Multivitamin-Tablets-p-125557",
  },
  ["123842"]: {
    sku: "123842",
    title: "Nutrilite™ Ultra Focus Energy Pack",
    amwayUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Ultra-Focus-Energy-Pack-p-123842",
  },

  // 💪 Protein (XS / Nutrilite)
  ["300855"]: {
    sku: "300855",
    title: "XS™ Protein Pods – Vanilla",
    amwayUrl: "https://www.amway.com/XS%E2%84%A2-Protein-Pods-Vanilla-p-300855",
  },
  ["300856"]: {
    sku: "300856",
    title: "XS™ Protein Pods – Chocolate",
    amwayUrl: "https://www.amway.com/XS%E2%84%A2-Protein-Pods-Chocolate-p-300856",
  },
  ["308599"]: {
    sku: "308599",
    title: "XS™ Protein Pods – Strawberry",
    amwayUrl: "https://www.amway.com/XS%E2%84%A2-Protein-Pods-Strawberry-p-308599",
  },
  ["128154"]: {
    sku: "128154",
    title: "XS™ Grass-Fed Whey Protein – Vanilla",
    amwayUrl:
      "https://www.amway.com/XS%E2%84%A2-Grass-Fed-Whey-Protein-Vanilla-p-128154",
  },
  ["128155"]: {
    sku: "128155",
    title: "XS™ Grass-Fed Whey Protein – Unflavored",
    amwayUrl:
      "https://www.amway.com/XS%E2%84%A2-Grass-Fed-Whey-Protein-Unflavored-p-128155",
  },
  ["128156"]: {
    sku: "128156",
    title: "XS™ Grass-Fed Whey Protein – Chocolate",
    amwayUrl:
      "https://www.amway.com/XS%E2%84%A2-Grass-Fed-Whey-Protein-Chocolate-p-128156",
  },
  ["125923"]: {
    sku: "125923",
    title: "Nutrilite™ Organics Plant Protein Powder – Vanilla",
    amwayUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Organics-Plant-Protein-Powder-Vanilla-p-125923",
  },
  ["317535"]: {
    sku: "317535",
    title:
      "Nutrilite™ Organics Plant Protein Powder – Vanilla (Samples)",
    amwayUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Organics-Plant-Protein-Powder-Vanilla-Samples-p-317535",
  },

  // 🧼 G&H™
  ["126855"]: {
    sku: "126855",
    title: "G&H™ Protect Hand Sanitizer",
    amwayUrl:
      "https://www.amway.com/g%26h%E2%84%A2-Protect-Hand-Sanitizer-p-126855",
  },
  ["125894"]: {
    sku: "125894",
    title: "G&H™ Protect Hand Soap (250 mL)",
    amwayUrl:
      "https://www.amway.com/g%26h%E2%84%A2-Protect-Hand-Soap-p-125894",
  },
  ["125897TR"]: {
    sku: "125897TR",
    title: "G&H™ Protect Bar Soap (travel)",
    amwayUrl:
      "https://www.amway.com/g%26h%E2%84%A2-Protect-Bar-Soap-p-125897TR",
  },
  ["125890"]: {
    sku: "125890",
    title: "G&H™ Nourish Body Wash (400 mL)",
    amwayUrl:
      "https://www.amway.com/g%26h%E2%84%A2-Nourish-Body-Wash-p-125890",
  },
  ["125914"]: {
    sku: "125914",
    title: "G&H™ Nourish Body Wash (1 L)",
    amwayUrl:
      "https://www.amway.com/g%26h%E2%84%A2-Nourish-Body-Wash-p-125914",
  },

  // 🏠 Amway Home™
  ["110403"]: {
    sku: "110403",
    title: "Amway Home™ Prewash Spray",
    amwayUrl:
      "https://www.amway.com/Amway-Home%E2%84%A2-Prewash-Spray-p-110403",
  },
  ["E0001"]: {
    sku: "E0001",
    title: "L.O.C. Multi-Purpose Cleaner (1 L)",
    amwayUrl:
      "https://www.amway.com/Amway-Home%E2%84%A2-LOC-Multi-Purpose-Cleaner-p-E0001",
  },
  ["110488"]: {
    sku: "110488",
    title: "Dish Drops™ Dishwashing Liquid (1 L)",
    amwayUrl:
      "https://www.amway.com/Amway-Home%E2%84%A2-Dish-Drops%E2%84%A2-Dishwashing-Liquid-p-110488",
  },
  ["0002"]: {
    sku: "0002",
    title: "L.O.C. Bathroom Cleaner (500 mL)",
    amwayUrl:
      "https://www.amway.com/Amway-Home%E2%84%A2-LOC-Bathroom-Cleaner-p-0002",
  },
  ["0003"]: {
    sku: "0003",
    title: "L.O.C. Glass Cleaner (500 mL)",
    amwayUrl:
      "https://www.amway.com/Amway-Home%E2%84%A2-LOC-Glass-Cleaner-p-0003",
  },
  ["110480"]: {
    sku: "110480",
    title: "SA8™ Premium Laundry Detergent (1 kg powder)",
    amwayUrl:
      "https://www.amway.com/Amway-Home%E2%84%A2-SA8%E2%84%A2-Premium-Laundry-Detergent-p-110480",
  },
  ["110493"]: {
    sku: "110493",
    title: "Fabric Softener (1 L)",
    amwayUrl:
      "https://www.amway.com/Amway-Home%E2%84%A2-Fabric-Softener-p-110493",
  },
  ["110486"]: {
    sku: "110486",
    title: "Scrub Buds™ Stainless Steel Scouring Pads (4-pack)",
    amwayUrl:
      "https://www.amway.com/Amway-Home%E2%84%A2-Scrub-Buds%E2%84%A2-Stainless-Steel-Scouring-Pads-p-110486",
  },

  // 💧 Optional / Upsell
  ["100186"]: {
    sku: "100186",
    title: "eSpring™ Replacement Filter",
    amwayUrl:
      "https://www.amway.com/eSpring%E2%84%A2-Replacement-Filter-p-100186",
  },
};

/** Lookup by SKU (whitespace/letter-case-insensitive). */
export function getCatalogItem(sku: string | number): CatalogItem | undefined {
  return CATALOG[normSku(sku)];
}

/** Convenience: all catalog items as an array (for admin tools, etc.) */
export const ALL_CATALOG_ITEMS: CatalogItem[] = Object.values(CATALOG);

/** Count (handy for admin sanity checks) */
export const CATALOG_SIZE = ALL_CATALOG_ITEMS.length;

/** Back-compat helper expected by components: returns { title, url }. */
export function catalogLookup(
  sku: string | number
): { title: string; url?: string } | null {
  const item = getCatalogItem(sku);
  if (!item) return null;
  return { title: item.title, url: item.amwayUrl };
}

/** Small helpers used in UI */
export const catalogTitle = (sku: string | number, fallback?: string) =>
  getCatalogItem(sku)?.title ?? fallback ?? String(sku);

export const catalogUrl = (sku: string | number) =>
  getCatalogItem(sku)?.amwayUrl;

export const isKnownSku = (sku: string | number) =>
  Object.prototype.hasOwnProperty.call(CATALOG, normSku(sku));
