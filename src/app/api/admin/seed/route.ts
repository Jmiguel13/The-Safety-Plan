import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type SeedResult = {
  products: unknown[];
  kits: unknown[];
  kit_items: unknown[];
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ------------ Auth (Basic) ------------ */
function unauthorized(message = "Unauthorized") {
  return NextResponse.json(
    { ok: false, error: message },
    { status: 401, headers: { "WWW-Authenticate": 'Basic realm="admin"' } }
  );
}
function b64decode(input: string): string {
  if (typeof globalThis.atob === "function") return globalThis.atob(input);
  return Buffer.from(input, "base64").toString("utf8");
}
function requireBasicAuth(req: Request) {
  const hdr = req.headers.get("authorization") ?? "";
  if (!hdr.startsWith("Basic ")) return null;
  const decoded = b64decode(hdr.slice(6));
  const [user, pass] = decoded.split(":");
  const ENV_USER = process.env.ADMIN_BASIC_USER ?? process.env.ADMIN_USER;
  const ENV_PASS = process.env.ADMIN_BASIC_PASS ?? process.env.ADMIN_PASS;
  if (!ENV_USER || !ENV_PASS) return null;
  if (user === ENV_USER && pass === ENV_PASS) return { user };
  return null;
}

/* ------------ Supabase (service role) ------------ */
function getAdminSb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error("Missing Supabase envs");
  return createClient(url, key, { auth: { persistSession: false } });
}

/* ------------ Seed Data (clean strings) ------------ */
/** Keep product columns minimal to avoid schema mismatches.
 *  If your table has more fields (buy_url, note, weight_oz, etc.),
 *  you can add them later.
 */
const SAMPLE_PRODUCTS = [
  { sku: "SKU-XS-ENERGY-12CT", title: "XS Energy Drink (Case of 12)" },
  { sku: "SKU-VITAMIN-D3", title: "Vitamin D3" },
  { sku: "SKU-OMEGA3", title: "Omega-3 Softgels" },
  { sku: "SKU-ELECTROLYTES", title: "Hydration Electrolytes" },
  { sku: "SKU-SLEEP-AID", title: "Sleep Support" },
] as const;

const RESILIENT_KIT = {
  slug: "resilient",
  title: "Resilient Kit",
  description:
    "A mission-ready wellness kit curated for frontline fighters. Built to support focus, hydration, recovery, and rest.",
  is_published: true, // DB column should be 'is_published'
} as const;

const RESILIENT_ITEMS = [
  { product_sku: "SKU-XS-ENERGY-12CT", qty: 1, sort_order: 1 },
  { product_sku: "SKU-ELECTROLYTES",   qty: 1, sort_order: 2 },
  { product_sku: "SKU-OMEGA3",         qty: 1, sort_order: 3 },
  { product_sku: "SKU-VITAMIN-D3",     qty: 1, sort_order: 4 },
  { product_sku: "SKU-SLEEP-AID",      qty: 1, sort_order: 5 },
] as const;

export async function POST(req: Request) {
  const auth = requireBasicAuth(req);
  if (!auth) return unauthorized();

  const sb = getAdminSb();
  const results: SeedResult = { products: [], kits: [], kit_items: [] };

  // 1) Upsert products (idempotent on sku)
  {
    const { data, error } = await sb
      .from("products")
      .upsert(
        SAMPLE_PRODUCTS.map((p) => ({
          sku: p.sku,
          title: p.title,
          // Add optional columns here if they exist in your schema:
          // buy_url: null,
          // note: null,
          // weight_oz: null,
        })),
        { onConflict: "sku" }
      )
      .select();
    if (error) return NextResponse.json({ ok: false, step: "products", error }, { status: 500 });
    results.products = data ?? [];
  }

  // 2) Resolve product IDs for kit items
  const { data: productRows, error: prodErr } = await sb
    .from("products")
    .select("id, sku")
    .in(
      "sku",
      SAMPLE_PRODUCTS.map((p) => p.sku)
    );
  if (prodErr) {
    return NextResponse.json({ ok: false, step: "products-select", error: prodErr }, { status: 500 });
  }
  const skuToId = new Map<string, string>();
  (productRows ?? []).forEach((r) => skuToId.set(r.sku, r.id));

  // 3) Upsert the kit (idempotent on slug)
  const { data: kitRows, error: kitErr } = await sb
    .from("kits")
    .upsert(
      {
        slug: RESILIENT_KIT.slug,
        title: RESILIENT_KIT.title,
        description: RESILIENT_KIT.description,
        is_published: RESILIENT_KIT.is_published,
      },
      { onConflict: "slug" }
    )
    .select();
  if (kitErr) return NextResponse.json({ ok: false, step: "kits", error: kitErr }, { status: 500 });

  const kitId = kitRows?.[0]?.id as string | undefined;
  if (!kitId) {
    return NextResponse.json({ ok: false, step: "kits", error: "Missing kit id after upsert" }, { status: 500 });
  }
  results.kits = kitRows ?? [];

  // 4) Upsert kit_items (composite unique: kit_id + product_id); column 'qty' (not 'quantity')
  const toUpsert = RESILIENT_ITEMS.map((it) => {
    const product_id = skuToId.get(it.product_sku);
    if (!product_id) return null;
    return { kit_id: kitId, product_id, qty: it.qty, sort_order: it.sort_order };
  }).filter(Boolean) as Array<{ kit_id: string; product_id: string; qty: number; sort_order: number }>;

  if (toUpsert.length) {
    const { data, error } = await sb
      .from("kit_items")
      .upsert(toUpsert, { onConflict: "kit_id,product_id" })
      .select();
    if (error) return NextResponse.json({ ok: false, step: "kit_items", error }, { status: 500 });
    results.kit_items = data ?? [];
  }

  return NextResponse.json({ ok: true, ...results }, { status: 200 });
}
