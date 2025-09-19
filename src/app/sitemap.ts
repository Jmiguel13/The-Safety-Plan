// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { kits } from "@/lib/kits";
import { getEnv } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (() => {
    try {
      return new URL(getEnv().NEXT_PUBLIC_SITE_URL);
    } catch {
      return new URL("http://localhost:3000");
    }
  })();

  const u = (path: string) => new URL(path, base).toString();
  const now = new Date();

  // Core site routes
  const core: MetadataRoute.Sitemap = [
    { url: u("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: u("/shop"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: u("/kits"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: u("/gallery"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: u("/faq"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: u("/donate"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: u("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: u("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Kit detail pages
  const kitPages: MetadataRoute.Sitemap = (Array.isArray(kits) ? kits : []).map((k) => ({
    url: u(`/kits/${k.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...core, ...kitPages];
}
