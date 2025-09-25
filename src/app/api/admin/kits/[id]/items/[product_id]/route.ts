// src/app/api/admin/kits/[id]/items/[product_id]/route.ts
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string; product_id: string } }
) {
  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json(
      {
        error: "Supabase not configured.",
        kitId: params.id,
        productId: params.product_id,
        item: null,
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    item: null,
    kitId: params.id,
    productId: params.product_id,
  });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string; product_id: string } }
) {
  const supabase = getSupabaseServer();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  if (!supabase) {
    return NextResponse.json(
      {
        error: "Supabase not configured.",
        kitId: params.id,
        productId: params.product_id,
        received: body,
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    kitId: params.id,
    productId: params.product_id,
    received: body,
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; product_id: string } }
) {
  const supabase = getSupabaseServer();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured.", kitId: params.id, productId: params.product_id },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    kitId: params.id,
    productId: params.product_id,
  });
}

export function OPTIONS() {
  return NextResponse.json({ ok: true });
}
