// app/robots.ts
import { IS_PROD } from "@/lib/env";

export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    rules: IS_PROD ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: IS_PROD ? `${base}/sitemap.xml` : undefined,
  };
}
