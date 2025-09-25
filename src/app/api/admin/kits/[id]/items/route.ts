// src/app/api/admin/kits/[id]/items/route.ts
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  // Keep build safe even if env is missing.
  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured.", items: [], kitId: params.id },
      { status: 503 }
    );
  }

  // If you have a table, uncomment and adjust:
  // const { data, error } = await supabase
  //   .from("kit_items")
  //   .select("*")
  //   .eq("kit_id", params.id)
  //   .order("created_at", { ascending: false });
  // if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // return NextResponse.json({ items: data ?? [], kitId: params.id });

  // Minimal OK shape to avoid breaking admin UI during launch.
  return NextResponse.json({ items: [], kitId: params.id });
}

export async function POST(req: Request, { params }: Params) {
  const supabase = getSupabaseServer();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured.", received: body, kitId: params.id },
      { status: 503 }
    );
  }

  // If you have a table, uncomment and map fields accordingly:
  // const { error } = await supabase.from("kit_items").insert({
  //   kit_id: params.id,
  //   ...body,
  // });
  // if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, kitId: params.id, received: body }, { status: 201 });
}

export async function PUT(req: Request, { params }: Params) {
  const supabase = getSupabaseServer();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured.", received: body, kitId: params.id },
      { status: 503 }
    );
  }

  // Example update if needed later:
  // const { error } = await supabase
  //   .from("kit_items")
  //   .update(body)
  //   .eq("kit_id", params.id);
  // if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, kitId: params.id, received: body });
}

export function OPTIONS() {
  return NextResponse.json({ ok: true });
}
