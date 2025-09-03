// src/app/api/admin/kits/[id]/items/[product_id]/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/server/supabase"; // ← use alias

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PatchBody = { quantity?: number; sort_order?: number };

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; product_id: string } }
) {
  const sb = supabaseServer();
  const patch = (await req.json().catch(() => ({} as PatchBody))) as PatchBody;

  const update: Record<string, unknown> = {};
  if (typeof patch.quantity === "number")
    update.quantity = Math.max(1, Math.floor(patch.quantity));
  if (typeof patch.sort_order === "number")
    update.sort_order = Math.floor(patch.sort_order);

  // Nothing to update
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: true, item: null });
  }

  const { data, error } = await sb
    .from("kit_items")
    .update(update)
    .eq("kit_id", params.id)
    .eq("product_id", params.product_id)
    .select(
      "product_id, quantity, sort_order, products:product_id (id, title, brand, amway_sku)"
    )
    .single(); // exactly one row by (kit_id, product_id) PK

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, item: data ?? null });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; product_id: string } }
) {
  const sb = supabaseServer();
  const { error } = await sb
    .from("kit_items")
    .delete()
    .eq("kit_id", params.id)
    .eq("product_id", params.product_id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
