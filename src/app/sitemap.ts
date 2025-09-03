// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { kits } from "@/lib/kits";

function originFromEnvOrFallback() {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  return env || "https://the-safety-plan.vercel.app";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = originFromEnvOrFallback();
  const now = new Date();

  const base: MetadataRoute.Sitemap = [
    { url: `${origin}/`,           lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/kits`,       lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${origin}/shop`,       lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${origin}/gallery`,    lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  const kitPages: MetadataRoute.Sitemap = kits.flatMap((k) => ([
    { url: `${origin}/kits/${k.slug}`,        lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${origin}/kits/${k.slug}/items`,  lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ]));

  return [...base, ...kitPages];
}
