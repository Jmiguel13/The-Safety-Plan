// src/app/api/admin/kits/[id]/items/route.ts
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getKitId(req: Request): string {
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  // .../api/admin/kits/[id]/items
  const i = parts.findIndex((p) => p === "kits");
  return i >= 0 ? decodeURIComponent(parts[i + 1] || "") : "";
}

export async function GET(req: Request) {
  const kitId = getKitId(req);

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured.", items: [], kitId },
      { status: 503 }
    );
  }

  // Placeholder OK shape during launch
  return NextResponse.json({ items: [], kitId });
}

export async function POST(req: Request) {
  const kitId = getKitId(req);
  const supabase = getSupabaseServer();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured.", received: body, kitId },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, kitId, received: body }, { status: 201 });
}

export async function PUT(req: Request) {
  const kitId = getKitId(req);
  const supabase = getSupabaseServer();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured.", received: body, kitId },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, kitId, received: body });
}

export function OPTIONS() {
  return NextResponse.json({ ok: true });
}
