import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Shipment = {
  order_id: string;
  kit_id: string | null;
  shipped_at: string | null;
  tracking_number: string | null;
  carrier: string | null;
  lot_map: Record<string, string> | null;
};

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <tr>
      <td className="pr-4 font-medium">{label}</td>
      <td>{value ?? "—"}</td>
    </tr>
  );
}

export default async function PackingSlipPage(
  props: { params: Promise<Record<string, string>> } // <-- keep params as a Promise
) {
  const { params } = props;
  const { orderId } = (await params) as { orderId: string };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const { data, error } = await supabase
    .from("outgoing_shipments")
    .select("order_id, kit_id, shipped_at, tracking_number, carrier, lot_map")
    .eq("order_id", orderId)
    .order("shipped_at", { ascending: false })
    .limit(1)
    .maybeSingle<Shipment>();

  if (error) {
    return (
      <html>
        <body className="p-8">
          <h1 className="text-xl font-semibold">Packing Slip — Error</h1>
          <p className="text-red-400">{error.message}</p>
        </body>
      </html>
    );
  }

  if (!data) {
    return (
      <html>
        <body className="p-8">
          <h1 className="text-xl font-semibold">Packing Slip</h1>
          <p>
            No shipment found for order <code>{orderId}</code>.
          </p>
        </body>
      </html>
    );
  }

  const lotEntries = Object.entries(data.lot_map ?? {});

  return (
    <html>
      <body className="mx-auto my-8 w-[800px] rounded-xl border p-8 text-sm">
        <h1 className="text-2xl font-semibold">Packing Slip — The Safety Plan</h1>
        <p className="muted">Order: {data.order_id}</p>

        <table className="mt-4">
          <tbody>
            <Row label="Kit" value={data.kit_id} />
            <Row label="Shipped" value={data.shipped_at?.replace("T", " ").slice(0, 19)} />
            <Row label="Carrier" value={data.carrier} />
            <Row label="Tracking" value={data.tracking_number} />
          </tbody>
        </table>

        <div className="divider" />

        <h2 className="text-lg font-medium">Lot Numbers</h2>
        {lotEntries.length ? (
          <ul className="list-disc pl-6">
            {lotEntries.map(([sku, lot]) => (
              <li key={sku}>
                <code>{sku}</code> — Lot <strong>{lot}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-400">No lot mapping provided.</p>
        )}

        <div className="divider" />

        <h2 className="text-lg font-medium">Disclosure</h2>
        <p>
          Consumables in this kit were purchased from third-party manufacturers. Some items may be
          provided in their original retail packaging; any item repackaged by Blank is disclosed on
          the product page and on this slip. For full Supplement Facts and allergen information,
          refer to the manufacturer’s label. Questions: support@blanknothing.com • 864-713-0509
        </p>

        <script dangerouslySetInnerHTML={{ __html: "window.print && window.print()" }} />
      </body>
    </html>
  );
}
