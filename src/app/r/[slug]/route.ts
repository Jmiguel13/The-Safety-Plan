// src/app/r/[slug]/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { kits } from "@/lib/kits";
import { myShopLink, buildCartLink } from "@/lib/amway";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** ---------- Local types ---------- */
type CodeKitItem = { sku: string; qty?: number };
type CodeKit = { slug: string; items?: CodeKitItem[]; skus?: string[] };

type KitRow = {
  id: string;
  slug: string | null;
  buy_url: string | null;
  is_published: boolean | null;
};

type ProductJoin = {
  id: string;
  amway_url: string | null;
  is_published: boolean | null;
};

type ItemRow = {
  sort_order: number | null;
  products: ProductJoin | null;
};

/** ---------- Helpers ---------- */
function clientIp(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for") || "";
  return (xff.split(",")[0] || "").trim() || null;
}
function isHttpUrl(u: string) {
  return /^https?:\/\//i.test(u);
}
function pickUtm(params: URLSearchParams) {
  const utm: Record<string, string> = {};
  for (const [k, v] of params.entries()) {
    if (k.toLowerCase().startsWith("utm_") && v) utm[k] = v;
  }
  return Object.keys(utm).length ? utm : null;
}
function withUTM(raw: string, slug: string, params: URLSearchParams) {
  try {
    const u = new URL(raw);
    if (!u.searchParams.get("utm_source")) u.searchParams.set("utm_source", "safety-plan");
    if (!u.searchParams.get("utm_medium")) u.searchParams.set("utm_medium", "web");
    if (!u.searchParams.get("utm_campaign")) u.searchParams.set("utm_campaign", `kit-${slug}`);
    for (const [k, v] of params.entries()) {
      if (k.toLowerCase().startsWith("utm_") && v) u.searchParams.set(k, v);
    }
    return u.toString();
  } catch {
    return raw;
  }
}

/** Normalize items from code-side kits */
function normalizeCodeKit(slug: string): Array<{ sku: string; qty: number }> {
  const list = kits as unknown as CodeKit[];
  const kit = list.find((k) => k.slug === slug);
  if (!kit) return [];
  if (Array.isArray(kit.items)) {
    return kit.items.map((it) => ({
      sku: String(it.sku),
      qty: Number(it.qty ?? 1),
    }));
  }
  if (Array.isArray(kit.skus)) {
    return kit.skus.map((s) => ({ sku: String(s), qty: 1 }));
  }
  return [];
}

/** Code-side kits → return either full cart URL or storefront root */
function resolveKitFromCode(slug: string, wantCart: boolean): string | null {
  const items = normalizeCodeKit(slug);
  if (wantCart && items.length > 0) {
    return buildCartLink(items);
  }
  // Storefront root; campaign will be injected by withUTM()
  return myShopLink("/");
}

async function resolveFromDb(
  sb: SupabaseClient,
  slug: string,
  wantCart: boolean
): Promise<{ kitId: string | null; url: string | null; isPublished: boolean }> {
  const kitRes = await sb
    .from("kits")
    .select("id, slug, buy_url, is_published")
    .eq("slug", slug)
    .limit(1);

  const k = (kitRes.data?.[0] as KitRow | undefined) ?? null;
  if (!k || !k.is_published) return { kitId: null, url: null, isPublished: false };

  // If an explicit buy_url exists, prefer it.
  if (k.buy_url) return { kitId: k.id, url: k.buy_url, isPublished: true };

  // Optionally build a cart link from items if we want a cart
  if (wantCart) {
    const itemsRes = await sb
      .from("kit_items")
      .select("sort_order, products:product_id (id, amway_url, is_published)")
      .eq("kit_id", k.id)
      .order("sort_order", { ascending: true });

    const rows = (itemsRes.data as ItemRow[] | null) ?? [];
    const items = rows
      .map((r) => r.products?.amway_url)
      .filter((url): url is string => Boolean(url))
      .map((url) => {
        try {
          // Attempt to pull itemNumber param or parse "-p-<SKU>"
          const u = new URL(url);
          const byParam = u.searchParams.get("itemNumber");
          if (byParam) return { sku: byParam, qty: 1 };
          const byPath = u.pathname.match(/-p-([A-Za-z0-9]+)/)?.[1];
          return byPath ? { sku: byPath, qty: 1 } : null;
        } catch {
          return null;
        }
      })
      .filter((x): x is { sku: string; qty: number } => Boolean(x));

    if (items.length > 0) {
      return { kitId: k.id, url: buildCartLink(items), isPublished: true };
    }
  }

  // Fallback: if DB doesn't yield cart, point to MyShop root (UTM later)
  return { kitId: k.id, url: myShopLink("/"), isPublished: true };
}

/** ---------- Handler ---------- */
type RouteCtx = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, ctx: RouteCtx) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;

  const url = new URL(req.url);
  const { slug } = await ctx.params;

  // Controls:
  //  - dry=1   → return JSON instead of redirect
  //  - cart=1  → force a cart link if possible (default true)
  //  - cart=0  → force storefront root (no cart)
  const dryRun = url.searchParams.get("dry") === "1";
  const cartParam = url.searchParams.get("cart");
  const wantCart = cartParam === "0" ? false : true;

  // A) Try code-side kit first (fast path)
  let destination = resolveKitFromCode(slug, wantCart);

  // B) If not resolved, and DB is configured, try DB
  let resolvedDb = { kitId: null as string | null, url: null as string | null, isPublished: false };
  if ((!destination || !isHttpUrl(destination)) && supabaseUrl && serviceKey) {
    const sb = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "x-application-name": "safety-plan-site" } },
    });

    resolvedDb = await resolveFromDb(sb, slug, wantCart);
    destination = resolvedDb.url || destination;
  }

  // C) Build internal fallback and ensure we always have a string
  const internalFallback = new URL(`/kits/${slug}`, url.origin).toString();
  let out = destination ?? myShopLink("/") ?? internalFallback;

  // D) If it's an external URL, inject UTM; if not, use internal fallback
  out = isHttpUrl(out) ? withUTM(out, slug, url.searchParams) : internalFallback;

  // Fire-and-forget logging (only if DB configured). Re-check to narrow types for TS.
  if (supabaseUrl && serviceKey) {
    const sb = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "x-application-name": "safety-plan-site" } },
    });

    const utm = pickUtm(url.searchParams);
    const path_from = req.headers.get("referer") || `/r/${slug}`;
    const ip = clientIp(req) ?? "";
    const user_agent = req.headers.get("user-agent") ?? "";
    const kitId = resolvedDb.kitId ?? null;

    void (async () => {
      try {
        await sb.from("outbound_clicks").insert({
          target_url: out.slice(0, 2048),
          kit_id: kitId,
          path_from,
          utm,
          ip,
          user_agent,
        });
      } catch {
        /* ignore */
      }
    })();
  }

  if (dryRun) {
    return NextResponse.json({
      ok: true,
      slug,
      destination: out,
      wantCart,
      source: resolvedDb.kitId ? "db" : "code",
      published: resolvedDb.kitId ? resolvedDb.isPublished : true,
      internalFallback: out === internalFallback,
    });
  }

  return NextResponse.redirect(out, { status: 302 });
}
