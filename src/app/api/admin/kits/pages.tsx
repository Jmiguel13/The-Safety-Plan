// app/admin/kits/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Kit = {
  id: string;
  slug: string | null;
  name: string | null;
  subtitle: string | null;
  description: string | null;
  buy_url: string | null;
  is_published: boolean;
  updated_at: string;
};

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm ${props.className || ""}`}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm ${props.className || ""}`}
    />
  );
}

export default function AdminKitsPage() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/kits", { cache: "no-store" });
    const data = await res.json();
    if (!data.ok) setError(data.error || "Failed to load kits");
    setKits(data.kits || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save(id: string, patch: Partial<Kit>) {
    setSavingId(id);
    setError(null);
    const res = await fetch(`/api/admin/kits/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    setSavingId(null);
    if (!data.ok) {
      setError(data.error || "Save failed");
    } else {
      setKits((prev) => prev.map((k) => (k.id === id ? data.kit : k)));
    }
  }

  async function createNew() {
    setCreating(true);
    setError(null);
    const res = await fetch(`/api/admin/kits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New Kit", is_published: false }),
    });
    const data = await res.json();
    setCreating(false);
    if (!data.ok) {
      setError(data.error || "Create failed");
    } else {
      setKits((prev) => [data.kit, ...prev]);
    }
  }

  const sorted = useMemo(
    () => kits.slice().sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()),
    [kits]
  );

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin • Kits</h1>
          <button
            onClick={createNew}
            disabled={creating}
            className="rounded-lg px-4 py-2 bg-white text-black hover:bg-zinc-200 disabled:opacity-60"
          >
            {creating ? "Creating…" : "New kit"}
          </button>
        </div>

        {error && <p className="mb-4 text-red-400">{error}</p>}

        {loading ? (
          <p className="text-zinc-400">Loading…</p>
        ) : sorted.length === 0 ? (
          <p className="text-zinc-500">No kits yet.</p>
        ) : (
          <div className="space-y-6">
            {sorted.map((k) => (
              <div key={k.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Name</label>
                    <TextInput
                      defaultValue={k.name ?? ""}
                      onBlur={(e) => save(k.id, { name: e.currentTarget.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Slug</label>
                    <TextInput
                      defaultValue={k.slug ?? ""}
                      onBlur={(e) => save(k.id, { slug: e.currentTarget.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-zinc-400 mb-1">Subtitle</label>
                    <TextInput
                      defaultValue={k.subtitle ?? ""}
                      onBlur={(e) => save(k.id, { subtitle: e.currentTarget.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-zinc-400 mb-1">Description</label>
                    <TextArea
                      rows={4}
                      defaultValue={k.description ?? ""}
                      onBlur={(e) => save(k.id, { description: e.currentTarget.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-zinc-400 mb-1">Buy URL (MyShop)</label>
                    <TextInput
                      defaultValue={k.buy_url ?? ""}
                      onBlur={(e) => save(k.id, { buy_url: e.currentTarget.value })}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked={k.is_published}
                      onChange={(e) => save(k.id, { is_published: e.currentTarget.checked })}
                    />
                    <span className="text-sm">Published</span>
                  </label>

                  <a
                    href={`/kits/${k.slug ?? ""}`}
                    className="text-sm underline underline-offset-4"
                    target="_blank"
                  >
                    View page
                  </a>
                  <a
                    href={`/r/${k.slug ?? ""}`}
                    className="text-sm underline underline-offset-4"
                    target="_blank"
                  >
                    Test shortlink
                  </a>

                  {savingId === k.id && <span className="text-sm text-zinc-400">Saving…</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

