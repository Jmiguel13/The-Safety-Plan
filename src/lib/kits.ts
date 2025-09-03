// src/lib/kits.ts
import type { CartItem } from "@/lib/amway";
import { productSearchLink } from "@/lib/amway";

export type KitItem = CartItem & {
  title?: string;
  note?: string;
  buy_url?: string;
};

export type Kit = {
  slug: string;
  title: string;
  description: string;
  items: KitItem[];
};

export const kits: Kit[] = [
  {
    slug: "resilient",
    title: "Resilient Kit",
    description:
      "On-the-go energy, hydration, and core health support. Every purchase helps fund our mission to prevent veteran suicide.",
    items: [
      { sku: "127070", qty: 1, title: "XS™ Energy Drink — Variety (12-pack)",                buy_url: productSearchLink("127070", "kit-resilient") },
      { sku: "110601", qty: 1, title: "XS™ Sports Electrolyte — Strawberry Watermelon (sticks)", buy_url: productSearchLink("110601", "kit-resilient") },
      { sku: "109747", qty: 1, title: "Nutrilite™ Vitamin C Extended Release (180 ct)",      buy_url: productSearchLink("109747", "kit-resilient") },
      { sku: "119346", qty: 1, title: "Nutrilite™ Vitamin D (90 tablets)",                   buy_url: productSearchLink("119346", "kit-resilient") },
      { sku: "126136", qty: 1, title: "Nutrilite™ Advanced Omega (60 softgels)",             buy_url: productSearchLink("126136", "kit-resilient") },
      { sku: "128032", qty: 1, title: "Nutrilite™ Magnesium (60 capsules)",                  buy_url: productSearchLink("128032", "kit-resilient") },
      { sku: "A8992",  qty: 1, title: "Nutrilite™ Sleep Health",                             buy_url: productSearchLink("A8992",  "kit-resilient") },
      { sku: "100648", qty: 1, title: "Nutrilite™ Fruits & Vegetables (60 tablets)",         buy_url: productSearchLink("100648","kit-resilient") },
      { sku: "300855", qty: 1, title: "XS™ Protein Pods — Vanilla",                          buy_url: productSearchLink("300855","kit-resilient") },
      { sku: "126855", qty: 1, title: "G&H Protect Hand Sanitizer",                          buy_url: productSearchLink("126855","kit-resilient") },
      { sku: "125894", qty: 1, title: "G&H Protect Hand Soap (250 mL)",                      buy_url: productSearchLink("125894","kit-resilient") },
    ],
  },
  {
    slug: "homefront",
    title: "Homefront Kit",
    description:
      "Daily wellness and home essentials to support the base. Balanced care for you and your family at home.",
    items: [
      { sku: "E0001",  qty: 1, title: "L.O.C. Multi-Purpose Cleaner (1 L)",                   buy_url: productSearchLink("E0001", "kit-homefront") },
      { sku: "110488", qty: 1, title: "Dish Drops™ Dishwashing Liquid (1 L)",                buy_url: productSearchLink("110488","kit-homefront") },
      { sku: "0002",   qty: 1, title: "L.O.C. Bathroom Cleaner (500 mL)",                     buy_url: productSearchLink("0002",  "kit-homefront") },
      { sku: "0003",   qty: 1, title: "L.O.C. Glass Cleaner (500 mL)",                        buy_url: productSearchLink("0003",  "kit-homefront") },
      { sku: "110480", qty: 1, title: "SA8™ Premium Laundry Detergent (1 kg)",               buy_url: productSearchLink("110480","kit-homefront") },
      { sku: "110493", qty: 1, title: "Amway Home Fabric Softener (1 L)",                     buy_url: productSearchLink("110493","kit-homefront") },
      { sku: "110486", qty: 1, title: "Scrub Buds™ (4-pack)",                                 buy_url: productSearchLink("110486","kit-homefront") },
      { sku: "110403", qty: 1, title: "Amway Home Prewash Spray (Stain Pretreat)",            buy_url: productSearchLink("110403","kit-homefront") },
      { sku: "125894", qty: 1, title: "G&H Protect Hand Soap (250 mL)",                      buy_url: productSearchLink("125894","kit-homefront") },
    ],
  },
];
