// src/app/api/admin/kits/[id]/items/[product_id]/route.ts
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getIds(req: Request): { kitId: string; productId: string } {
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  // .../api/admin/kits/[id]/items/[product_id]
  const i = parts.findIndex((p) => p === "kits");
  const kitId = i >= 0 ? decodeURIComponent(parts[i + 1] || "") : "";
  const productId = i >= 0 ? decodeURIComponent(parts[i + 3] || "") : ""; // +2 is "items", +3 is the id
  return { kitId, productId };
}

export async function GET(req: Request) {
  const { kitId, productId } = getIds(req);
  const supabase = getSupabaseServer();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured.", kitId, productId, item: null },
      { status: 503 }
    );
  }

  return NextResponse.json({ item: null, kitId, productId });
}

export async function PUT(req: Request) {
  const { kitId, productId } = getIds(req);
  const supabase = getSupabaseServer();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured.", kitId, productId, received: body },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, kitId, productId, received: body });
}

export async function DELETE(req: Request) {
  const { kitId, productId } = getIds(req);
  const supabase = getSupabaseServer();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured.", kitId, productId },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, kitId, productId });
}

export function OPTIONS() {
  return NextResponse.json({ ok: true });
}
