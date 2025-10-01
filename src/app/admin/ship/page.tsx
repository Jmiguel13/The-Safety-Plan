"use client";

import { useState } from "react";

type State = { status: "idle" | "saving" | "done" | "error"; msg?: string };

export default function AdminShipPage() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const lotMapRaw = String(fd.get("lot_map") ?? "").trim();
    const lot_map =
      lotMapRaw
        ? Object.fromEntries(
            lotMapRaw
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean)
              .map((line) => {
                const [sku, lot] = line.split(/\s*:\s*/);
                return [sku.trim(), (lot ?? "").trim()];
              })
              .filter(([sku, lot]) => sku && lot)
          )
        : undefined;

    const payload = {
      order_id: String(fd.get("order_id") ?? "").trim(),
      kit_id: String(fd.get("kit_id") ?? "").trim() || undefined,
      shipped_at: String(fd.get("shipped_at") ?? "").trim() || undefined,
      tracking_number: String(fd.get("tracking_number") ?? "").trim() || undefined,
      carrier: String(fd.get("carrier") ?? "").trim() || undefined,
      ship_to: {
        name: String(fd.get("name") ?? "").trim() || undefined,
        line1: String(fd.get("line1") ?? "").trim() || undefined,
        line2: String(fd.get("line2") ?? "").trim() || undefined,
        city: String(fd.get("city") ?? "").trim() || undefined,
        state: String(fd.get("state") ?? "").trim() || undefined,
        postal_code: String(fd.get("postal_code") ?? "").trim() || undefined,
        country: String(fd.get("country") ?? "").trim() || undefined,
        phone: String(fd.get("phone") ?? "").trim() || undefined,
        email: String(fd.get("email") ?? "").trim() || undefined,
      },
      lot_map,
      photos: undefined as string[] | undefined, // extend if you add photo URL inputs
      notes: String(fd.get("notes") ?? "").trim() || undefined,
    };

    setState({ status: "saving" });
    try {
      const res = await fetch("/api/admin/compliance/log-shipment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save");
      setState({ status: "done", msg: `Logged shipment #${json?.shipment?.id ?? ""}` });
      form.reset();
      (form.querySelector<HTMLInputElement>('input[name="order_id"]')?.focus?.());
    } catch (err: unknown) {
      setState({ status: "error", msg: err instanceof Error ? err.message : "Error" });
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Log Shipment</h1>
      <p className="muted">
        Records shipments &amp; lot mapping. Posts to
        <code className="ml-1 rounded bg-black/30 px-1">/api/admin/compliance/log-shipment</code>.
      </p>

      <form
        onSubmit={onSubmit}
        className="grid gap-3 rounded-2xl border border-[color:var(--border)] p-4"
      >
        <div className="grid gap-2 sm:grid-cols-3">
          <label className="grid gap-1">
            <span className="text-sm">Order ID *</span>
            <input name="order_id" required className="rounded border bg-transparent px-3 py-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Kit ID</span>
            <input name="kit_id" className="rounded border bg-transparent px-3 py-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Shipped At</span>
            <input name="shipped_at" type="datetime-local" className="rounded border bg-transparent px-3 py-2" />
          </label>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <label className="grid gap-1">
            <span className="text-sm">Carrier</span>
            <input name="carrier" className="rounded border bg-transparent px-3 py-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Tracking #</span>
            <input name="tracking_number" className="rounded border bg-transparent px-3 py-2" />
          </label>
        </div>

        <fieldset className="grid gap-2 rounded border border-[color:var(--border)] p-3">
          <legend className="px-2 text-sm text-zinc-400">Ship To</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm">Name</span>
              <input name="name" className="rounded border bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Phone</span>
              <input name="phone" className="rounded border bg-transparent px-3 py-2" />
            </label>
          </div>
          <label className="grid gap-1">
            <span className="text-sm">Email</span>
            <input name="email" type="email" className="rounded border bg-transparent px-3 py-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Address 1</span>
            <input name="line1" className="rounded border bg-transparent px-3 py-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Address 2</span>
            <input name="line2" className="rounded border bg-transparent px-3 py-2" />
          </label>
          <div className="grid gap-2 sm:grid-cols-4">
            <label className="grid gap-1">
              <span className="text-sm">City</span>
              <input name="city" className="rounded border bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">State</span>
              <input name="state" className="rounded border bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Postal Code</span>
              <input name="postal_code" className="rounded border bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Country</span>
              <input name="country" className="rounded border bg-transparent px-3 py-2" />
            </label>
          </div>
        </fieldset>

        <label className="grid gap-1">
          <span className="text-sm">
            Lot Map (one per line as &quot;SKU: LOT&quot;)
          </span>
          <textarea
            name="lot_map"
            rows={4}
            placeholder={"XS-ENERGY-12PK: LOT1234\nNUTRILITE-MULTI-30: LOT5678"}
            className="rounded border bg-transparent px-3 py-2"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Notes</span>
          <textarea name="notes" rows={3} className="rounded border bg-transparent px-3 py-2" />
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button className="btn" disabled={state.status === "saving"}>Save Shipment</button>
          {state.status === "saving" && <span className="text-sm">Saving…</span>}
          {state.status === "done" && <span className="text-sm text-emerald-400">{state.msg}</span>}
          {state.status === "error" && <span className="text-sm text-red-400">{state.msg}</span>}
        </div>
      </form>
    </main>
  );
}
