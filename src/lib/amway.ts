// src/lib/amway.ts
/**
 * Amway / MyShop helpers
 * - Safe to import on client
 * - Always injects UTM params unless already present
 */

export type CartItem = { sku: string; qty?: number };

const PUBLIC_BASE = (process.env.NEXT_PUBLIC_AMWAY_MYSHOP_URL || "").trim();

/** Returns a valid absolute MyShop URL or empty string if misconfigured. */
function baseUrl(): string {
  try {
    if (!PUBLIC_BASE) return "";
    const u = new URL(PUBLIC_BASE);
    return u.toString().replace(/\/+$/, "");
  } catch {
    return "";
  }
}

/** Exported for display/debug (not guaranteed non-empty). */
export const MYSHOP_BASE: string = baseUrl();

/** Normalize any relative path to a full URL rooted at MyShop base. */
function toMyShopUrl(pathOrUrl: string): URL | null {
  const root = baseUrl();
  if (!root) return null;
  try {
    // absolute URL already?
    return new URL(pathOrUrl);
  } catch {
    try {
      const u = new URL(root);
      const path = `${u.pathname.replace(/\/+$/, "")}/${String(pathOrUrl || "").replace(/^\/+/, "")}`;
      u.pathname = path;
      return u;
    } catch {
      return null;
    }
  }
}

/** Add/merge UTM parameters; preserves any pre-existing utm_* params. */
function addUtm(u: URL, extra?: Record<string, string | number | undefined>) {
  if (!u.searchParams.get("utm_source")) u.searchParams.set("utm_source", "safety-plan");
  if (!u.searchParams.get("utm_medium")) u.searchParams.set("utm_medium", "web");
  if (!u.searchParams.get("utm_campaign")) u.searchParams.set("utm_campaign", "site");
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v == null) continue;
      if (k.toLowerCase().startsWith("utm_")) u.searchParams.set(k, String(v));
    }
  }
}

/**
 * Generic storefront link builder.
 * Accepts either a relative path (e.g. "/") or absolute URL.
 */
export function storefrontLink(
  pathOrUrl: string = "/",
  utm?: Record<string, string | number>
): string {
  const u = toMyShopUrl(pathOrUrl);
  if (!u) return "/";
  addUtm(u, utm);
  return u.toString();
}

/** Convenience: always root with UTM */
export function myShopLink(path: string = "/", utm?: Record<string, string | number>): string {
  return storefrontLink(path, utm);
}

/**
 * Product PDP link by SKU.
 * Uses a conservative query format that works across many MyShop markets:
 *   /product/detail?itemNumber=SKU
 */
export function productLink(sku: string, utm?: Record<string, string | number>): string {
  const u = toMyShopUrl("/product/detail");
  if (!u) return "/";
  u.searchParams.set("itemNumber", String(sku));
  addUtm(u, { ...(utm || {}), utm_campaign: (utm?.utm_campaign as string) || "pdp" });
  return u.toString();
}

/**
 * Attempt to build a cart-add link for a list of items.
 *   /cart?itemNumber=SKU&quantity=QTY  (repeated for each item)
 * Falls back to storefront root if base is missing.
 */
export function buildCartLink(items: CartItem[], utm?: Record<string, string | number>): string {
  const u = toMyShopUrl("/cart");
  if (!u) return myShopLink("/", utm);

  const safe = (items || [])
    .map(({ sku, qty }) => ({ sku: String(sku || "").trim(), qty: Math.max(1, Number(qty ?? 1)) }))
    .filter((i) => i.sku.length > 0);

  if (safe.length === 0) return myShopLink("/", utm);

  for (const it of safe) {
    u.searchParams.append("itemNumber", it.sku);
    u.searchParams.append("quantity", String(it.qty));
  }

  addUtm(u, { ...(utm || {}), utm_campaign: (utm?.utm_campaign as string) || "kit-cart" });
  return u.toString();
}
