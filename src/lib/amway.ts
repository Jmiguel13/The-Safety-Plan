// src/lib/amway.ts
/**
 * Amway / MyShop helpers
 * - Always deep-link through *your* MyShop so sales credit you.
 * - Multi-add cart links differ between MyShop variants. Choose via
 *   NEXT_PUBLIC_AMWAY_CART_STRATEGY: "pairs" | "indexed" | "items" (default: "pairs")
 */

export type CartItem = { sku: string; qty?: number };
export type Strategy = "pairs" | "indexed" | "items";

const RAW_BASE =
  process.env.NEXT_PUBLIC_MYSHOP_BASE ||
  process.env.NEXT_PUBLIC_AMWAY_MYSHOP_URL ||
  "https://www.amway.com/myshop/TheSafetyPlan";

export const MYSHOP_BASE = RAW_BASE.replace(/\/+$/, "");

const STRATEGY: Strategy =
  (process.env.NEXT_PUBLIC_AMWAY_CART_STRATEGY as Strategy) || "pairs";

/** Append default UTM params if not already present */
function withUtm(url: string) {
  try {
    const u = new URL(url);
    const src = process.env.NEXT_PUBLIC_UTM_SOURCE || "safety-plan";
    const med = process.env.NEXT_PUBLIC_UTM_MEDIUM || "web";
    if (!u.searchParams.has("utm_source")) u.searchParams.set("utm_source", src);
    if (!u.searchParams.has("utm_medium")) u.searchParams.set("utm_medium", med);
    return u.toString();
  } catch {
    return url;
  }
}

/** PDP/search deep link for a single SKU that credits your shop. */
export function myShopLink(skuOrPath: string) {
  if (!skuOrPath) return withUtm(MYSHOP_BASE);
  // Allow explicit MyShop paths like "/p/some-product"
  if (skuOrPath.startsWith("/")) return withUtm(`${MYSHOP_BASE}${skuOrPath}`);
  // Reliable PDP/search pattern
  const sku = normalizeSku(skuOrPath);
  return withUtm(`${MYSHOP_BASE}?itemNumber=${encodeURIComponent(sku)}`);
}

/**
 * Multi-item cart link.
 * Note: some MyShop regions don’t accept programmatic cart adds consistently.
 * If you still see “0 items”, consider linking storefront instead of cart.
 */
export function buildCartLink(items: CartItem[]): string {
  const norm = normalizeItems(items);
  if (norm.length === 0) return withUtm(MYSHOP_BASE);

  switch (STRATEGY) {
    case "indexed":
      // /cart?itemNumber1=SKU&quantity1=Q&itemNumber2=SKU2&quantity2=Q2
      return withUtm(
        `${MYSHOP_BASE}/cart?` +
          norm
            .map(
              (it, i) =>
                `itemNumber${i + 1}=${encodeURIComponent(it.sku)}&quantity${
                  i + 1
                }=${it.qty}`
            )
            .join("&")
      );

    case "items":
      // /cart?items=SKU:Q,SKU2:Q2
      return withUtm(
        `${MYSHOP_BASE}/cart?items=${encodeURIComponent(
          norm.map((it) => `${it.sku}:${it.qty}`).join(",")
        )}`
      );

    case "pairs":
    default:
      // /cart?itemNumber=SKU&quantity=Q&itemNumber=SKU2&quantity=Q2
      return withUtm(
        `${MYSHOP_BASE}/cart?` +
          norm
            .map(
              (it) =>
                `itemNumber=${encodeURIComponent(it.sku)}&quantity=${it.qty}`
            )
            .join("&")
      );
  }
}

/** Canonical Amway URL passthrough for reference/debug */
export function canonicalAmwayUrl(path: string) {
  const clean = path.startsWith("http") ? path : `https://www.amway.com${path}`;
  return clean;
}

/* ----------------- internal helpers ----------------- */

function normalizeSku(s: string) {
  return String(s || "").trim();
}

function normalizeItems(items: CartItem[]) {
  return (Array.isArray(items) ? items : [])
    .map(({ sku, qty }) => ({
      sku: normalizeSku(sku),
      qty: qty && qty > 0 ? Math.floor(qty) : 1,
    }))
    .filter((i) => i.sku.length > 0);
}

