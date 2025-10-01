// src/app/api/admin/compliance/log-shipment/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/** All fields optional, using `string | undefined` (NOT null). */
type Address = {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
};

type ShipmentPayload = {
  order_id: string;
  kit_id?: string;
  shipped_at?: string; // ISO datetime
  tracking_number?: string;
  carrier?: string;
  ship_to?: Address;
  lot_map?: Record<string, string>; // { SKU: LOT }
  photos?: string[]; // array of URLs
  notes?: string;
};

const toOptStr = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() !== "" ? v : undefined;

const toOptArrStr = (v: unknown): string[] | undefined =>
  Array.isArray(v) ? (v.filter((x) => typeof x === "string") as string[]) : undefined;

function toAddress(raw: unknown): Address | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;
  const o = raw as Record<string, unknown>;
  return {
    name: toOptStr(o.name),
    line1: toOptStr(o.line1 ?? o.address1),
    line2: toOptStr(o.line2 ?? o.address2),
    city: toOptStr(o.city),
    state: toOptStr(o.state),
    postal_code: toOptStr(o.postal_code ?? o.zip),
    country: toOptStr(o.country),
    phone: toOptStr(o.phone),
    email: toOptStr(o.email),
  };
}

function toLotMap(raw: unknown): Record<string, string> | undefined {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return undefined;
  const entries = Object.entries(raw as Record<string, unknown>)
    .filter(([k, v]) => typeof k === "string" && typeof v === "string") as [string, string][];
  return entries.length ? Object.fromEntries(entries) : undefined;
}

function parseShipmentPayload(json: unknown): ShipmentPayload {
  if (typeof json !== "object" || json === null) {
    throw new Error("Invalid JSON body");
  }
  const o = json as Record<string, unknown>;
  const order_id = toOptStr(o.order_id);
  if (!order_id) throw new Error("order_id is required");

  return {
    order_id,
    kit_id: toOptStr(o.kit_id),
    shipped_at: toOptStr(o.shipped_at),
    tracking_number: toOptStr(o.tracking_number),
    carrier: toOptStr(o.carrier),
    ship_to: toAddress(o.ship_to),
    lot_map: toLotMap(o.lot_map),
    photos: toOptArrStr(o.photos),
    notes: toOptStr(o.notes),
  };
}

export async function POST(req: Request) {
  try {
    const body = parseShipmentPayload(await req.json());

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
      .from("outgoing_shipments")
      .insert([
        {
          ...body,
          // Ensure we store an ISO string even if not provided
          shipped_at: body.shipped_at ?? new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, shipment: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
