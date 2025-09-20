// src/lib/amway.ts
/**
 * Amway MyShop utilities: PDP links and multi-add cart link.
 * Adds UTM tags automatically from public env.
 * (Client-safe: imports ENV_PUBLIC from env.ts)
 */

import { ENV_PUBLIC } from "@/lib/env";

export type CartItem = {
  sku: string;
  qty?: number;
};

export const MYSHOP_BASE =
  (ENV_PUBLIC.NEXT_PUBLIC_AMWAY_MYSHOP_URL || "").replace(/\/+$/, "") ||
  "https://www.amway.com";

const CART_STRATEGY =
  (ENV_PUBLIC.NEXT_PUBLIC_AMWAY_CART_STRATEGY || "pairs").toLowerCase() as
    | "pairs"
    | "items"
    | "indexed";

/** Append UTM parameters to any URL */
function withUtm(url: string, extra?: Record<string, string | number | undefined>) {
  const u = new URL(url);
  const tags = {
    utm_source: ENV_PUBLIC.NEXT_PUBLIC_UTM_SOURCE,
    utm_medium: ENV_PUBLIC.NEXT_PUBLIC_UTM_MEDIUM,
    ...extra,
  };
  for (const [k, v] of Object.entries(tags)) {
    if (v) u.searchParams.set(k, String(v));
  }
  return u.toString();
}

/** PDP / search link for a specific SKU (falls back to storefront if empty). */
export function myShopLink(sku?: string, utm?: Record<string, string | number>) {
  const key = String(sku ?? "").trim();
  const u = new URL(MYSHOP_BASE);
  if (key.length === 0) {
    // storefront
    return withUtm(u.toString(), utm);
  }
  // Locale-safe search page
  u.pathname = `${u.pathname.replace(/\/+$/, "")}/search`;
  u.searchParams.set("text", key);
  return withUtm(u.toString(), utm);
}

/** A clean way to link the storefront with UTM tags. */
export function storefrontLink(utm?: Record<string, string | number>) {
  return withUtm(MYSHOP_BASE, utm);
}

/** Normalize incoming items (defensive: trims SKU, coerces qty >= 1). */
export function normalizeCartItems(items: Array<Partial<CartItem>> = []) {
  return items
    .map(({ sku, qty }) => ({
      sku: String(sku ?? "").trim(),
      qty: Number(qty ?? 1) || 1,
    }))
    .filter((it) => it.sku.length > 0);
}

/**
 * Build a cart link for multiple items.
 * Strategies:
 *  - "pairs"   -> /cart?sku=A&qty=1&sku=B&qty=2
 *  - "items"   -> /cart?sku=A&sku=B&qty=1&qty=2
 *  - "indexed" -> /cart?sku[0]=A&qty[0]=1&sku[1]=B&qty[1]=2
 * Fallback: ?add=A:1,B:2 on the base URL in case cart route changes.
 */
export function buildCartLink(
  items: Array<CartItem | Partial<CartItem>>,
  utm?: Record<string, string | number>
) {
  const safe = normalizeCartItems(items);

  // If no items, send to storefront
  if (safe.length === 0) return storefrontLink(utm);

  const cart = new URL(MYSHOP_BASE);
  cart.pathname = `${cart.pathname.replace(/\/+$/, "")}/cart`;

  if (CART_STRATEGY === "items") {
    for (const it of safe) {
      cart.searchParams.append("sku", it.sku);
      cart.searchParams.append("qty", String(it.qty));
    }
    return withUtm(cart.toString(), utm);
  }

  if (CART_STRATEGY === "indexed") {
    safe.forEach((it, i) => {
      cart.searchParams.append(`sku[${i}]`, it.sku);
      cart.searchParams.append(`qty[${i}]`, String(it.qty));
    });
    return withUtm(cart.toString(), utm);
  }

  // default: pairs
  for (const it of safe) {
    cart.searchParams.append("sku", it.sku);
    cart.searchParams.append("qty", String(it.qty));
  }
  return withUtm(cart.toString(), utm);
}
