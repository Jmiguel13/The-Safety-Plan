// src/lib/amway-products.ts
import { myShopLink } from "@/lib/amway";

export type AmwayProduct = {
  name: string;
  sku: string;
  category:
    | "Energy & Hydration"
    | "Nutrilite Core"
    | "Protein"
    | "G&H"
    | "Home"
    | "Upsell";
  canonicalUrl?: string;
  myShopUrl: string;
  size?: string;
  price?: number;
  image?: string;
};

export const amwayProducts: AmwayProduct[] = [
  // ⚡ Energy & Hydration
  {
    name: "XS Energy Drink 12-pack – Variety Case",
    sku: "127070",
    category: "Energy & Hydration",
    canonicalUrl:
      "https://www.amway.com/XS%E2%84%A2-Energy-Drink-12-oz-%E2%80%93-Variety-Case-p-127070",
    myShopUrl: myShopLink("127070"),
    size: "12 x 12 oz",
  },
  {
    name: "XS Energy Drink 12-pack – Classic",
    sku: "126883",
    category: "Energy & Hydration",
    canonicalUrl:
      "https://www.amway.com/XS%E2%84%A2-Energy-Drink-12-oz---Classic-p-126883",
    myShopUrl: myShopLink("126883"),
    size: "12 x 12 oz",
  },
  {
    name: "XS Sparkling Juiced – Dragon Fruit (12-pack)",
    sku: "126985",
    category: "Energy & Hydration",
    canonicalUrl:
      "https://www.amway.com/XS%E2%84%A2-Sparkling-Juiced-Energy-Drink-Dragon-Fruit-p-126985",
    myShopUrl: myShopLink("126985"),
    size: "12 x 12 oz",
  },
  {
    name: "XS Energy Drink 12-pack – Tropical",
    sku: "126199",
    category: "Energy & Hydration",
    canonicalUrl:
      "https://www.amway.com/XS%E2%84%A2-Energy-Drink-12-oz---Tropical-p-126199",
    myShopUrl: myShopLink("126199"),
    size: "12 x 12 oz",
  },
  {
    name: "XS Sports Electrolyte Drink Mix – Strawberry Watermelon",
    sku: "110601",
    category: "Energy & Hydration",
    canonicalUrl:
      "https://www.amway.com/XS%E2%84%A2-CocoWater-Hydration-Drink-Mix-Strawberry-Watermelon-p-110601",
    myShopUrl: myShopLink("110601"),
  },
  {
    name: "XS Sports Electrolyte Drink Mix – Blue Citrus",
    sku: "110631",
    category: "Energy & Hydration",
    canonicalUrl:
      "https://www.amway.com/XS%E2%84%A2-CocoWater-Hydration-Drink-Mix-Blue-Citrus-p-110631",
    myShopUrl: myShopLink("110631"),
  },
  {
    name: "XS Energy Drink – Caffeine Free Cranberry-Grape (12 oz)",
    sku: "126983",
    category: "Energy & Hydration",
    canonicalUrl:
      "https://www.amway.com/XS%E2%84%A2-Energy-Drink-12-oz-Caffeine-Free-Cranberry-Grape-p-126983",
    myShopUrl: myShopLink("126983"),
  },

  // 🌱 Nutrilite™ Core
  {
    name: "Vitamin C Extended Release (60 tablets)",
    sku: "109745",
    category: "Nutrilite Core",
    canonicalUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Vitamin-C-Extended-Release-p-109745",
    myShopUrl: myShopLink("109745"),
    size: "60 tabs",
  },
  {
    name: "Vitamin C Extended Release (180 tablets)",
    sku: "109747",
    category: "Nutrilite Core",
    canonicalUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Vitamin-C-Extended-Release-p-109747",
    myShopUrl: myShopLink("109747"),
    size: "180 tabs",
  },
  {
    name: "Vitamin D (90 tablets)",
    sku: "119346",
    category: "Nutrilite Core",
    canonicalUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Vitamin-D-p-119346",
    myShopUrl: myShopLink("119346"),
    size: "90 tabs",
  },
  {
    name: "Omega – 60 softgels",
    sku: "126132",
    category: "Nutrilite Core",
    canonicalUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Omega-p-126132",
    myShopUrl: myShopLink("126132"),
    size: "60 softgels",
  },
  {
    name: "Advanced Omega – 60 softgels",
    sku: "126136",
    category: "Nutrilite Core",
    canonicalUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Advanced-Omega-p-126136",
    myShopUrl: myShopLink("126136"),
    size: "60 softgels",
  },
  {
    name: "Magnesium (60 capsules)",
    sku: "128032",
    category: "Nutrilite Core",
    canonicalUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Magnesium-p-128032",
    myShopUrl: myShopLink("128032"),
    size: "60 caps",
  },
  {
    name: "Sleep Health",
    sku: "A8992",
    category: "Nutrilite Core",
    canonicalUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Sleep-Health-p-A8992",
    myShopUrl: myShopLink("A8992"),
  },
  {
    name: "n* by Nutrilite Sweet Dreams Gummies (Melatonin)",
    sku: "124506",
    category: "Nutrilite Core",
    canonicalUrl:
      "https://www.amway.com/n-by-Nutrilite%E2%84%A2-Sweet-Dreams-Sleep-Gummies-p-124506",
    myShopUrl: myShopLink("124506"),
  },
  {
    name: "Concentrated Fruits & Vegetables (60 tablets)",
    sku: "100648",
    category: "Nutrilite Core",
    canonicalUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Concentrated-Fruits-and-Vegetables-p-100648",
    myShopUrl: myShopLink("100648"),
  },
  {
    name: "Nutrilite Double X Multivitamin – 10-day Supply",
    sku: "123364",
    category: "Nutrilite Core",
    canonicalUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Double-X%E2%84%A2-Multivitamin-10-day-Supply-p-123364",
    myShopUrl: myShopLink("123364"),
  },
  {
    name: "Nutrilite Kids Complete Immunity Fast-Melt Powder",
    sku: "123046",
    category: "Nutrilite Core",
    canonicalUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Kids-Complete-Immunity-Fast-Melt-Powder-p-123046",
    myShopUrl: myShopLink("123046"),
  },
  {
    name: "Nutrilite Men’s Daily Multivitamin Tablets",
    sku: "125557",
    category: "Nutrilite Core",
    canonicalUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Men%E2%80%99s-Daily-Multivitamin-Tablets-p-125557",
    myShopUrl: myShopLink("125557"),
  },
  {
    name: "Nutrilite Ultra Focus Energy Pack",
    sku: "123842",
    category: "Nutrilite Core",
    canonicalUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Ultra-Focus-Energy-Pack-p-123842",
    myShopUrl: myShopLink("123842"),
  },

  // 💪 Protein
  {
    name: "XS Protein Pods – Vanilla",
    sku: "300855",
    category: "Protein",
    canonicalUrl:
      "https://www.amway.com/XS%E2%84%A2-Protein-Pods-Vanilla-p-300855",
    myShopUrl: myShopLink("300855"),
  },
  {
    name: "XS Protein Pods – Chocolate",
    sku: "300856",
    category: "Protein",
    canonicalUrl:
      "https://www.amway.com/XS%E2%84%A2-Protein-Pods-Chocolate-p-300856",
    myShopUrl: myShopLink("300856"),
  },
  {
    name: "XS Protein Pods – Strawberry",
    sku: "308599",
    category: "Protein",
    canonicalUrl:
      "https://www.amway.com/XS%E2%84%A2-Protein-Pods-Strawberry-p-308599",
    myShopUrl: myShopLink("308599"),
  },
  {
    name: "XS Grass-Fed Whey Protein – Vanilla",
    sku: "128154",
    category: "Protein",
    canonicalUrl:
      "https://www.amway.com/XS%E2%84%A2-Grass-Fed-Whey-Protein-Vanilla-p-128154",
    myShopUrl: myShopLink("128154"),
  },
  {
    name: "XS Grass-Fed Whey Protein – Unflavored",
    sku: "128155",
    category: "Protein",
    canonicalUrl:
      "https://www.amway.com/XS%E2%84%A2-Grass-Fed-Whey-Protein-Unflavored-p-128155",
    myShopUrl: myShopLink("128155"),
  },
  {
    name: "XS Grass-Fed Whey Protein – Chocolate",
    sku: "128156",
    category: "Protein",
    canonicalUrl:
      "https://www.amway.com/XS%E2%84%A2-Grass-Fed-Whey-Protein-Chocolate-p-128156",
    myShopUrl: myShopLink("128156"),
  },
  {
    name: "Nutrilite Organics Plant Protein Powder – Vanilla",
    sku: "125923",
    category: "Protein",
    canonicalUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Organics-Plant-Protein-Powder-Vanilla-p-125923",
    myShopUrl: myShopLink("125923"),
  },
  {
    name: "Nutrilite Organics Plant Protein Powder – Vanilla Samples",
    sku: "317535",
    category: "Protein",
    canonicalUrl:
      "https://www.amway.com/Nutrilite%E2%84%A2-Organics-Plant-Protein-Powder-Vanilla-Samples-p-317535",
    myShopUrl: myShopLink("317535"),
  },

  // 🧼 G&H™
  {
    name: "G&H Protect Hand Sanitizer",
    sku: "126855",
    category: "G&H",
    canonicalUrl:
      "https://www.amway.com/g%26h%E2%84%A2-Protect-Hand-Sanitizer-p-126855",
    myShopUrl: myShopLink("126855"),
  },
  {
    name: "G&H Protect Hand Soap (250 mL)",
    sku: "125894",
    category: "G&H",
    canonicalUrl:
      "https://www.amway.com/g%26h%E2%84%A2-Protect-Hand-Soap-p-125894",
    myShopUrl: myShopLink("125894"),
  },
  {
    name: "G&H Protect Bar Soap (travel)",
    sku: "125897TR",
    category: "G&H",
    canonicalUrl:
      "https://www.amway.com/g%26h%E2%84%A2-Protect-Bar-Soap-p-125897TR",
    myShopUrl: myShopLink("125897TR"),
  },
  {
    name: "G&H Nourish Body Wash (400 mL)",
    sku: "125890",
    category: "G&H",
    canonicalUrl:
      "https://www.amway.com/g%26h%E2%84%A2-Nourish-Body-Wash-p-125890",
    myShopUrl: myShopLink("125890"),
  },
  {
    name: "G&H Nourish Body Wash (1 L)",
    sku: "125914",
    category: "G&H",
    canonicalUrl:
      "https://www.amway.com/g%26h%E2%84%A2-Nourish-Body-Wash-p-125914",
    myShopUrl: myShopLink("125914"),
  },

  // 🏠 Amway Home™
  {
    name: "Amway Home Prewash Spray",
    sku: "110403",
    category: "Home",
    canonicalUrl:
      "https://www.amway.com/Amway-Home%E2%84%A2-Prewash-Spray-p-110403",
    myShopUrl: myShopLink("110403"),
  },
  {
    name: "L.O.C. Multi-Purpose Cleaner (1 L)",
    sku: "E0001",
    category: "Home",
    canonicalUrl:
      "https://www.amway.com/Amway-Home%E2%84%A2-LOC-Multi-Purpose-Cleaner-p-E0001",
    myShopUrl: myShopLink("E0001"),
  },
  {
    name: "Dish Drops™ Dishwashing Liquid (1 L)",
    sku: "110488",
    category: "Home",
    canonicalUrl:
      "https://www.amway.com/Amway-Home%E2%84%A2-Dish-Drops%E2%84%A2-Dishwashing-Liquid-p-110488",
    myShopUrl: myShopLink("110488"),
  },
  {
    name: "L.O.C. Bathroom Cleaner (500 mL)",
    sku: "0002",
    category: "Home",
    canonicalUrl:
      "https://www.amway.com/Amway-Home%E2%84%A2-LOC-Bathroom-Cleaner-p-0002",
    myShopUrl: myShopLink("0002"),
  },
  {
    name: "L.O.C. Glass Cleaner (500 mL)",
    sku: "0003",
    category: "Home",
    canonicalUrl:
      "https://www.amway.com/Amway-Home%E2%84%A2-LOC-Glass-Cleaner-p-0003",
    myShopUrl: myShopLink("0003"),
  },
  {
    name: "SA8 Premium Laundry Detergent (1 kg powder)",
    sku: "110480",
    category: "Home",
    canonicalUrl:
      "https://www.amway.com/Amway-Home%E2%84%A2-SA8%E2%84%A2-Premium-Laundry-Detergent-p-110480",
    myShopUrl: myShopLink("110480"),
  },
  {
    name: "Fabric Softener (1 L)",
    sku: "110493",
    category: "Home",
    canonicalUrl:
      "https://www.amway.com/Amway-Home%E2%84%A2-Fabric-Softener-p-110493",
    myShopUrl: myShopLink("110493"),
  },
  {
    name: "Scrub Buds™ Stainless Steel Scouring Pads (4-pack)",
    sku: "110486",
    category: "Home",
    canonicalUrl:
      "https://www.amway.com/Amway-Home%E2%84%A2-Scrub-Buds%E2%84%A2-Stainless-Steel-Scouring-Pads-p-110486",
    myShopUrl: myShopLink("110486"),
  },

  // 💧 Optional / Upsell
  {
    name: "eSpring Replacement Filter",
    sku: "100186",
    category: "Upsell",
    canonicalUrl:
      "https://www.amway.com/eSpring%E2%84%A2-Replacement-Filter-p-100186",
    myShopUrl: myShopLink("100186"),
  },
];
