// src/app/admin/health/page.tsx
"use client";

import { useEffect, useState } from "react";

type Status = "ok" | "warn" | "error";
type Health = {
  ok: boolean;
  env: {
    site_url: string;
    supabase_url: string;
    supabase_anon_key: string | null;
    service_key: string | null;
    stripe_key_present: boolean;
    myshop: { base?: string | null; shop_id?: string | null };
  };
  checks: {
    supabase: { status: Status; message?: string };
    stripe: { status: Status; message?: string };
    myshop: { status: Status; url: string };
  };
  meta: { now: string; commit?: string | null };
};

export default function AdminHealthPage() {
  const [data, setData] = useState<Health | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      const json = (await res.json()) as Health;
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function badge(s: Status) {
    const tone =
      s === "ok" ? "bg-emerald-500/20 text-emerald-300 border-emerald-700/50" :
      s === "warn" ? "bg-amber-500/20 text-amber-300 border-amber-700/50" :
      "bg-rose-500/20 text-rose-300 border-rose-700/50";
    return `inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${tone}`;
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin · Health</h1>
        <button onClick={() => void load()} className="btn-ghost" disabled={loading}>
          {loading ? "Checking…" : "Re-run"}
        </button>
      </header>

      {!data ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">Loading…</div>
      ) : (
        <>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-400">
                Site: <span className="text-zinc-200">{data.env.site_url}</span>
              </div>
              <span className={badge(data.ok ? "ok" : "warn")}>
                {data.ok ? "OK" : "Warnings"}
              </span>
            </div>
            <div className="grid gap-2 text-sm">
              <div>Supabase URL: <span className="text-zinc-300">{data.env.supabase_url}</span></div>
              <div>Anon Key: <span className="text-zinc-400">{data.env.supabase_anon_key ?? "—"}</span></div>
              <div>Service Key: <span className="text-zinc-400">{data.env.service_key ?? "—"}</span></div>
              <div>Stripe Key Present: <span className="text-zinc-300">{data.env.stripe_key_present ? "yes" : "no"}</span></div>
              <div>MyShop Base: <span className="text-zinc-300">{data.env.myshop.base || "—"}</span></div>
              <div>MyShop ID: <span className="text-zinc-300">{data.env.myshop.shop_id || "—"}</span></div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="mb-2 text-sm font-medium">Supabase</div>
              <div className={badge(data.checks.supabase.status)}>{data.checks.supabase.status}</div>
              {data.checks.supabase.message && (
                <p className="mt-2 text-xs text-zinc-400">{data.checks.supabase.message}</p>
              )}
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="mb-2 text-sm font-medium">Stripe</div>
              <div className={badge(data.checks.stripe.status)}>{data.checks.stripe.status}</div>
              {data.checks.stripe.message && (
                <p className="mt-2 text-xs text-zinc-400">{data.checks.stripe.message}</p>
              )}
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="mb-2 text-sm font-medium">MyShop</div>
              <div className={badge(data.checks.myshop.status)}>{data.checks.myshop.status}</div>
              <a
                className="mt-2 block truncate text-xs underline text-zinc-300"
                href={data.checks.myshop.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.checks.myshop.url}
              </a>
            </div>
          </div>

          <div className="text-xs text-zinc-500">
            Checked: {new Date(data.meta.now).toLocaleString()}
            {data.meta.commit ? ` · commit ${data.meta.commit.slice(0, 7)}` : ""}
          </div>
        </>
      )}
    </section>
  );
}
