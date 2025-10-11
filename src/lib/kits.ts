// Master list of Kits shown on /kits and individual kit pages.
// V.5: shared option model + XS Energy flavor choices + Men's Pack include option.

export type KitItem = {
  title?: string;      // UI title
  sku: string;         // Partner SKU
  qty?: number;        // default 1
  note?: string;
  buy_url?: string;    // optional PDP override
};

export type KitOption =
  | {
      type: "select";
      key: "energyFlavor";
      label: "XS Energy Flavor";
      // label shown to user → sku it maps to
      choices: Array<{ label: string; sku: string }>;
      defaultSku: string; // default selection
    }
  | {
      type: "checkbox";
      key: "includeMensPack";
      label: "Add Nutrilite Men’s Daily Multivitamin";
      sku: string; // 125557
      defaultChecked?: boolean;
    }
  | {
      type: "select";
      key: "proteinChoice";
      label: "Protein Type";
      choices: Array<{ label: string; sku: string }>;
      defaultSku: string;
    };

export type Kit = {
  slug: string;
  title?: string;
  subtitle?: string;
  description?: string;
  weight_lb?: number | string;
  items?: KitItem[];     // base items always included
  options?: KitOption[]; // user picks at purchase time
  gear?: string[];
  addons?: string[];
  image?: string;
  imageAlt?: string;
};

export const kits: Kit[] = [
  {
    slug: "resilient",
    title: "Resilient Kit",
    subtitle: "Built for daily carry. Energy, hydration, recovery, morale.",
    weight_lb: "3.0 lb",
    // Base items (no flavor-dependent SKUs here)
    items: [
      { title: "XS Sports Electrolyte Drink Mix – Strawberry Watermelon", sku: "110601", qty: 1 },
      { title: "Nutrilite Vitamin C Extended Release (180)", sku: "109747", qty: 1 },
      { title: "Nutrilite Vitamin D (90)", sku: "119346", qty: 1 },
      { title: "Nutrilite Advanced Omega (60 softgels)", sku: "126136", qty: 1 },
      { title: "Nutrilite Magnesium (60 caps)", sku: "128032", qty: 1 },
      { title: "Nutrilite Ultra Focus Energy Pack", sku: "123842", qty: 1 },
      // default protein is whey vanilla; can be changed via option
      { title: "XS Grass-Fed Whey Protein — Vanilla", sku: "128154", qty: 1 },
    ],
    options: [
      {
        type: "select",
        key: "energyFlavor",
        label: "XS Energy Flavor",
        choices: [
          { label: "Classic (12-pack)", sku: "126883" },
          { label: "Tropical (12-pack)", sku: "126199" },
          { label: "Dragon Fruit Juiced (12-pack)", sku: "126985" },
          { label: "Caffeine-Free Cranberry-Grape (12 oz)", sku: "126983" },
          { label: "Variety Case (12-pack)", sku: "127070" },
        ],
        defaultSku: "127070",
      },
      {
        type: "checkbox",
        key: "includeMensPack",
        label: "Add Nutrilite Men’s Daily Multivitamin",
        sku: "125557",
        defaultChecked: true,
      },
      {
        type: "select",
        key: "proteinChoice",
        label: "Protein Type",
        choices: [
          { label: "XS Grass-Fed Whey — Vanilla", sku: "128154" },
          { label: "XS Grass-Fed Whey — Chocolate", sku: "128156" },
          { label: "XS Grass-Fed Whey — Unflavored", sku: "128155" },
          { label: "Nutrilite Organics Plant Protein — Vanilla", sku: "125923" },
        ],
        defaultSku: "128154",
      },
    ],
    gear: ["morale_patch", "sticker_pack"],
    addons: ["110631", "126883"],
    image: "/images/kits/resilient-hero.webp",
    imageAlt: "Resilient Kit hero",
  },

  {
    slug: "homefront",
    title: "Homefront Kit",
    subtitle: "Best for recovery. Rehydrate, restore, and rest.",
    weight_lb: "2.6 lb",
    items: [
      { title: "XS Sports Electrolyte Drink Mix – Blue Citrus", sku: "110631", qty: 1 },
      { title: "Nutrilite Vitamin C Extended Release (60)", sku: "109745", qty: 1 },
      { title: "Nutrilite Omega (60 softgels)", sku: "126132", qty: 1 },
      { title: "Nutrilite Concentrated Fruits & Vegetables (60)", sku: "100648", qty: 1 },
      { title: "Nutrilite Sleep Health", sku: "A8992", qty: 1 },
      { title: "n* by Nutrilite Sweet Dreams Sleep Gummies", sku: "124506", qty: 1 },
      // default protein is plant vanilla; can be changed via option
      { title: "Nutrilite Organics Plant Protein — Vanilla", sku: "125923", qty: 1 },
      { title: "G&H Protect Hand Sanitizer", sku: "126855", qty: 1 },
    ],
    options: [
      {
        type: "select",
        key: "energyFlavor",
        label: "XS Energy Flavor",
        choices: [
          { label: "Classic (12-pack)", sku: "126883" },
          { label: "Tropical (12-pack)", sku: "126199" },
          { label: "Dragon Fruit Juiced (12-pack)", sku: "126985" },
          { label: "Caffeine-Free Cranberry-Grape (12 oz)", sku: "126983" },
          { label: "Variety Case (12-pack)", sku: "127070" },
        ],
        defaultSku: "127070",
      },
      {
        type: "checkbox",
        key: "includeMensPack",
        label: "Add Nutrilite Men’s Daily Multivitamin",
        sku: "125557",
        defaultChecked: false,
      },
      {
        type: "select",
        key: "proteinChoice",
        label: "Protein Type",
        choices: [
          { label: "Nutrilite Organics Plant — Vanilla", sku: "125923" },
          { label: "XS Grass-Fed Whey — Vanilla", sku: "128154" },
          { label: "XS Grass-Fed Whey — Chocolate", sku: "128156" },
          { label: "XS Grass-Fed Whey — Unflavored", sku: "128155" },
        ],
        defaultSku: "125923",
      },
    ],
    gear: [],
    addons: ["125894", "110403"],
    image: "/images/kits/homefront-hero.webp",
    imageAlt: "Homefront Kit hero",
  },
];

export const kitsBySlug: Record<string, Kit> = Object.fromEntries(
  kits.map((k) => [k.slug, k])
);
export const getKit = (slug: string): Kit | undefined => kitsBySlug[slug];
