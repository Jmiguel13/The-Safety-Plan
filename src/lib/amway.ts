// src/lib/amway.ts
import { PRODUCT_URLS } from "@/lib/amway_product_urls";

export type CartItem = { sku: string; qty?: number };

/** ---- Env ---- */
const MYSHOP_BASE = (process.env.NEXT_PUBLIC_MYSHOP_BASE || "").trim(); // e.g. https://www.amway.com/myshop/TheSafetyPlan
const MYSHOP_ID = (process.env.NEXT_PUBLIC_AMWAY_SHOP_ID || "").trim(); // e.g. TheSafetyPlan
const DEFAULT_BASE = "https://www.amway.com/myshop";

const UTM_SOURCE = process.env.NEXT_PUBLIC_UTM_SOURCE || "safety-plan";
const UTM_MEDIUM = process.env.NEXT_PUBLIC_UTM_MEDIUM || "web";

/** Resolve the base MyShop URL from either explicit base or shop ID. */
function resolveBase(): string {
  if (MYSHOP_BASE) return stripTrailingSlash(MYSHOP_BASE);
  if (MYSHOP_ID) return `${DEFAULT_BASE}/${encodeURIComponent(MYSHOP_ID)}`;
  // As a last resort, still return the generic base so links open Amway.
  return DEFAULT_BASE;
}

function stripTrailingSlash(u: string) {
  return u.endsWith("/") ? u.slice(0, -1) : u;
}

function withUtm(url: string, campaign?: string) {
  const u = new URL(url);
  // set if not already present (caller can override)
  if (!u.searchParams.has("utm_source")) u.searchParams.set("utm_source", UTM_SOURCE);
  if (!u.searchParams.has("utm_medium")) u.searchParams.set("utm_medium", UTM_MEDIUM);
  if (campaign && !u.searchParams.has("utm_campaign")) u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}

/** ---- Public helpers ---- */

/** Link to your MyShop root or a subpath (e.g., "/search"). */
export function myShopLink(path = "", campaign?: string) {
  const base = resolveBase();
  const joined =
    path && path.startsWith("/")
      ? `${base}${path}`
      : path
      ? `${base}/${path}`
      : base;
  return withUtm(joined, campaign);
}

/** Deep link to storefront search (prefilled with SKU or term). */
export function productSearchLink(term: string, campaign?: string) {
  const u = new URL(myShopLink("/search", campaign));
  u.searchParams.set("q", term);
  return u.toString();
}

/** Returns a direct product URL for a SKU if known; else null (UTM merged). */
function productUrlForSku(sku: string): string | null {
  const raw = PRODUCT_URLS[sku];
  if (!raw) return null;
  try {
    return withUtm(raw);
  } catch {
    return null;
  }
}

/** Prefer exact product URL if known; otherwise fall back to search. */
export function productDeepLinkOrSearch(sku: string, campaign?: string) {
  const direct = productUrlForSku(sku);
  if (direct) {
    const u = new URL(direct);
    if (campaign && !u.searchParams.has("utm_campaign")) u.searchParams.set("utm_campaign", campaign);
    return u.toString();
  }
  return productSearchLink(sku, campaign);
}

/**
 * Amway rarely accepts public add-to-cart injection.
 * We return a storefront URL and include a compact `items` payload
 * for your own analytics/redirect handler.
 */
export function buildCartLink(items: CartItem[], campaign?: string) {
  const safe = items.map((i) => ({ sku: i.sku, qty: typeof i.qty === "number" ? i.qty : 1 }));
  const url = new URL(myShopLink("/", campaign));
  url.searchParams.set("items", JSON.stringify(safe));
  return url.toString();
}

/** Same concept as buildCartLink but with a simple SKU list. */
export function buildKitLink(skus: string[], campaign?: string) {
  const safe = skus.map((sku) => ({ sku, qty: 1 }));
  const url = new URL(myShopLink("/", campaign));
  url.searchParams.set("items", JSON.stringify(safe));
  return url.toString();
}

