// src/app/api/admin/kits/[id]/items/route.ts
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs"; // admin ops require server runtime

/** Extracts /api/admin/kits/:id/items from the URL */
function extractKitId(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean);
  // .../api/admin/kits/:id/items
  const itemsIdx = parts.lastIndexOf("items");
  if (itemsIdx <= 0) return null;
  const id = decodeURIComponent(parts[itemsIdx - 1] || "");
  return id || null;
}

type PostBody = {
  product_id?: string;
  qty?: number;         // optional; defaults to 1
  sort_order?: number;  // optional; auto-assigns to end if omitted
  note?: string | null; // optional metadata field if you track notes
};

/**
 * POST /api/admin/kits/:id/items
 * Body: { product_id: string; qty?: number; sort_order?: number; note?: string | null }
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const kit_id = extractKitId(url.pathname);
    if (!kit_id) {
      return Response.json({ ok: false, error: "Missing kit_id in route." }, { status: 400 });
    }

    let body: PostBody;
    try {
      body = (await request.json()) as PostBody;
    } catch {
      return Response.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
    }

    if (!body?.product_id) {
      return Response.json({ ok: false, error: "product_id is required." }, { status: 400 });
    }

    const qty =
      Number.isFinite(body.qty as number) && (body.qty as number)! > 0
        ? Math.floor(body.qty as number)
        : 1;

    const sb = createSupabaseAdmin();

    // Determine sort_order if not provided: put at the end
    let sort_order = body.sort_order;
    if (!Number.isFinite(sort_order as number)) {
      const { data: maxRow, error: maxErr } = await sb
        .from("kit_items")
        .select("sort_order")
        .eq("kit_id", kit_id)
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (maxErr) {
        return Response.json(
          { ok: false, error: `Failed to read current sort order: ${maxErr.message}` },
          { status: 500 }
        );
      }
      sort_order = (maxRow?.sort_order ?? 0) + 1;
    } else {
      sort_order = Math.max(1, Math.floor(sort_order as number));
    }

    const insert = {
      kit_id,
      product_id: body.product_id,
      qty,
      sort_order,
      ...(typeof body.note === "string" || body.note === null ? { note: body.note } : {}),
    };

    const { data, error } = await sb.from("kit_items").insert(insert).select("*").single();

    if (error) {
      return Response.json({ ok: false, error: error.message }, { status: 500 });
    }

    return Response.json({ ok: true, item: data }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}

/** GET collection for sanity (list items for kit) */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const kit_id = extractKitId(url.pathname);
  if (!kit_id) return Response.json({ ok: false, error: "Missing kit_id in route." }, { status: 400 });

  const sb = createSupabaseAdmin();
  const { data, error } = await sb
    .from("kit_items")
    .select("id, kit_id, product_id, qty, sort_order, note")
    .eq("kit_id", kit_id)
    .order("sort_order", { ascending: true });

  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  return Response.json({ ok: true, items: data ?? [] }, { status: 200 });
}

