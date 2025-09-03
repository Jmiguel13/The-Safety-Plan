// app/admin/myshop/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Scope = "all" | "kits" | "products";

type Row = {
  kind: "kit" | "product";
  id: string;
  key: string;
  url: string;
  ok: boolean;
  status: number | null;
  finalUrl: string | null;
  redirects: number;
  error?: string | null;
};

type Payload = {
  ok: boolean;
  totals: { checked: number; failures: number };
  results: Row[];
};

export default function MyShopChecker() {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [scope, setScope] = useState<Scope>("all");
  const [onlyPublished, setOnlyPublished] = useState(true);
  const [host, setHost] = useState("amway.com");
  const [showOnlyFailures, setShowOnlyFailures] = useState(true);

  const run = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const params = new URLSearchParams({
        scope,
        published: String(onlyPublished),
      });
      if (host.trim()) params.set("host", host.trim());

      const res = await fetch(`/api/admin/linkcheck?${params.toString()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        setErr(`HTTP ${res.status}`);
        setData(null);
        return;
        }
      const json = (await res.json()) as Payload;
      setData(json);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Unknown error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [scope, onlyPublished, host]);

  useEffect(() => {
    void run();
  }, [run]);

  const rows = useMemo<Row[]>(() => {
    const r = data?.results ?? [];
    return showOnlyFailures ? r.filter((x) => !x.ok) : r;
  }, [data, showOnlyFailures]);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Admin • MyShop Link Checker</h1>

        <form
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 mb-6"
          onSubmit={(e) => { e.preventDefault(); void run(); }}
          aria-labelledby="checker-controls"
        >
          <h2 id="checker-controls" className="sr-only">Checker controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label htmlFor="scope" className="block text-xs text-zinc-400 mb-1">Scope</label>
              <select
                id="scope"
                value={scope}
                onChange={(e) => setScope(e.currentTarget.value as Scope)}
                className="w-full rounded bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
              >
                <option value="all">Kits + Products</option>
                <option value="kits">Kits only</option>
                <option value="products">Products only</option>
              </select>
            </div>
            <div>
              <label htmlFor="host" className="block text-xs text-zinc-400 mb-1">Required host ends with</label>
              <input
                id="host"
                placeholder="amway.com"
                value={host}
                onChange={(e) => setHost(e.currentTarget.value)}
                className="w-full rounded bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-end gap-3">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={onlyPublished}
                  onChange={(e) => setOnlyPublished(e.currentTarget.checked)}
                />
                <span className="text-sm">Only published</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showOnlyFailures}
                  onChange={(e) => setShowOnlyFailures(e.currentTarget.checked)}
                />
                <span className="text-sm">Show only failures</span>
              </label>
            </div>
            <div className="flex items-end justify-end">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg px-4 py-2 bg-white text-black hover:bg-zinc-200 disabled:opacity-60"
              >
                {loading ? "Checking…" : "Run check"}
              </button>
            </div>
          </div>

          <p className="text-xs text-zinc-500 mt-2">
            {data ? `${data.totals.checked} checked • ${data.totals.failures} failures` : "—"}
          </p>
        </form>

        {err && <p className="text-red-400 mb-4">{err}</p>}

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-zinc-400">
                <tr>
                  <th className="text-left py-2 px-2">Type</th>
                  <th className="text-left py-2 px-2">Key</th>
                  <th className="text-left py-2 px-2">Start URL</th>
                  <th className="text-left py-2 px-2">Final URL</th>
                  <th className="text-right py-2 px-2">Status</th>
                  <th className="text-right py-2 px-2">Redirects</th>
                  <th className="text-right py-2 px-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-zinc-500">No rows.</td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={`${r.kind}:${r.id}`} className="border-t border-zinc-800">
                      <td className="py-2 px-2">{r.kind}</td>
                      <td className="py-2 px-2">{r.key}</td>
                      <td className="py-2 px-2 truncate max-w-[24rem]">
                        <a href={r.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                          {r.url}
                        </a>
                      </td>
                      <td className="py-2 px-2 truncate max-w-[24rem]">
                        {r.finalUrl ? (
                          <a href={r.finalUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                            {r.finalUrl}
                          </a>
                        ) : (
                          <span className="text-zinc-500">—</span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-right">{r.status ?? "—"}</td>
                      <td className="py-2 px-2 text-right">{r.redirects}</td>
                      <td className="py-2 px-2 text-right">
                        {r.ok ? (
                          <span className="text-green-400">OK</span>
                        ) : (
                          <span className="text-red-400" title={r.error || undefined}>FAIL</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
