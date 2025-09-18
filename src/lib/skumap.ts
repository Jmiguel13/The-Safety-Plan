// src/lib/skuMap.ts
// US Master SKU → Friendly Name
export const SKU_NAME: Record<string, string> = {
  // Energy & Hydration
  "127070": "XS Energy Drink 12-pack (Variety Case)",
  "126883": "XS Energy Drink 12-pack (Classic)",
  "126985": "XS Sparkling Juiced Energy Drink – Dragon Fruit",
  "126199": "XS Energy Drink 12-pack (Tropical)",
  "110601": "XS Sports Electrolyte Drink Mix — Strawberry Watermelon (sticks)",
  "110631": "XS Sports Electrolyte Drink Mix — Blue Citrus (sticks)",

  // Nutrilite™ Core
  "109745": "Nutrilite Vitamin C Extended Release (60 ct)",
  "109747": "Nutrilite Vitamin C Extended Release (180 ct)",
  "119346": "Nutrilite Vitamin D (90 tablets)",
  "126136": "Nutrilite Advanced Omega (60 softgels)",
  "126132": "Nutrilite Omega (60 softgels)",
  "128032": "Nutrilite Magnesium (60 capsules)",
  "A8992":  "Nutrilite Sleep Health",
  "124506": "n* by Nutrilite Sweet Dreams Gummies (Melatonin)",
  "100648": "Nutrilite Concentrated Fruits & Vegetables (60 tablets)",

  // Protein
  "300855": "XS Protein Pods – Vanilla",
  "300856": "XS Protein Pods – Chocolate",
  "308599": "XS Protein Pods – Strawberry",
  "128154": "XS Grass-Fed Whey Protein – Vanilla",
  "128155": "XS Grass-Fed Whey Protein – Unflavored",
  "128156": "XS Grass-Fed Whey Protein – Chocolate",
  "125923": "Nutrilite Organics Plant Protein – Vanilla",

  // G&H™ (Soap/Body Care)
  "126855": "G&H Protect Hand Sanitizer",
  "125894": "G&H Protect Hand Soap (250 mL)",
  "125897TR": "G&H Protect Bar Soap (travel)",
  "125890": "G&H Nourish Body Wash (400 mL)",
  "125914": "G&H Nourish Body Wash (1 L)",

  // Amway Home™ (Cleaning & Laundry)
  "E0001":  "Amway Home L.O.C. Multi-Purpose Cleaner (1 L)",
  "110488": "Amway Home Dish Drops Dishwashing Liquid (1 L)",
  "0002":   "Amway Home L.O.C. Bathroom Cleaner (500 mL)",
  "0003":   "Amway Home L.O.C. Glass Cleaner (500 mL)",
  "110480": "Amway Home SA8 Premium Laundry Detergent (1 kg powder)",
  "110493": "Amway Home Fabric Softener (1 L)",
  "110486": "Amway Home Scrub Buds (4-pack)",
  "110403": "Amway Home Prewash Spray (Laundry Stain Pretreat)",

  // Optional / Upsell
  "100186": "eSpring Replacement Filter",
};

export function nameForSku(sku: string): string {
  return SKU_NAME[sku] || sku;
}

