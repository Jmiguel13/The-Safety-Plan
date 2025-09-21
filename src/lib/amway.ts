/**
 * Amway / MyShop helpers
 * - Safe to import on client
 * - Always injects UTM params unless already present
 * - Reads UTM defaults from env (falls back to sensible defaults)
 */

export type CartItem = { sku: string; qty?: number };

const PUBLIC_BASE = (process.env.NEXT_PUBLIC_AMWAY_MYSHOP_URL || "").trim();

// UTM defaults (public so components can show them if needed)
export const DEFAULT_UTM_SOURCE =
  (process.env.NEXT_PUBLIC_UTM_SOURCE || "").trim() || "safety-plan";
export const DEFAULT_UTM_MEDIUM =
  (process.env.NEXT_PUBLIC_UTM_MEDIUM || "").trim() || "web";
export const DEFAULT_UTM_CAMPAIGN = "site";

/** Returns a valid absolute MyShop URL or empty string if misconfigured. */
function baseUrl(): string {
  try {
    if (!PUBLIC_BASE) return "";
    const u = new URL(PUBLIC_BASE);
    // Normalize to no trailing slash
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

  // Absolute URL already?
  try {
    const abs = new URL(pathOrUrl);
    return abs;
  } catch {
    /* fall through to join with base */
  }

  try {
    const rootURL = new URL(root);
    // Ensure exactly one slash between base and path
    const cleanBasePath = rootURL.pathname.replace(/\/+$/, "");
    const cleanPath = String(pathOrUrl || "").replace(/^\/+/, "");
    rootURL.pathname = cleanPath ? `${cleanBasePath}/${cleanPath}` : cleanBasePath;
    return rootURL;
  } catch {
    return null;
  }
}

/** Add/merge UTM parameters; preserves any pre-existing utm_* params. */
function addUtm(u: URL, extra?: Record<string, string | number | undefined>) {
  if (!u.searchParams.get("utm_source")) u.searchParams.set("utm_source", DEFAULT_UTM_SOURCE);
  if (!u.searchParams.get("utm_medium")) u.searchParams.set("utm_medium", DEFAULT_UTM_MEDIUM);
  if (!u.searchParams.get("utm_campaign")) u.searchParams.set("utm_campaign", DEFAULT_UTM_CAMPAIGN);

  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v == null) continue;
      if (k.toLowerCase().startsWith("utm_")) {
        u.searchParams.set(k, String(v));
      }
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

/** Convenience alias: always root with UTM */
export function myShopLink(path: string = "/", utm?: Record<string, string | number>): string {
  return storefrontLink(path, utm);
}

/**
 * Product PDP link by SKU.
 * Uses a conservative query format that works across many MyShop markets:
 *   /product/detail?itemNumber=SKU
 */
export function productLink(sku: string, utm?: Record<string, string | number>): string {
  const normalized = String(sku || "").trim();
  const u = toMyShopUrl("/product/detail");
  if (!u) return "/";
  if (normalized) u.searchParams.set("itemNumber", normalized);
  addUtm(u, { ...(utm || {}), utm_campaign: (utm?.utm_campaign as string) || "pdp" });
  return u.toString();
}

/**
 * Attempt to build a cart-add link for a list of items.
 *   /cart?itemNumber=SKU&quantity=QTY  (repeated for each item)
 * Falls back to storefront root if base is missing or list is empty.
 */
export function buildCartLink(items: CartItem[], utm?: Record<string, string | number>): string {
  const u = toMyShopUrl("/cart");
  if (!u) return myShopLink("/", utm);

  const safe = (items || [])
    .map(({ sku, qty }) => ({
      sku: String(sku || "").trim(),
      qty: Math.max(1, Number.isFinite(Number(qty)) ? Number(qty) : 1),
    }))
    .filter((i) => i.sku.length > 0);

  if (safe.length === 0) return myShopLink("/", utm);

  for (const it of safe) {
    u.searchParams.append("itemNumber", it.sku);
    u.searchParams.append("quantity", String(it.qty));
  }

  addUtm(u, { ...(utm || {}), utm_campaign: (utm?.utm_campaign as string) || "kit-cart" });
  return u.toString();
}
