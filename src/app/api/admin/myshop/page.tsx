// src/app/admin/myshop/page.tsx
"use client";
import { useEffect, useState } from "react";

type CheckRow = {
  type: "kit" | "product";
  slug: string | null;
  title: string | null;
  sku: string | null;
  url: string;
  ok: boolean;
  status: number;
  finalUrl: string;
  inShop: boolean;
  error: string | null;
};

export default function AdminMyShopReport() {
  const [rows, setRows] = useState<CheckRow[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setRows(null);
    const res = await fetch("/api/admin/myshop/verify", { cache: "no-store" });
    const data = await res.json();
    setRows(data?.rows ?? []);
    setLoading(false);
  }

  useEffect(() => { run(); }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin • MyShop Link Check</h1>
          <button
            onClick={run}
            disabled={loading}
            className="rounded-lg px-4 py-2 bg-white text-black hover:bg-zinc-200 disabled:opacity-60"
          >
            {loading ? "Checking..." : "Re-run"}
          </button>
        </div>

        {!rows ? (
          <p className="text-zinc-400">Running checks…</p>
        ) : rows.length === 0 ? (
          <p className="text-zinc-400">No links to check.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-left">Slug/Title</th>
                  <th className="px-3 py-2 text-left">SKU</th>
                  <th className="px-3 py-2 text-left">Declared URL</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Final URL</th>
                  <th className="px-3 py-2 text-left">In MyShop?</th>
                  <th className="px-3 py-2 text-left">Error</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const name = r.type === "kit" ? (r.slug || "—") : (r.title || "—");
                  return (
                    <tr key={i} className="border-t border-zinc-800">
                      <td className="px-3 py-2 text-zinc-300">{r.type}</td>
                      <td className="px-3 py-2">{name}</td>
                      <td className="px-3 py-2">{r.sku ?? "—"}</td>
                      <td className="px-3 py-2 truncate max-w-[260px]">
                        <a href={r.url} target="_blank" className="underline">{r.url}</a>
                      </td>
                      <td className={`px-3 py-2 ${r.ok ? "text-green-400" : "text-red-400"}`}>
                        {r.status || "—"}
                      </td>
                      <td className="px-3 py-2 truncate max-w-[260px]">
                        <a href={r.finalUrl} target="_blank" className="underline">{r.finalUrl}</a>
                      </td>
                      <td className="px-3 py-2">{r.inShop ? "✅" : "❌"}</td>
                      <td className="px-3 py-2 text-zinc-400">{r.error ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

