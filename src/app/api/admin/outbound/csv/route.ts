// app/api/admin/outbound/csv/route.ts
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
  const from = parseDateParam(url.searchParams.get("from"), 14);
  const toParam = url.searchParams.get("to");
  const to = toParam ? new Date(toParam) : new Date();

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: kits } = await sb.from("kits").select("id, slug");
  const slugById = new Map<string, string>();
  (kits || []).forEach((k) => slugById.set(k.id, k.slug ?? ""));

  const { data: rows, error } = await sb
    .from("outbound_clicks")
    .select("created_at, kit_id, path_from, target_url, ip, user_agent")
    .gte("created_at", from.toISOString())
    .lt("created_at", to.toISOString())
    .order("created_at", { ascending: false })
    .limit(50000);

  if (error) {
    return new NextResponse(`error,${error.message}\n`, {
      status: 500,
      headers: { "content-type": "text/csv; charset=utf-8" },
    });
  }

  const header = ["created_at", "kit_slug", "path_from", "target_url", "ip", "user_agent"].join(",");
  const lines = [header];

  for (const r of rows || []) {
    const kitSlug = r.kit_id ? (slugById.get(r.kit_id) || "") : "";
    // basic CSV escaping
    const csv = [
      r.created_at,
      kitSlug,
      r.path_from || "",
      r.target_url || "",
      r.ip || "",
      r.user_agent || "",
    ]
      .map((v) => {
        const s = String(v ?? "");
        return s.includes(",") || s.includes("\n") || s.includes('"')
          ? `"${s.replace(/"/g, '""')}"`
          : s;
      })
      .join(",");
    lines.push(csv);
  }

  const body = lines.join("\n");
  return new NextResponse(body, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "cache-control": "no-store",
      "content-disposition": `attachment; filename="outbound_${from.toISOString().slice(0,10)}_${to.toISOString().slice(0,10)}.csv"`,
    },
  });
}

