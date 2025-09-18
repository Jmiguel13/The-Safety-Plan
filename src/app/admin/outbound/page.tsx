"use client";

import { useEffect, useMemo, useState } from "react";

type Summary = {
  ok: boolean;
  range: { from: string; to: string };
  total: number;
  byDay: { day: string; count: number }[];
  byKit: { key: string; count: number }[];
  topPaths: { key: string; count: number }[];
  targetHosts: { key: string; count: number }[];
  rows: number;
};

function srOnly(label: string) {
  return <span className="sr-only">{label}</span>;
}

// Map a value (0..max) to Tailwind height classes h-1..h-20
function barHeightClass(count: number, max: number) {
  const bucket = Math.max(1, Math.min(20, Math.round((count / Math.max(max, 1)) * 20)));
  return `h-${bucket}`;
}

export default function AdminOutbound() {
  const todayIso = new Date().toISOString().slice(0, 10);
  const fourteenAgoIso = new Date(Date.now() - 13 * 864e5).toISOString().slice(0, 10);

  const [from, setFrom] = useState(fourteenAgoIso);
  const [to, setTo] = useState(todayIso);
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    const params = new URLSearchParams({ from, to });
    const res = await fetch(`/api/admin/outbound?${params.toString()}`, { cache: "no-store" });
    const json = await res.json();
    setLoading(false);
    if (!json?.ok) return setErr(json?.error || "Load failed");
    setData(json);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function downloadCsv() {
    const params = new URLSearchParams({ from, to });
    window.location.href = `/api/admin/outbound/csv?${params.toString()}`;
  }

  const total = data?.total ?? 0;
  const dailyAvg = useMemo(() => {
    if (!data?.byDay) return 0;
    const days = data.byDay.length || 1;
    const sum = data.byDay.reduce((s, d) => s + d.count, 0);
    return Math.round(sum / days);
  }, [data]);

  const maxDayCount = useMemo(
    () => Math.max(1, ...(data?.byDay?.map((d) => d.count) ?? [1])),
    [data]
  );

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin • Outbound report</h1>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 mb-6">
          <form
            className="flex flex-col md:flex-row gap-3 items-start md:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              load();
            }}
            aria-labelledby="report-controls"
          >
            <h2 id="report-controls" className="sr-only">
              Report controls
            </h2>

            <div>
              <label htmlFor="fromDate" className="block text-xs text-zinc-400 mb-1">
                From
              </label>
              <input
                id="fromDate"
                name="from"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                aria-describedby="from-help"
                className="rounded bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
              />
              <p id="from-help" className="sr-only">
                Start date for the report range
              </p>
            </div>

            <div>
              <label htmlFor="toDate" className="block text-xs text-zinc-400 mb-1">
                To
              </label>
              <input
                id="toDate"
                name="to"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                aria-describedby="to-help"
                className="rounded bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
              />
              <p id="to-help" className="sr-only">
                End date for the report range
              </p>
            </div>

            <div className="flex-1" />

            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg px-4 py-2 bg-white text-black hover:bg-zinc-200"
                aria-label="Refresh report"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={downloadCsv}
                className="rounded-lg px-4 py-2 border border-zinc-600 hover:bg-zinc-800"
                aria-label="Download CSV"
              >
                Download CSV
              </button>
            </div>
          </form>

          <p className="text-xs text-zinc-500 mt-2">
            Range: {data?.range?.from?.slice(0, 10)} → {data?.range?.to?.slice(0, 10)} •{" "}
            {data?.rows ?? 0} rows scanned
          </p>
        </div>

        {err && <p className="text-red-400 mb-4">{err}</p>}
        {loading ? (
          <p className="text-zinc-400">Loading…</p>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" role="region" aria-label="Summary stats">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="text-sm text-zinc-400">Total clicks</div>
                <div className="text-3xl font-semibold mt-1" aria-live="polite">
                  {total}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="text-sm text-zinc-400">Daily average</div>
                <div className="text-3xl font-semibold mt-1" aria-live="polite">
                  {dailyAvg}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="text-sm text-zinc-400">Distinct sources</div>
                <div className="text-3xl font-semibold mt-1" aria-live="polite">
                  {data?.topPaths?.length ?? 0}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* By kit */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4" role="region" aria-label="Clicks by kit">
                <h2 className="text-lg font-semibold mb-3">By kit</h2>
                <table className="w-full text-sm">
                  <thead className="text-zinc-400">
                    <tr>
                      <th className="text-left py-1">Kit</th>
                      <th className="text-right py-1">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.byKit?.map((r) => (
                      <tr key={r.key} className="border-t border-zinc-800">
                        <td className="py-1">{r.key}</td>
                        <td className="py-1 text-right">{r.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Top sources */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4" role="region" aria-label="Top sources">
                <h2 className="text-lg font-semibold mb-3">Top sources (path_from)</h2>
                <table className="w-full text-sm">
                  <thead className="text-zinc-400">
                    <tr>
                      <th className="text-left py-1">Source</th>
                      <th className="text-right py-1">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.topPaths?.map((r) => (
                      <tr key={r.key} className="border-t border-zinc-800">
                        <td className="py-1 truncate max-w-[22rem]">{r.key}</td>
                        <td className="py-1 text-right">{r.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Daily trend */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:col-span-2" role="region" aria-label="Daily trend">
                <h2 className="text-lg font-semibold mb-3">Daily trend</h2>
                <div className="grid grid-cols-7 md:grid-cols-14 gap-1">
                  {data?.byDay?.map((d) => {
                    const h = barHeightClass(d.count, maxDayCount);
                    return (
                      <div key={d.day} className="flex flex-col items-center gap-1">
                        <div
                          className={`w-full rounded bg-gradient-to-t from-white to-zinc-300 ${h}`}
                          role="img"
                          aria-label={`${d.day}: ${d.count} clicks`}
                        />
                        <span className="text-[10px] text-zinc-500">{d.day.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Target hosts */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:col-span-2" role="region" aria-label="Target hosts">
                <h2 className="text-lg font-semibold mb-3">Target hosts</h2>
                <table className="w-full text-sm">
                  <thead className="text-zinc-400">
                    <tr>
                      <th className="text-left py-1">Host</th>
                      <th className="text-right py-1">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.targetHosts?.map((r) => (
                      <tr key={r.key} className="border-t border-zinc-800">
                        <td className="py-1">{r.key}</td>
                        <td className="py-1 text-right">{r.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}






void srOnly;



