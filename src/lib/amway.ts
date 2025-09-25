// src/lib/amway.ts
export type CartItem = { sku: string; qty?: number };

const PUBLIC_BASE = (process.env.NEXT_PUBLIC_AMWAY_MYSHOP_URL || "").trim();

// UTM defaults
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
    const abs = new URL(pathOrUrl);
    return abs;
  } catch {
    /* join with base */
  }

  try {
    const rootURL = new URL(root);
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

/** Storefront link (root or relative path). */
export function storefrontLink(pathOrUrl: string = "/", utm?: Record<string, string | number>): string {
  const u = toMyShopUrl(pathOrUrl);
  if (!u) return "/";
  addUtm(u, utm);
  return u.toString();
}

/** Convenience alias. */
export function myShopLink(path: string = "/", utm?: Record<string, string | number>): string {
  return storefrontLink(path, utm);
}

/** Product PDP by SKU — conservative path that works widely: /product/detail?itemNumber=SKU */
export function productLink(sku: string, utm?: Record<string, string | number>): string {
  const normalized = String(sku || "").trim();
  const u = toMyShopUrl("/product/detail");
  if (!u) return "/";
  if (normalized) u.searchParams.set("itemNumber", normalized);
  addUtm(u, { ...(utm || {}), utm_campaign: (utm?.utm_campaign as string) || "pdp" });
  return u.toString();
}

/** Build a cart-add URL for multiple items (if supported market-side). */
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
