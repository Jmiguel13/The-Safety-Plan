// src/app/api/admin/kits/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Narrow shape we care about from Postgres errors (no `any`)
type PgError = { code?: string; message: string };

// Small helper so we don't sprinkle non-null assertions everywhere
function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // server-only
  if (!url || !key) {
    throw new Error("Supabase env missing (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "safety-plan-admin" } },
  });
}

export async function GET() {
  try {
    const supabase = getSupabaseServer();

    const { data, error } = await supabase
      .from("kits")
      .select("id, slug, name, subtitle, description, buy_url, is_published, updated_at")
      .order("updated_at", { ascending: false });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, kits: data ?? [] });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}

function slugify(s: string) {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseServer();

    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const name = String(body?.name ?? "").trim();

    if (!name) {
      return NextResponse.json({ ok: false, error: "name required" }, { status: 400 });
    }

    const rawSlug = String(body?.slug ?? "") || name;
    const slug = slugify(rawSlug);
    if (!slug) {
      return NextResponse.json({ ok: false, error: "invalid slug" }, { status: 400 });
    }

    const payload = {
      slug,
      name,
      subtitle: body?.subtitle ?? null,
      description: body?.description ?? null,
      buy_url: body?.buy_url ?? null,
      is_published: Boolean(body?.is_published),
    };

    const { data: inserted, error } = await supabase
      .from("kits")
      .insert(payload)
      .select("id, slug, name, subtitle, description, buy_url, is_published, updated_at")
      .single();

    if (error) {
      // Map unique violation (duplicate slug) to 409 without using `any`
      const pg = error as PgError;
      const isUnique = pg.code === "23505";
      const status = isUnique ? 409 : 500;
      const message = isUnique ? "slug already exists" : pg.message;
      return NextResponse.json({ ok: false, error: message }, { status });
    }

    return NextResponse.json({ ok: true, kit: inserted }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}

