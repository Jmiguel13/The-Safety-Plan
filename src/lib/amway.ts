// src/lib/amway.ts

import { PRODUCT_URLS } from "@/lib/amway_product_urls";

export type CartItem = { sku: string; qty?: number };

/** ---- Env + base helpers ---- */
const RAW_BASE = (process.env.NEXT_PUBLIC_MYSHOP_BASE || "").trim();
const BASE = RAW_BASE.replace(/\/+$/, ""); // strip trailing slashes
const UTM_SOURCE = process.env.NEXT_PUBLIC_UTM_SOURCE || "safety-plan";
const UTM_MEDIUM = process.env.NEXT_PUBLIC_UTM_MEDIUM || "web";

/** Ensure we always have a valid origin to point to */
function baseUrl(): URL {
  // Prefer configured MyShop; fallback to main Amway home.
  const fallback = "https://www.amway.com/";
  try {
    return new URL(BASE || fallback);
  } catch {
    return new URL(fallback);
  }
}

function withUtm(u: URL, campaign?: string) {
  // Only set if not already present so callers can override
  if (!u.searchParams.has("utm_source")) u.searchParams.set("utm_source", UTM_SOURCE);
  if (!u.searchParams.has("utm_medium")) u.searchParams.set("utm_medium", UTM_MEDIUM);
  if (campaign && !u.searchParams.has("utm_campaign")) u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}

/** Build a link to your MyShop (optionally with a path like '/search') */
export function myShopLink(path = "", campaign?: string) {
  const b = baseUrl();
  // Normalize path joining
  const joined =
    path && path.startsWith("/")
      ? `${b.origin}${path}`
      : path
      ? `${b.origin}/${path}`
      : b.origin;
  return withUtm(new URL(joined), campaign);
}

/** ---- Product search / deep link helpers ---- */

/**
 * Deep link to your storefront search, pre-filled with a query (SKU or term).
 * Adjust the path if your MyShop uses a different search route.
 */
export function productSearchLink(term: string, campaign?: string) {
  const u = new URL(myShopLink("/search", campaign));
  u.searchParams.set("q", term);
  return u.toString();
}

/** Returns a direct product URL for a SKU if known, else null (with UTM merged) */
function productUrlForSku(sku: string): string | null {
  const raw = PRODUCT_URLS[sku];
  if (!raw) return null;
  try {
    return withUtm(new URL(raw));
  } catch {
    return null;
  }
}

/** Prefer exact product URL if known; otherwise fall back to search */
export function productDeepLinkOrSearch(sku: string, campaign?: string) {
  const direct = productUrlForSku(sku);
  if (direct) {
    const u = new URL(direct);
    if (campaign && !u.searchParams.has("utm_campaign")) u.searchParams.set("utm_campaign", campaign);
    return u.toString();
  }
  return productSearchLink(sku, campaign);
}

/** ---- Cart / kit link builders (analytics-friendly fallbacks) ---- */

/**
 * Amway doesn’t reliably accept public “add to cart” query injection.
 * We still return a storefront URL but include a lightweight `items` payload
 * for YOUR logging/analytics (e.g., in your /r/[slug] redirect or client events).
 */
export function buildCartLink(items: CartItem[], campaign?: string) {
  const u = new URL(myShopLink("/", campaign));
  // Keep small + readable; don’t exceed URL limits
  // Shape: items=[{sku,qty},...]
  const safe = items.map((i) => ({ sku: i.sku, qty: typeof i.qty === "number" ? i.qty : 1 }));
  u.searchParams.set("items", JSON.stringify(safe));
  return u.toString();
}

/** Same idea as buildCartLink, but accepts a simple SKU list */
export function buildKitLink(skus: string[], campaign?: string) {
  const u = new URL(myShopLink("/", campaign));
  const safe = skus.map((sku) => ({ sku, qty: 1 }));
  u.searchParams.set("items", JSON.stringify(safe));
  return u.toString();
}
