// src/app/api/admin/kits/[id]/items/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/server/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BodyPost = { product_id: string; quantity?: number };

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from("kit_items")
    .select("product_id, quantity, sort_order, products:product_id (id, title, brand, amway_sku)")
    .eq("kit_id", params.id)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, items: data ?? [] });
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const sb = supabaseServer();
  const body = (await req.json()) as BodyPost;
  const qty = Math.max(1, Number(body.quantity ?? 1));

  // compute next sort_order = max+10
  const { data: maxRows } = await sb
    .from("kit_items")
    .select("sort_order")
    .eq("kit_id", params.id)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = ((maxRows?.[0]?.sort_order as number | null) ?? 0) + 10;

  // upsert so repeated add bumps quantity
  const { error } = await sb.from("kit_items").upsert(
    {
      kit_id: params.id,
      product_id: body.product_id,
      quantity: qty,
      sort_order: nextOrder,
    },
    { onConflict: "kit_id,product_id" }
  );

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
