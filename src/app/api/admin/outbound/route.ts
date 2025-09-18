// app/api/admin/outbound/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function parseDateParam(v: string | null, fallbackDaysAgo: number) {
  if (v) {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d;
  }
  const d = new Date();
  d.setDate(d.getDate() - fallbackDaysAgo);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const from = parseDateParam(url.searchParams.get("from"), 14); // default last 14 days
  const toParam = url.searchParams.get("to");
  const to = toParam ? new Date(toParam) : new Date();
  const kitFilter = url.searchParams.get("kit"); // slug (preferred) or id

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Map kits (id -> slug/name)
  const { data: kits } = await sb
    .from("kits")
    .select("id, slug, name")
    .order("name");

  const kitById = new Map<string, { slug: string | null; name: string | null }>();
  (kits || []).forEach((k) => kitById.set(k.id, { slug: k.slug, name: k.name }));

  // If kit=slug, resolve to id set for filtering
  let kitIds: string[] | null = null;
  if (kitFilter) {
    const bySlug = (kits || []).filter((k) => k.slug === kitFilter);
    if (bySlug.length) kitIds = bySlug.map((k) => k.id);
    else kitIds = [kitFilter]; // allow direct id
  }

  // Pull rows (aggregate in-node; simpler than a SQL fn)
  const q = sb
    .from("outbound_clicks")
    .select("id, created_at, kit_id, path_from, target_url")
    .gte("created_at", from.toISOString())
    .lt("created_at", to.toISOString())
    .order("created_at", { ascending: false })
    .limit(10000); // safety cap

  if (kitIds) q.in("kit_id", kitIds);

  const { data: rows, error } = await q;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  // Aggregate
  const total = rows?.length || 0;

  const byDay = new Map<string, number>();
  const byKit = new Map<string, number>();
  const byPath = new Map<string, number>();
  const byTargetHost = new Map<string, number>();

  for (const r of rows || []) {
    const d = new Date(r.created_at);
    const day = d.toISOString().slice(0, 10);

    byDay.set(day, (byDay.get(day) || 0) + 1);

    const kit = r.kit_id ? kitById.get(r.kit_id) : null;
    const kitKey = kit?.slug || "unknown";
    byKit.set(kitKey, (byKit.get(kitKey) || 0) + 1);

    const path = r.path_from || "(direct)";
    byPath.set(path, (byPath.get(path) || 0) + 1);

    try {
      const host = new URL(r.target_url || "").host || "(invalid)";
      byTargetHost.set(host, (byTargetHost.get(host) || 0) + 1);
    } catch {
      byTargetHost.set("(invalid)", (byTargetHost.get("(invalid)") || 0) + 1);
    }
  }

  function toSortedArray(m: Map<string, number>) {
    return Array.from(m.entries())
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count);
  }

  return NextResponse.json({
    ok: true,
    range: { from: from.toISOString(), to: to.toISOString() },
    total,
    byDay: Array.from(byDay.entries())
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => (a.day < b.day ? -1 : 1)),
    byKit: toSortedArray(byKit),
    topPaths: toSortedArray(byPath).slice(0, 50),
    targetHosts: toSortedArray(byTargetHost),
    rows: rows?.length ?? 0,
  });
}

