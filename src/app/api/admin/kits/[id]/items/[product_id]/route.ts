// src/app/api/admin/kits/[id]/items/[product_id]/route.ts
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

type Params = { params: { id: string; product_id: string } };

export async function GET(_req: Request, { params }: Params) {
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

  // If you have a table, uncomment:
  // const { data, error } = await supabase
  //   .from("kit_items")
  //   .select("*")
  //   .eq("kit_id", params.id)
  //   .eq("product_id", params.product_id)
  //   .single();
  // if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // return NextResponse.json({ item: data, kitId: params.id, productId: params.product_id });

  return NextResponse.json({ item: null, kitId: params.id, productId: params.product_id });
}

export async function PUT(req: Request, { params }: Params) {
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

  // Example update:
  // const { error } = await supabase
  //   .from("kit_items")
  //   .update(body)
  //   .eq("kit_id", params.id)
  //   .eq("product_id", params.product_id);
  // if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, kitId: params.id, productId: params.product_id, received: body });
}

export async function DELETE(_req: Request, { params }: Params) {
  const supabase = getSupabaseServer();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured.", kitId: params.id, productId: params.product_id },
      { status: 503 }
    );
  }

  // Example delete:
  // const { error } = await supabase
  //   .from("kit_items")
  //   .delete()
  //   .eq("kit_id", params.id)
  //   .eq("product_id", params.product_id);
  // if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, kitId: params.id, productId: params.product_id });
}

export function OPTIONS() {
  return NextResponse.json({ ok: true });
}
