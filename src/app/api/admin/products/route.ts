// src/app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/server/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from("products")
    .select("id, title, brand, amway_sku")
    .order("title", { ascending: true });

  if (error) return NextResponse.json({ products: [] });
  return NextResponse.json({ products: data ?? [] });
}

