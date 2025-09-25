// src/app/api/admin/kits/[id]/items/route.ts
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured.", items: [], kitId: params.id },
      { status: 503 }
    );
  }

  // Placeholder OK shape to keep admin UI stable during launch.
  return NextResponse.json({ items: [], kitId: params.id });
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabaseServer();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured.", received: body, kitId: params.id },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { ok: true, kitId: params.id, received: body },
    { status: 201 }
  );
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabaseServer();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured.", received: body, kitId: params.id },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, kitId: params.id, received: body });
}

export function OPTIONS() {
  return NextResponse.json({ ok: true });
}
