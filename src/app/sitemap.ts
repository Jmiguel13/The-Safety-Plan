// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getSupabase } from "@/lib/ssr-supabase";

type KitSlugRow = { slug: string | null };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
  const sb = getSupabase();

  let slugs: string[] = [];
  try {
    const { data } = await sb.from("kits").select("slug").eq("is_published", true);
    const rows = (data ?? []) as KitSlugRow[];
    slugs = rows.map(r => r.slug).filter((s): s is string => typeof s === "string" && s.length > 0);
  } catch {}

  const now = new Date();

  const urls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/kits`, lastModified: now, changeFrequency: "daily" as const, priority: 0.6 },
    { url: `${base}/donate`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${base}/gallery`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.4 },
  ];

  urls.push(
    ...slugs.map(
      (slug): MetadataRoute.Sitemap[number] => ({
        url: `${base}/kits/${slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })
    )
  );

  return urls;
}
