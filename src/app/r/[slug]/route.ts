// src/app/r/[slug]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { kits } from "@/lib/kits";
import { myShopLink } from "@/lib/amway"; // (path?: string, campaign?: string)

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---- DB row types ----
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

// ---- helpers ----
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

/** Code-side kits → MyShop storefront with campaign (no cart injection). */
function resolveKitStorefront(slug: string): string | null {
  const kit = kits.find((k) => k.slug === slug);
  if (!kit) return null;
  return myShopLink("/", `kit-${slug}`); // root never 404s
}

async function resolveFromDb(
  sb: SupabaseClient,
  slug: string
): Promise<{ kitId: string | null; url: string | null; isPublished: boolean }> {
  const kitRes = await sb
    .from("kits")
    .select("id, slug, buy_url, is_published")
    .eq("slug", slug)
    .limit(1);

  const k = (kitRes.data?.[0] as KitRow | undefined) ?? null;
  if (!k || !k.is_published) return { kitId: null, url: null, isPublished: false };

  if (k.buy_url) return { kitId: k.id, url: k.buy_url, isPublished: true };

  const itemsRes = await sb
    .from("kit_items")
    .select("sort_order, products:product_id (id, amway_url, is_published)")
    .eq("kit_id", k.id)
    .order("sort_order", { ascending: true });

  const list = (itemsRes.data as ItemRow[] | null) ?? [];
  const firstWithUrl = list.map((i) => i.products).find((p) => p?.is_published && p?.amway_url);
  return { kitId: k.id, url: firstWithUrl?.amway_url ?? null, isPublished: true };
}

// ---- handler ----
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { ok: false, error: "Server is not configured (Supabase env missing)." },
      { status: 500 }
    );
  }

  const sb = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "safety-plan-site" } },
  });

  const slug = params.slug;
  const url = new URL(req.url);
  const dryRun = url.searchParams.get("dry") === "1";

  // A) Try code-side kit → storefront
  let destination = resolveKitStorefront(slug);

  // B) If not available, resolve from DB
  let resolvedDb = { kitId: null as string | null, url: null as string | null, isPublished: false };
  if (!destination) {
    resolvedDb = await resolveFromDb(sb, slug);
    destination = resolvedDb.url || null;
  }

  // C) Final fallback: storefront root + campaign
  if (!destination) destination = myShopLink("/", `fallback-${slug}`);

  // D) Merge UTM if external, else internal fallback
  const internalFallback = new URL(`/kits/${slug}`, url.origin).toString();
  if (isHttpUrl(destination)) {
    destination = withUTM(destination, slug, url.searchParams);
  } else {
    destination = internalFallback;
  }

  // Fire-and-forget log
  const utm = pickUtm(url.searchParams);
  const path_from = req.headers.get("referer") || `/r/${slug}`;
  const ip = clientIp(req);
  const user_agent = req.headers.get("user-agent");
  const kitId = resolvedDb.kitId ?? null;

  void (async () => {
    try {
      await sb.from("outbound_clicks").insert({
        target_url: destination.slice(0, 2048),
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

  if (dryRun) {
    return NextResponse.json({
      ok: true,
      slug,
      isPublished: destination !== internalFallback ? true : resolvedDb.isPublished ?? false,
      destination,
      fallbackUsed: destination === internalFallback,
      source: kitId ? "db" : "code",
    });
  }

  return NextResponse.redirect(destination, { status: 302 });
}
