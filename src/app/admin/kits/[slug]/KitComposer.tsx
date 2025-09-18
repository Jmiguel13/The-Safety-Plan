// src/app/admin/kits/[slug]/KitComposer.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Kit = { id: string; slug: string; name: string | null };
type Product = { id: string; title: string | null; brand: string | null; amway_sku: string | null };
type Item = { product_id: string; quantity: number | null; sort_order: number | null; products?: Product | null };

type KitsResponse = { kits?: Kit[] };
type ItemsResponse = { ok: boolean; items?: Item[]; error?: string };
type ProductsResponse = { products?: Product[] };

export default function KitComposer({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);

  const [kit, setKit] = useState<Kit | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setErr(null);
      try {
        // 1) find kit by slug
        const kitsRes = await fetch("/api/admin/kits", { cache: "no-store", signal });
        if (!kitsRes.ok) throw new Error(`Load kits failed: ${kitsRes.status}`);
        const kitsJson = (await kitsRes.json()) as KitsResponse;
        const k = (kitsJson.kits ?? []).find((x) => x.slug === slug) ?? null;
        if (!k) {
          setKit(null);
          setItems([]);
          throw new Error("Kit not found");
        }
        setKit(k);

        // 2) load its items
        const itemsRes = await fetch(`/api/admin/kits/${k.id}/items`, { cache: "no-store", signal });
        if (!itemsRes.ok) throw new Error(`Load items failed: ${itemsRes.status}`);
        const itemsJson = (await itemsRes.json()) as ItemsResponse;
        if (!itemsJson.ok) throw new Error(itemsJson.error || "Failed to load kit items");
        setItems(itemsJson.items ?? []);

        // 3) load products list
        const prodRes = await fetch("/api/admin/products", { cache: "no-store", signal });
        if (!prodRes.ok) throw new Error(`Load products failed: ${prodRes.status}`);
        const prodJson = (await prodRes.json()) as ProductsResponse;
        setAllProducts(prodJson.products ?? []);
      } catch (e) {
        if ((e as Error).name !== "AbortError") setErr((e as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [slug]
  );

  useEffect(() => {
    const ac = new AbortController();
    void load(ac.signal);
    return () => ac.abort();
  }, [load]);

  const addProduct = useCallback(
    async (p: Product) => {
      if (!kit) return;
      setErr(null);
      const res = await fetch(`/api/admin/kits/${kit.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: p.id, quantity: 1 }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) return setErr(json.error || "Add failed");
      await load();
    },
    [kit, load]
  );

  const update = useCallback(
    async (product_id: string, patch: Partial<Item>) => {
      if (!kit) return;
      setErr(null);
      const res = await fetch(`/api/admin/kits/${kit.id}/items/${product_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = (await res.json()) as { ok: boolean; item?: Item; error?: string };
      if (!json.ok || !json.item) return setErr(json.error || "Save failed");
      setItems((prev) => prev.map((it) => (it.product_id === product_id ? { ...it, ...json.item } : it)));
    },
    [kit]
  );

  const remove = useCallback(
    async (product_id: string) => {
      if (!kit) return;
      setErr(null);
      // optimistic
      setItems((prev) => prev.filter((i) => i.product_id !== product_id));
      const res = await fetch(`/api/admin/kits/${kit.id}/items/${product_id}`, { method: "DELETE" });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        setErr(json.error || "Delete failed");
        await load();
      }
    },
    [kit, load]
  );

  const move = useCallback(
    (product_id: string, dir: -1 | 1) => {
      const sorted = [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      const idx = sorted.findIndex((i) => i.product_id === product_id);
      const j = idx + dir;
      if (idx < 0 || j < 0 || j >= sorted.length) return;

      const next = [...sorted];
      [next[idx], next[j]] = [next[j], next[idx]];
      const reseq = next.map((i, pos) => ({ ...i, sort_order: (pos + 1) * 10 }));
      setItems(reseq);

      void update(reseq[idx].product_id, { sort_order: reseq[idx].sort_order! });
      void update(reseq[j].product_id, { sort_order: reseq[j].sort_order! });
    },
    [items, update]
  );

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return allProducts;
    const has = (v: string | null | undefined) => (v ?? "").toLowerCase().includes(t);
    return allProducts.filter((p) => has(p.title) || has(p.brand) || has(p.amway_sku));
  }, [q, allProducts]);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [items]
  );

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold">Admin • Compose Kit</h1>
        <p className="mb-6 text-zinc-400">{kit ? `${kit.name} (${kit.slug})` : "…"}</p>

        {err && <p className="mb-4 text-red-400">{err}</p>}

        {loading ? (
          <p className="text-zinc-400">Loading…</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left: current items */}
            <div>
              <h2 className="mb-3 text-lg font-semibold">Current items</h2>
              {sortedItems.length === 0 ? (
                <p className="text-zinc-500">No items yet.</p>
              ) : (
                <ul className="space-y-3">
                  {sortedItems.map((it) => (
                    <li
                      key={it.product_id}
                      className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">{it.products?.title || "Untitled"}</div>
                        <div className="text-xs text-zinc-500">
                          {it.products?.brand || "—"} • {it.products?.amway_sku || "no SKU"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => move(it.product_id, -1)}
                          className="rounded border border-zinc-700 px-2 py-1"
                          aria-label="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => move(it.product_id, +1)}
                          className="rounded border border-zinc-700 px-2 py-1"
                          aria-label="Move down"
                        >
                          ↓
                        </button>
                        <input
                          type="number"
                          min={1}
                          defaultValue={it.quantity ?? 1}
                          onBlur={(e) =>
                            update(it.product_id, {
                              quantity: Math.max(1, Number(e.currentTarget.value) || 1),
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const val = Math.max(1, Number((e.target as HTMLInputElement).value) || 1);
                              void update(it.product_id, { quantity: val });
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          className="w-16 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm"
                          title="Quantity"
                          inputMode="numeric"
                        />
                        <button
                          onClick={() => remove(it.product_id)}
                          className="rounded border border-red-400 px-2 py-1 text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Right: product picker */}
            <div>
              <h2 className="mb-3 text-lg font-semibold">Add products</h2>
              <input
                placeholder="Search title / brand / SKU…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="mb-3 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                aria-label="Search products"
              />
              <div className="max-h-[28rem] space-y-2 overflow-auto pr-1">
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => addProduct(p)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-left hover:bg-zinc-900/70"
                  >
                    <div className="font-medium">{p.title ?? "Untitled"}</div>
                    <div className="text-xs text-zinc-500">
                      {p.brand || "—"} • {p.amway_sku || "no SKU"}
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && <p className="text-zinc-500">No matches.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

