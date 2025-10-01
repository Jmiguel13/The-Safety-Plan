// src/app/api/admin/compliance/log-incoming/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type IncomingPayload = {
  supplier_name: string;
  supplier_iboid?: string | null;
  amway_invoice?: string | null;
  sku: string;
  qty: number;
  lot_number?: string | null;
  expiration_date?: string | null; // ISO date
  condition?: string | null;
  storage_location?: string | null;
  photo_url?: string | null;
  notes?: string | null;
};

function parseIncomingPayload(json: unknown): IncomingPayload {
  if (typeof json !== "object" || json === null) {
    throw new Error("Invalid JSON body");
  }
  const o = json as Record<string, unknown>;

  const supplier_name = typeof o.supplier_name === "string" ? o.supplier_name.trim() : "";
  const sku = typeof o.sku === "string" ? o.sku.trim() : "";
  const qty = Number.isFinite(o.qty) ? Number(o.qty) : NaN;

  if (!supplier_name) throw new Error("supplier_name is required");
  if (!sku) throw new Error("sku is required");
  if (!Number.isInteger(qty) || qty <= 0) throw new Error("qty must be a positive integer");

  const str = (v: unknown) => (typeof v === "string" ? v : null);

  return {
    supplier_name,
    supplier_iboid: str(o.supplier_iboid),
    amway_invoice: str(o.amway_invoice),
    sku,
    qty,
    lot_number: str(o.lot_number),
    expiration_date: str(o.expiration_date),
    condition: str(o.condition),
    storage_location: str(o.storage_location),
    photo_url: str(o.photo_url),
    notes: str(o.notes),
  };
}

export async function POST(req: Request) {
  try {
    const body = parseIncomingPayload(await req.json());

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: "Server misconfigured: missing Supabase env" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const { data, error } = await supabase
      .from("incoming_batches")
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, batch: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
