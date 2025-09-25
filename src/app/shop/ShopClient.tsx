// src/app/shop/ShopClient.tsx
"use client";

import * as React from "react";
import Link from "next/link";

type KitLite = {
  slug: string;
  title: string;
  stats?: { itemCount: number; skuCount: number };
};

type SoloPick = { sku: string; title?: string; url: string };

type TspProduct = {
  id: string;
  title: string;
  priceId?: string; // optional Stripe price id for TSP merch
  href?: string;
};

type Props = {
  kitsList: KitLite[];
  solos?: SoloPick[]; // <-- make optional to match callers that don't pass it
  tspProducts: TspProduct[];
  storeHref: string;
  stickerPrice?: string;
  patchPrice?: string;
};

type Variant = "daily" | "10day" | "30day";

const VARIANT_LABEL: Record<Variant, string> = {
  daily: "Daily",
  "10day": "10-Day Supply",
  "30day": "30-Day Supply",
};

export default function ShopClient({
  kitsList,
  solos = [], // <-- default to empty so render is safe
  tspProducts,
  storeHref,
}: Props) {
  // one piece of UI state per-kit: quantity + variant
  const [quantities, setQuantities] = React.useState<Record<string, number>>(
    Object.fromEntries(kitsList.map((k) => [k.slug, 1]))
  );
  const [variants, setVariants] = React.useState<Record<string, Variant>>(
    Object.fromEntries(kitsList.map((k) => [k.slug, "daily"]))
  );
  const [submitting, setSubmitting] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string | null>>({});

  function clampQty(v: number) {
    return Math.max(1, Math.min(10, Number.isFinite(v) ? v : 1));
  }

  function setQty(slug: string, v: number) {
    setQuantities((p) => ({ ...p, [slug]: clampQty(v) }));
  }

  function setVar(slug: string, v: Variant) {
    setVariants((p) => ({ ...p, [slug]: v }));
  }

  async function buyKit(slug: string) {
    setSubmitting(slug);
    setErrors((e) => ({ ...e, [slug]: null }));
    try {
      const res = await fetch("/api/checkout/kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          variant: variants[slug] as Variant,
          quantity: quantities[slug] ?? 1,
        }),
      });

      const ctype = res.headers.get("content-type") || "";
      let data: unknown;
      if (ctype.includes("application/json")) {
        data = await res.json();
      } else {
        const txt = await res.text();
        try {
          data = JSON.parse(txt);
        } catch {
          data = { error: txt };
        }
      }

      const { url, error } = (data as { url?: string; error?: string }) ?? {};
      if (!res.ok || !url) {
        throw new Error(error || `Checkout failed (${res.status})`);
      }
      window.location.assign(url);
    } catch (err) {
      setErrors((e) => ({
        ...e,
        [slug]:
          err instanceof Error ? err.message : "Checkout failed. Try again.",
      }));
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <>
      {/* === The Kits === */}
      <section id="kits" className="space-y-4">
        <h2 className="text-2xl font-bold">The Kits</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {kitsList.map((k) => {
            const qty = quantities[k.slug] ?? 1;
            const variant = variants[k.slug] ?? "daily";
            const count =
              k.stats?.itemCount != null && k.stats?.skuCount != null
                ? `${k.stats.itemCount} items • ${k.stats.skuCount} SKUs`
                : undefined;

            return (
              <div
                key={k.slug}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{k.title}</h3>
                    {count ? (
                      <p className="muted text-sm">{count}</p>
                    ) : (
                      <p className="muted text-sm">&nbsp;</p>
                    )}
                  </div>

                  <Link
                    href={`/kits/${k.slug}`}
                    className="btn btn-ghost"
                    aria-label={`View ${k.title}`}
                  >
                    View kit
                  </Link>
                </div>

                {/* Variant selector */}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-zinc-400">Kit option</span>
                    <select
                      value={variant}
                      onChange={(e) => setVar(k.slug, e.target.value as Variant)}
                      className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2"
                    >
                      <option value="daily">{VARIANT_LABEL.daily}</option>
                      <option value="10day">{VARIANT_LABEL["10day"]}</option>
                      <option value="30day">{VARIANT_LABEL["30day"]}</option>
                    </select>
                  </label>

                  {/* Quantity */}
                  <div className="flex items-end justify-start gap-2">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setQty(k.slug, (qty ?? 1) - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input
                      aria-label="Quantity"
                      className="w-16 rounded-xl border border-zinc-700 bg-zinc-900 px-2 py-2 text-center"
                      type="number"
                      min={1}
                      max={10}
                      value={qty ?? 1}
                      onChange={(e) =>
                        setQty(k.slug, Number.parseInt(e.target.value, 10))
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setQty(k.slug, (qty ?? 1) + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    className="btn"
                    disabled={submitting === k.slug}
                    onClick={() => buyKit(k.slug)}
                    aria-busy={submitting === k.slug || undefined}
                  >
                    {submitting === k.slug ? "Redirecting…" : "Buy now"}
                  </button>

                  {errors[k.slug] ? (
                    <p className="text-sm text-red-400">{errors[k.slug]}</p>
                  ) : (
                    <p className="text-xs text-zinc-500">
                      Variant:{" "}
                      <span className="uppercase">
                        {VARIANT_LABEL[variant] ?? variant}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* === Solo Amway Products === */}
      <section id="solo" className="space-y-4">
        <h2 className="text-2xl font-bold">Solo Amway Products</h2>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <a
              href={storeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Open MyShop
            </a>
          </div>

          <ul className="mt-4 space-y-3">
            {solos.map((s) => (
              <li
                key={s.sku}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3"
              >
                <div>
                  <div className="font-medium">{s.title ?? s.sku}</div>
                  <div className="text-xs text-zinc-500">SKU {s.sku}</div>
                </div>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  Buy
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* === The Safety Plan Products (Stripe) === */}
      <section id="tsp" className="space-y-4">
        <h2 className="text-2xl font-bold">The Safety Plan Products</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tspProducts.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
            >
              <div className="font-medium">{p.title}</div>
              <div className="mt-3">
                {p.href ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-xs text-zinc-500">Coming soon</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
