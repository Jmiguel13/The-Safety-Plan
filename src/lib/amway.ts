// src/lib/amway.ts
/**
 * Amway / MyShop helpers
 * - Always deep-link through *your* MyShop so sales credit you.
 * - Multi-add cart links differ between MyShop variants. We support multiple
 *   strategies and let you switch via NEXT_PUBLIC_AMWAY_CART_STRATEGY.
 *
 * Supported strategies:
 *  - "pairs"   => /cart?itemNumber=SKU&quantity=Q&itemNumber=SKU2&quantity=Q2
 *  - "indexed" => /cart?itemNumber1=SKU&quantity1=Q&itemNumber2=SKU2&quantity2=Q2
 *  - "items"   => /cart?items=SKU:Q,SKU2:Q2
 *
 * Default: pairs
 */

export const MYSHOP_BASE =
  process.env.NEXT_PUBLIC_AMWAY_MYSHOP_URL?.replace(/\/+$/, "") ||
  "https://www.amway.com/myshop/TheSafetyPlan";

type CartItem = { sku: string; qty?: number };
type Strategy = "pairs" | "indexed" | "items";

const STRATEGY: Strategy =
  (process.env.NEXT_PUBLIC_AMWAY_CART_STRATEGY as Strategy) || "pairs";

/** PDP/search deep link for a single SKU that credits your shop. */
export function myShopLink(skuOrPath: string) {
  // Allow explicit paths like "/p/some-product"
  if (skuOrPath.startsWith("/")) return `${MYSHOP_BASE}${skuOrPath}`;
  // Simple & reliable PDP/search pattern:
  return `${MYSHOP_BASE}?itemNumber=${encodeURIComponent(normalizeSku(skuOrPath))}`;
}

/** Multi-item cart link (supports multiple formats; choose with STRATEGY). */
export function buildCartLink(items: CartItem[]): string {
  const norm = normalizeItems(items);

  switch (STRATEGY) {
    case "indexed":
      // /cart?itemNumber1=SKU&quantity1=Q&itemNumber2=SKU2&quantity2=Q2
      return `${MYSHOP_BASE}/cart?${norm
        .map(
          (it, i) =>
            `itemNumber${i + 1}=${encodeURIComponent(it.sku)}&quantity${i + 1}=${it.qty}`
        )
        .join("&")}`;

    case "items":
      // /cart?items=SKU:Q,SKU2:Q2
      return `${MYSHOP_BASE}/cart?items=${encodeURIComponent(
        norm.map((it) => `${it.sku}:${it.qty}`).join(",")
      )}`;

    case "pairs":
    default:
      // /cart?itemNumber=SKU&quantity=Q&itemNumber=SKU2&quantity=Q2
      return `${MYSHOP_BASE}/cart?${norm
        .map(
          (it) => `itemNumber=${encodeURIComponent(it.sku)}&quantity=${it.qty}`
        )
        .join("&")}`;
  }
}

/** Optional: canonical Amway URL passthrough for reference/debug */
export function canonicalAmwayUrl(path: string) {
  const clean = path.startsWith("http") ? path : `https://www.amway.com${path}`;
  return clean;
}

/* ----------------- internal helpers ----------------- */

function normalizeSku(s: string) {
  return String(s).trim();
}

function normalizeItems(items: CartItem[]) {
  return items
    .map(({ sku, qty }) => ({
      sku: normalizeSku(sku),
      qty: qty && qty > 0 ? Math.floor(qty) : 1,
    }))
    .filter((i) => i.sku.length > 0);
}
