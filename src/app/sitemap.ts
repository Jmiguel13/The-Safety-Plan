// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

  const paths = [
    "",        // /
    "kits",
    "shop",
    "donate",
    "faq",
    "gallery",
  ];

  return paths.map((p) => ({
    url: `${base}/${p}`,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));
}
