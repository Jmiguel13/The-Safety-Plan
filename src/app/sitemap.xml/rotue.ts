// src/app/sitemap.xml/route.ts
import { kits } from "@/lib/kits";

export const dynamic = "error"; // fully static
export const runtime = "nodejs";

function siteOrigin(headers: Headers): string {
  // Try explicit env, then header, then fallback
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (envUrl) return envUrl;

  const host = headers.get("x-forwarded-host") || headers.get("host") || "";
  const proto =
    headers.get("x-forwarded-proto") ||
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  return host ? `${proto}://${host}` : "https://the-safety-plan.vercel.app";
}

function lastmodISO(d = new Date()) {
  return d.toISOString();
}

export async function GET(req: Request) {
  const origin = siteOrigin(req.headers);

  // Base routes you have live
  const basePaths = ["", "/kits", "/shop", "/gallery"].map((p) => `${origin}${p}`);

  // Kit pages + items pages from static kits.ts (no DB)
  const kitPaths = kits.flatMap((k) => [
    `${origin}/kits/${k.slug}`,
    `${origin}/kits/${k.slug}/items`,
  ]);

  const urls = [...basePaths, ...kitPaths];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (loc) => `
      <url>
        <loc>${loc}</loc>
        <lastmod>${lastmodISO()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>`
      )
      .join("\n")}
  </urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
