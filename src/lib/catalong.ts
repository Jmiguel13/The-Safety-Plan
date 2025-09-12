// src/lib/catalog.ts
// Canonical Amway catalog (as provided) — keep URLs for reference.
// CTAs on the site should still go through your MyShop via SKU.

export type CatalogItem = {
  sku: string;
  title: string;
  url: string; // canonical amway.com PDP/search URL (not MyShop)
};

export const CATALOG: CatalogItem[] = [
  // ⚡ Energy & Hydration
  { sku: "127070", title: "XS Energy Drink 12-pack – Variety Case", url: "https://www.amway.com/XS%E2%84%A2-Energy-Drink-12-oz-%E2%80%93-Variety-Case-p-127070" },
  { sku: "126883", title: "XS Energy Drink 12-pack – Classic", url: "https://www.amway.com/XS%E2%84%A2-Energy-Drink-12-oz---Classic-p-126883" },
  { sku: "126985", title: "XS Sparkling Juiced Energy – Dragon Fruit (12-pack)", url: "https://www.amway.com/XS%E2%84%A2-Sparkling-Juiced-Energy-Drink-Dragon-Fruit-p-126985" },
  { sku: "126199", title: "XS Energy Drink 12-pack – Tropical", url: "https://www.amway.com/XS%E2%84%A2-Energy-Drink-12-oz---Tropical-p-126199" },
  { sku: "110601", title: "XS Sports Electrolyte Drink Mix – Strawberry Watermelon", url: "https://www.amway.com/XS%E2%84%A2-CocoWater-Hydration-Drink-Mix-Strawberry-Watermelon-p-110601" },
  { sku: "110631", title: "XS Sports Electrolyte Drink Mix – Blue Citrus", url: "https://www.amway.com/XS%E2%84%A2-CocoWater-Hydration-Drink-Mix-Blue-Citrus-p-110631" },
  { sku: "126983", title: "XS Energy – Caffeine Free Cranberry-Grape (12 oz)", url: "https://www.amway.com/XS%E2%84%A2-Energy-Drink-12-oz-Caffeine-Free-Cranberry-Grape-p-126983" },

  // 🌱 Nutrilite Core
  { sku: "109745", title: "Nutrilite Vitamin C Extended Release (60)", url: "https://www.amway.com/Nutrilite%E2%84%A2-Vitamin-C-Extended-Release-p-109745" },
  { sku: "109747", title: "Nutrilite Vitamin C Extended Release (180)", url: "https://www.amway.com/Nutrilite%E2%84%A2-Vitamin-C-Extended-Release-p-109747" },
  { sku: "119346", title: "Nutrilite Vitamin D (90)", url: "https://www.amway.com/Nutrilite%E2%84%A2-Vitamin-D-p-119346" },
  { sku: "126132", title: "Nutrilite Omega (60 softgels)", url: "https://www.amway.com/Nutrilite%E2%84%A2-Omega-p-126132" },
  { sku: "126136", title: "Nutrilite Advanced Omega (60 softgels)", url: "https://www.amway.com/Nutrilite%E2%84%A2-Advanced-Omega-p-126136" },
  { sku: "128032", title: "Nutrilite Magnesium (60 caps)", url: "https://www.amway.com/Nutrilite%E2%84%A2-Magnesium-p-128032" },
  { sku: "A8992",  title: "Nutrilite Sleep Health", url: "https://www.amway.com/Nutrilite%E2%84%A2-Sleep-Health-p-A8992" },
  { sku: "124506", title: "n* by Nutrilite Sweet Dreams Sleep Gummies (Melatonin)", url: "https://www.amway.com/n-by-Nutrilite%E2%84%A2-Sweet-Dreams-Sleep-Gummies-p-124506" },
  { sku: "100648", title: "Nutrilite Concentrated Fruits & Vegetables (60)", url: "https://www.amway.com/Nutrilite%E2%84%A2-Concentrated-Fruits-and-Vegetables-p-100648" },
  { sku: "123364", title: "Nutrilite Double X Multivitamin – 10-day", url: "https://www.amway.com/Nutrilite%E2%84%A2-Double-X%E2%84%A2-Multivitamin-10-day-Supply-p-123364" },
  { sku: "123046", title: "Nutrilite Kids Complete Immunity Fast-Melt Powder", url: "https://www.amway.com/Nutrilite%E2%84%A2-Kids-Complete-Immunity-Fast-Melt-Powder-p-123046" },
  { sku: "125557", title: "Nutrilite Men’s Daily Multivitamin", url: "https://www.amway.com/Nutrilite%E2%84%A2-Men%E2%80%99s-Daily-Multivitamin-Tablets-p-125557" },
  { sku: "123842", title: "Nutrilite Ultra Focus Energy Pack", url: "https://www.amway.com/Nutrilite%E2%84%A2-Ultra-Focus-Energy-Pack-p-123842" },

  // 💪 Protein
  { sku: "300855", title: "XS Protein Pods – Vanilla", url: "https://www.amway.com/XS%E2%84%A2-Protein-Pods-Vanilla-p-300855" },
  { sku: "300856", title: "XS Protein Pods – Chocolate", url: "https://www.amway.com/XS%E2%84%A2-Protein-Pods-Chocolate-p-300856" },
  { sku: "308599", title: "XS Protein Pods – Strawberry", url: "https://www.amway.com/XS%E2%84%A2-Protein-Pods-Strawberry-p-308599" },
  { sku: "128154", title: "XS Grass-Fed Whey – Vanilla", url: "https://www.amway.com/XS%E2%84%A2-Grass-Fed-Whey-Protein-Vanilla-p-128154" },
  { sku: "128155", title: "XS Grass-Fed Whey – Unflavored", url: "https://www.amway.com/XS%E2%84%A2-Grass-Fed-Whey-Protein-Unflavored-p-128155" },
  { sku: "128156", title: "XS Grass-Fed Whey – Chocolate", url: "https://www.amway.com/XS%E2%84%A2-Grass-Fed-Whey-Protein-Chocolate-p-128156" },
  { sku: "125923", title: "Nutrilite Organics Plant Protein – Vanilla", url: "https://www.amway.com/Nutrilite%E2%84%A2-Organics-Plant-Protein-Powder-Vanilla-p-125923" },
  { sku: "317535", title: "Nutrilite Organics Plant Protein – Vanilla Samples", url: "https://www.amway.com/Nutrilite%E2%84%A2-Organics-Plant-Protein-Powder-Vanilla-Samples-p-317535" },

  // 🧼 G&H
  { sku: "126855", title: "G&H Protect Hand Sanitizer", url: "https://www.amway.com/g%26h%E2%84%A2-Protect-Hand-Sanitizer-p-126855" },
  { sku: "125894", title: "G&H Protect Hand Soap (250 mL)", url: "https://www.amway.com/g%26h%E2%84%A2-Protect-Hand-Soap-p-125894" },
  { sku: "125897TR", title: "G&H Protect Bar Soap (travel)", url: "https://www.amway.com/g%26h%E2%84%A2-Protect-Bar-Soap-p-125897TR" },
  { sku: "125890", title: "G&H Nourish Body Wash (400 mL)", url: "https://www.amway.com/g%26h%E2%84%A2-Nourish-Body-Wash-p-125890" },
  { sku: "125914", title: "G&H Nourish Body Wash (1 L)", url: "https://www.amway.com/g%26h%E2%84%A2-Nourish-Body-Wash-p-125914" },

  // 🏠 Amway Home
  { sku: "110403", title: "Amway Home Prewash Spray", url: "https://www.amway.com/Amway-Home%E2%84%A2-Prewash-Spray-p-110403" },
  { sku: "E0001",  title: "L.O.C. Multi-Purpose Cleaner (1 L)", url: "https://www.amway.com/Amway-Home%E2%84%A2-LOC-Multi-Purpose-Cleaner-p-E0001" },
  { sku: "110488", title: "Dish Drops Dishwashing Liquid (1 L)", url: "https://www.amway.com/Amway-Home%E2%84%A2-Dish-Drops%E2%84%A2-Dishwashing-Liquid-p-110488" },
  { sku: "0002",   title: "L.O.C. Bathroom Cleaner (500 mL)", url: "https://www.amway.com/Amway-Home%E2%84%A2-LOC-Bathroom-Cleaner-p-0002" },
  { sku: "0003",   title: "L.O.C. Glass Cleaner (500 mL)", url: "https://www.amway.com/Amway-Home%E2%84%A2-LOC-Glass-Cleaner-p-0003" },
  { sku: "110480", title: "SA8 Premium Laundry Detergent (1 kg powder)", url: "https://www.amway.com/Amway-Home%E2%84%A2-SA8%E2%84%A2-Premium-Laundry-Detergent-p-110480" },
  { sku: "110493", title: "Fabric Softener (1 L)", url: "https://www.amway.com/Amway-Home%E2%84%A2-Fabric-Softener-p-110493" },
  { sku: "110486", title: "Scrub Buds Stainless Steel Scouring Pads (4-pack)", url: "https://www.amway.com/Amway-Home%E2%84%A2-Scrub-Buds%E2%84%A2-Stainless-Steel-Scouring-Pads-p-110486" },

  // 💧 Optional / Upsell
  { sku: "100186", title: "eSpring Replacement Filter", url: "https://www.amway.com/eSpring%E2%84%A2-Replacement-Filter-p-100186" },
];

// Helpful lookups
export const CATALOG_BY_SKU = new Map(CATALOG.map(i => [i.sku, i]));
