// app/sitemap.ts
import type { MetadataRoute } from "next";
import { supabasePublic } from "@/lib/supabasePublic";
import { IS_PROD } from "@/lib/env";

export const revalidate = 300; // refresh sitemap every 5 minutes

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // No sitemap on dev/preview to avoid indexing previews
  if (!IS_PROD) return [];

  const now = new Date();

  let kits: { slug: string }[] = [];
  try {
    const { data } = await supabasePublic
      .from("kits")
      .select("slug")
      .eq("is_published", true);
    kits = data ?? [];
  } catch {
    // fail soft: we'll still return the base routes below
  }

  const kitUrls = kits.map((k) => ({
    url: `${base}/kits/${k.slug}`,
    lastModified: now,
  }));

  return [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/kits`, lastModified: now },
    { url: `${base}/faq`, lastModified: now },
    { url: `${base}/contact`, lastModified: now },
    ...kitUrls,
  ];
}
