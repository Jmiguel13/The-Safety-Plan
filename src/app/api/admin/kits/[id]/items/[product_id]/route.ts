// src/app/api/admin/kits/[id]/items/[product_id]/route.ts
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs"; // admin ops require server runtime

/** Extracts /api/admin/kits/:id/items/:product_id from the URL */
function extractParams(pathname: string): { id: string; product_id: string } | null {
  const parts = pathname.split("/").filter(Boolean);
  // .../api/admin/kits/:id/items/:product_id
  const itemsIdx = parts.lastIndexOf("items");
  if (itemsIdx <= 0 || itemsIdx + 1 >= parts.length) return null;

  const product_id = decodeURIComponent(parts[itemsIdx + 1] || "");
  const id = decodeURIComponent(parts[itemsIdx - 1] || "");
  if (!id || !product_id) return null;
  return { id, product_id };
}

/** DELETE: remove an item from kit_items */
export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const params = extractParams(url.pathname);
  if (!params) {
    return Response.json({ ok: false, error: "Bad route: missing id/product_id" }, { status: 400 });
  }

  const { id: kit_id, product_id } = params;
  const sb = createSupabaseAdmin();

  const { error } = await sb.from("kit_items").delete().match({ kit_id, product_id });
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

  // Optional: compact sort_order after deletion
  const { data: remaining, error: listErr } = await sb
    .from("kit_items")
    .select("id")
    .eq("kit_id", kit_id)
    .order("sort_order", { ascending: true });

  if (!listErr && Array.isArray(remaining)) {
    let order = 1;
    for (const row of remaining) {
      await sb.from("kit_items").update({ sort_order: order }).eq("id", row.id);
      order++;
    }
  }

  return Response.json({ ok: true, deleted: { kit_id, product_id } }, { status: 200 });
}

/** PATCH: update qty, sort_order, or note */
type PatchBody = {
  qty?: number;
  sort_order?: number;
  note?: string | null;
};

export async function PATCH(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const params = extractParams(url.pathname);
  if (!params) {
    return Response.json({ ok: false, error: "Bad route: missing id/product_id" }, { status: 400 });
  }

  const { id: kit_id, product_id } = params;

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (typeof body.qty === "number" && Number.isFinite(body.qty) && body.qty > 0) {
    update.qty = Math.floor(body.qty);
  }
  if (typeof body.sort_order === "number" && Number.isFinite(body.sort_order) && body.sort_order > 0) {
    update.sort_order = Math.floor(body.sort_order);
  }
  if (body.note === null || typeof body.note === "string") {
    update.note = body.note;
  }

  if (Object.keys(update).length === 0) {
    return Response.json({ ok: false, error: "Nothing to update." }, { status: 400 });
  }

  const sb = createSupabaseAdmin();
  const { data, error } = await sb
    .from("kit_items")
    .update(update)
    .match({ kit_id, product_id })
    .select("*")
    .single();

  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

  return Response.json({ ok: true, item: data }, { status: 200 });
}

/** GET detail (sanity) */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const params = extractParams(url.pathname);
  if (!params) {
    return Response.json({ ok: false, error: "Bad route: missing id/product_id" }, { status: 400 });
  }

  const { id: kit_id, product_id } = params;
  const sb = createSupabaseAdmin();
  const { data, error } = await sb
    .from("kit_items")
    .select("id, kit_id, product_id, qty, sort_order, note")
    .match({ kit_id, product_id })
    .maybeSingle();

  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  return Response.json({ ok: true, item: data ?? null }, { status: 200 });
}

