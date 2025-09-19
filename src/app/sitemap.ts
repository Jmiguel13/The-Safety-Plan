// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { kits } from "@/lib/kits";

/** Rebuild at most once per day */
export const revalidate = 86_400;

function baseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return raw.replace(/\/+$/, ""); // strip trailing slash
}

export default function sitemap(): MetadataRoute.Sitemap {
  const host = baseUrl();
  const now = new Date();

  const staticRoutes: string[] = [
    "/",
    "/shop",
    "/kits",
    "/gallery",
    "/faq",
    "/donate",
    "/privacy",
    "/terms",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${host}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const kitEntries: MetadataRoute.Sitemap = (Array.isArray(kits) ? kits : [])
    .filter(
      (k): k is { slug: string; updatedAt?: string | Date } =>
        !!k && typeof k.slug === "string"
    )
    .map((k) => ({
      url: `${host}/kits/${k.slug}`,
      lastModified: k.updatedAt ? new Date(k.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  return [...staticEntries, ...kitEntries];
}
