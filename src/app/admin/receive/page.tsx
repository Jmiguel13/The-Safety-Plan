// src/app/admin/receive/page.tsx
"use client";

import { useState } from "react";

type State = { status: "idle" | "saving" | "done" | "error"; msg?: string };

export default function AdminReceivePage() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    // coerce types
    const payload = {
      supplier_name: String(data.supplier_name ?? "").trim(),
      supplier_iboid: String(data.supplier_iboid ?? "").trim() || undefined,
      amway_invoice: String(data.amway_invoice ?? "").trim() || undefined,
      sku: String(data.sku ?? "").trim(),
      qty: Number(data.qty ?? 0),
      lot_number: String(data.lot_number ?? "").trim() || undefined,
      expiration_date: String(data.expiration_date ?? "").trim() || undefined, // yyyy-mm-dd
      condition: String(data.condition ?? "").trim() || undefined,
      storage_location: String(data.storage_location ?? "").trim() || undefined,
      photo_url: String(data.photo_url ?? "").trim() || undefined,
      notes: String(data.notes ?? "").trim() || undefined,
    };

    setState({ status: "saving" });
    try {
      const res = await fetch("/api/admin/compliance/log-incoming", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save");
      setState({ status: "done", msg: `Saved batch #${json?.batch?.id ?? ""}` });
      form.reset();
      (form.querySelector<HTMLInputElement>('input[name="sku"]')?.focus?.());
    } catch (err: unknown) {
      setState({ status: "error", msg: err instanceof Error ? err.message : "Error" });
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Receive Inventory</h1>
      <p className="muted">
        Log incoming batches (supplier invoices, lot numbers, expirations). This posts to
        <code className="ml-1 rounded bg-black/30 px-1">/api/admin/compliance/log-incoming</code>.
      </p>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl border border-[color:var(--border)] p-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm">Supplier Name *</span>
            <input name="supplier_name" required className="rounded border bg-transparent px-3 py-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Supplier IBO#</span>
            <input name="supplier_iboid" className="rounded border bg-transparent px-3 py-2" />
          </label>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <label className="grid gap-1">
            <span className="text-sm">Invoice #</span>
            <input name="amway_invoice" className="rounded border bg-transparent px-3 py-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">SKU *</span>
            <input name="sku" required className="rounded border bg-transparent px-3 py-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Qty *</span>
            <input name="qty" type="number" min={1} required className="rounded border bg-transparent px-3 py-2" />
          </label>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <label className="grid gap-1">
            <span className="text-sm">Lot #</span>
            <input name="lot_number" className="rounded border bg-transparent px-3 py-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Expiration</span>
            <input name="expiration_date" type="date" className="rounded border bg-transparent px-3 py-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Condition</span>
            <input name="condition" className="rounded border bg-transparent px-3 py-2" />
          </label>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm">Storage Location</span>
            <input name="storage_location" className="rounded border bg-transparent px-3 py-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Photo URL</span>
            <input name="photo_url" className="rounded border bg-transparent px-3 py-2" />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm">Notes</span>
          <textarea name="notes" rows={3} className="rounded border bg-transparent px-3 py-2" />
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button className="btn" disabled={state.status === "saving"}>Save Batch</button>
          {state.status === "saving" && <span className="text-sm">Saving…</span>}
          {state.status === "done" && <span className="text-sm text-emerald-400">{state.msg}</span>}
          {state.status === "error" && <span className="text-sm text-red-400">{state.msg}</span>}
        </div>
      </form>
    </main>
  );
}
