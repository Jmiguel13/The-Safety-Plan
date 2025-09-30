// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim();

  // Normalize to an origin like https://example.com
  let origin = "http://localhost:3000";
  try {
    origin = new URL(raw).origin;
  } catch {
    // keep default
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/*"],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
