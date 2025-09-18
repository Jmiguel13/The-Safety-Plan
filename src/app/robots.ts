// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const host = raw.replace(/\/+$/, ""); // strip trailing slash

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // block internal/admin-only paths if you like:
        disallow: ["/admin", "/api/*"],
      },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}

