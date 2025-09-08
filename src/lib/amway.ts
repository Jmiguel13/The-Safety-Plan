// src/lib/amway.ts
/**
 * Amway / MyShop helpers
 * - Always deep-link through *your* MyShop so sales credit you.
 */

export const MYSHOP_BASE =
  process.env.NEXT_PUBLIC_AMWAY_MYSHOP_URL?.replace(/\/+$/, "") ||
  "https://www.amway.com/myshop/TheSafetyPlan";

/**
 * PDP/search deep link for a single SKU that credits your shop.
 * Works across most categories and forwards to PDP/cart via Amway.
 */
export function myShopLink(sku: string) {
  // Simple and reliable pattern: itemNumber query
  return `${MYSHOP_BASE}?itemNumber=${encodeURIComponent(sku)}`;
}

/**
 * Multi-item cart link:
 * e.g., buildCartLink([{ sku: "127070", qty: 1 }, { sku: "110601", qty: 2 }])
 */
export function buildCartLink(
  items: Array<{ sku: string; qty?: number }>
): string {
  const qs = items
    .map(
      (i) =>
        `itemNumber=${encodeURIComponent(i.sku)}&quantity=${
          i.qty && i.qty > 0 ? i.qty : 1
        }`
    )
    .join("&");
  return `${MYSHOP_BASE}/cart?${qs}`;
}

/** Optional: canonical Amway URL passthrough for reference/debug */
export function canonicalAmwayUrl(path: string) {
  const clean = path.startsWith("http") ? path : `https://www.amway.com${path}`;
  return clean;
}
