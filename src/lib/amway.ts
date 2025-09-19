// src/lib/amway.ts
/**
 * Amway / MyShop helpers
 * - Always deep-link through *your* MyShop so sales credit you.
 * - Multi-add cart links differ between MyShop variants.
 *   Choose via NEXT_PUBLIC_AMWAY_CART_STRATEGY: "pairs" | "indexed" | "items" (default: "pairs")
 */

export type CartItem = { sku: string; qty?: number };
export type Strategy = "pairs" | "indexed" | "items";

/** Base MyShop URL (no trailing slash). */
const RAW_BASE =
  process.env.NEXT_PUBLIC_MYSHOP_BASE ||
  process.env.NEXT_PUBLIC_AMWAY_MYSHOP_URL ||
  "https://www.amway.com/myshop/TheSafetyPlan";

export const MYSHOP_BASE = RAW_BASE.replace(/\/+$/, "");

/** Active cart strategy (validates env & falls back to "pairs"). */
function readStrategy(): Strategy {
  const v = (process.env.NEXT_PUBLIC_AMWAY_CART_STRATEGY || "pairs").toLowerCase();
  return (["pairs", "indexed", "items"] as const).includes(v as Strategy)
    ? (v as Strategy)
    : "pairs";
}
export const STRATEGY: Strategy = readStrategy();

/** Append default UTM params if not already present. */
function withUtm(input: string | URL): string {
  const url = toURL(input);
  const src = process.env.NEXT_PUBLIC_UTM_SOURCE || "safety-plan";
  const med = process.env.NEXT_PUBLIC_UTM_MEDIUM || "web";
  const camp = process.env.NEXT_PUBLIC_UTM_CAMPAIGN;
  const cont = process.env.NEXT_PUBLIC_UTM_CONTENT;
  const term = process.env.NEXT_PUBLIC_UTM_TERM;

  if (!url.searchParams.has("utm_source")) url.searchParams.set("utm_source", src);
  if (!url.searchParams.has("utm_medium")) url.searchParams.set("utm_medium", med);
  if (camp && !url.searchParams.has("utm_campaign")) url.searchParams.set("utm_campaign", camp);
  if (cont && !url.searchParams.has("utm_content")) url.searchParams.set("utm_content", cont);
  if (term && !url.searchParams.has("utm_term")) url.searchParams.set("utm_term", term);

  return url.toString();
}

/** PDP/search deep link for a single SKU (or passthrough for paths/URLs) that credits your shop. */
export function myShopLink(skuOrPath?: string): string {
  if (!skuOrPath || skuOrPath === "/") return withUtm(MYSHOP_BASE);

  // Absolute URL? keep host, just add UTM if missing
  if (/^https?:\/\//i.test(skuOrPath)) return withUtm(skuOrPath);

  // Explicit MyShop subpath like "/p/some-product"
  if (skuOrPath.startsWith("/")) return withUtm(join(MYSHOP_BASE, skuOrPath));

  // Otherwise treat as SKU -> ?itemNumber=
  const sku = normalizeSku(skuOrPath);
  const url = toURL(MYSHOP_BASE);
  url.searchParams.set("itemNumber", sku);
  return withUtm(url);
}

/**
 * Multi-item cart link.
 * Note: some MyShop regions don’t accept programmatic cart adds consistently.
 * If you still see “0 items”, consider linking storefront instead of cart.
 */
export function buildCartLink(items: CartItem[], strategyOverride?: Strategy): string {
  const strategy = strategyOverride ?? STRATEGY;
  const norm = normalizeItems(items);
  if (norm.length === 0) return withUtm(MYSHOP_BASE);

  const url = toURL(join(MYSHOP_BASE, "/cart"));

  switch (strategy) {
    case "indexed": {
      // /cart?itemNumber1=SKU&quantity1=Q&itemNumber2=SKU2&quantity2=Q2
      norm.forEach((it, i) => {
        const n = String(i + 1);
        url.searchParams.set(`itemNumber${n}`, it.sku);
        url.searchParams.set(`quantity${n}`, String(it.qty));
      });
      return withUtm(url);
    }

    case "items": {
      // /cart?items=SKU:Q,SKU2:Q2
      const payload = norm.map((it) => `${it.sku}:${it.qty}`).join(",");
      url.searchParams.set("items", payload);
      return withUtm(url);
    }

    case "pairs":
    default: {
      // /cart?itemNumber=SKU&quantity=Q&itemNumber=SKU2&quantity=Q2
      norm.forEach((it) => {
        url.searchParams.append("itemNumber", it.sku);
        url.searchParams.append("quantity", String(it.qty));
      });
      return withUtm(url);
    }
  }
}

/** Canonical Amway URL passthrough for reference/debug (ensures a full https URL). */
export function canonicalAmwayUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `https://www.amway.com${path.startsWith("/") ? "" : "/"}${path}`;
}

/* ----------------- internal helpers ----------------- */

function toURL(input: string | URL): URL {
  try {
    return input instanceof URL ? input : new URL(input);
  } catch {
    // If input is relative, join to base
    return new URL(join(MYSHOP_BASE, typeof input === "string" ? input : "/"));
  }
}

function join(base: string, path: string): string {
  const left = base.replace(/\/+$/, "");
  const right = path.replace(/^\/+/, "");
  return `${left}/${right}`;
}

function normalizeSku(s: string): string {
  return String(s || "").trim();
}

function normalizeItems(items: CartItem[]) {
  // Deduplicate by SKU and sum quantities (keeps first-seen order)
  const map = new Map<string, number>();
  const order: string[] = [];
  (Array.isArray(items) ? items : []).forEach(({ sku, qty }) => {
    const id = normalizeSku(sku);
    if (!id) return;
    const q = qty && qty > 0 ? Math.floor(qty) : 1;
    if (!map.has(id)) order.push(id);
    map.set(id, (map.get(id) || 0) + q);
  });
  return order.map((id) => ({ sku: id, qty: map.get(id)! }));
}
