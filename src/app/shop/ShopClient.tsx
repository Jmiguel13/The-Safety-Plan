// src/app/shop/ShopClient.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { formatUsd, type KitPricesMap } from "@/lib/kit-pricing";
import { REPACK_POLICY } from "@/lib/kits-bom";
import type { TspProduct } from "@/lib/tsp-products";

/* ======================= Types ======================= */
type KitLite = {
  slug: string;
  title: string;
  stats?: { itemCount: number; skuCount: number };
};

type SoloPick = { sku: string; title?: string; url: string };

type Props = {
  kitsList: KitLite[];
  solos: SoloPick[];
  tspProducts: TspProduct[];
  storeHref: string; // may be '', '/', or a full URL
  prices?: KitPricesMap;
};

type Variant = "daily" | "10day" | "30day";
const VARIANT_LABEL: Record<Variant, string> = {
  daily: "Daily",
  "10day": "10-Day Supply",
  "30day": "30-Day Supply",
};

type CheckoutResponse = { url?: string; error?: string };

/* ======================= Helpers ======================= */
function clampQty(v: number) {
  return Math.max(1, Math.min(10, Number.isFinite(v) ? v : 1));
}
const kebabFromId = (id: string) => id.replace(/_/g, "-");
const hrefForTsp = (p: TspProduct) => p.url ?? `/gear/${kebabFromId(p.id)}`;
const isExternal = (href: string) => /^https?:\/\//i.test(href);

// Only these show a BUY button (others are view/waitlist)
const DIRECT_GEAR = new Set<string>(["morale_patch", "sticker_pack"]);

/* ======================= Component ======================= */
export default function ShopClient({
  kitsList,
  solos,
  tspProducts,
  storeHref,
  prices,
}: Props) {
  const [quantities, setQuantities] = React.useState<Record<string, number>>(
    Object.fromEntries(kitsList.map((k) => [k.slug, 1]))
  );
  const [variants, setVariants] = React.useState<Record<string, Variant>>(
    Object.fromEntries(kitsList.map((k) => [k.slug, "daily"]))
  );
  const [submitting, setSubmitting] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string | null>>({});
  const [buyingProduct, setBuyingProduct] = React.useState<string | null>(null);

  // --- MyShop link normalization (fixes link-to-homepage issue) ---
  const myShopHref = React.useMemo(() => {
    const envUrl = process.env.NEXT_PUBLIC_AMWAY_MYSHOP_URL;
    const isHttp = (u?: string) => !!u && /^https?:\/\//i.test(u);
    if (isHttp(storeHref)) return storeHref;
    if (isHttp(envUrl)) return envUrl as string;
    // Hard fallback – replace with your distributor URL when known
    return "https://www.amway.com/myshop";
  }, [storeHref]);

  function setQty(slug: string, v: number) {
    setQuantities((p) => ({ ...p, [slug]: clampQty(v) }));
  }
  function setVar(slug: string, v: Variant) {
    setVariants((p) => ({ ...p, [slug]: v }));
  }

  function kitTotalCents(slug: string): { total: number | null; currency: string } {
    const variant = variants[slug] ?? "daily";
    const entry = prices?.[slug]?.[variant] ?? null;
    const unit = entry?.unitAmount ?? null;
    const currency = entry?.currency ?? "USD";
    const qty = quantities[slug] ?? 1;
    return { total: unit != null ? unit * qty : null, currency };
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
      const data: CheckoutResponse = ctype.includes("application/json")
        ? ((await res.json()) as CheckoutResponse)
        : { error: await res.text() };

      if (!res.ok || !data.url) throw new Error(data.error || `Checkout failed (${res.status})`);
      window.location.assign(data.url);
    } catch (err) {
      setErrors((e) => ({
        ...e,
        [slug]: err instanceof Error ? err.message : "Checkout failed. Try again.",
      }));
    } finally {
      setSubmitting(null);
    }
  }

  /** Direct checkout via Stripe Product -> default price */
  async function buyGearByProduct(stripeProductId: string) {
    setBuyingProduct(stripeProductId);
    try {
      const res = await fetch("/api/checkout/gear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeProductId, quantity: 1 }),
      });
      const ctype = res.headers.get("content-type") || "";
      const data: CheckoutResponse = ctype.includes("application/json")
        ? ((await res.json()) as CheckoutResponse)
        : { error: await res.text() };

      if (!res.ok || !data.url) throw new Error(data.error || `Checkout failed (${res.status})`);
      window.location.assign(data.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Checkout failed. Try again.");
    } finally {
      setBuyingProduct(null);
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
            const variant = (variants[k.slug] ?? "daily") as Variant;
            const count =
              k.stats?.itemCount != null && k.stats?.skuCount != null
                ? `${k.stats.itemCount} items • ${k.stats.skuCount} SKUs`
                : undefined;
            const { total, currency } = kitTotalCents(k.slug);

            return (
              <div key={k.slug} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{k.title}</h3>
                    {count ? <p className="muted text-sm">{count}</p> : <p className="muted text-sm">&nbsp;</p>}
                  </div>

                  <Link href={`/kits/${k.slug}`} className="btn btn-ghost" aria-label={`View ${k.title}`}>
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
                    <button type="button" className="btn btn-ghost" onClick={() => setQty(k.slug, (qty ?? 1) - 1)} aria-label="Decrease quantity">−</button>
                    <input
                      aria-label="Quantity"
                      className="w-16 rounded-xl border border-zinc-700 bg-zinc-900 px-2 py-2 text-center"
                      type="number"
                      min={1}
                      max={10}
                      value={qty ?? 1}
                      onChange={(e) => setQty(k.slug, Number.parseInt(e.target.value, 10))}
                    />
                    <button type="button" className="btn btn-ghost" onClick={() => setQty(k.slug, (qty ?? 1) + 1)} aria-label="Increase quantity">+</button>
                  </div>
                </div>

                {/* Repack policy */}
                <details className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                  <summary className="cursor-pointer select-none text-sm font-medium">What changes between Daily, 10-Day, and 30-Day?</summary>
                  <p className="mt-2 whitespace-pre-line text-xs text-zinc-400">{REPACK_POLICY}</p>
                </details>

                {/* Price preview */}
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-zinc-300">
                    {total != null ? (
                      <>
                        <span className="mr-1 font-semibold">{formatUsd(total, currency)}</span>
                        <span className="text-zinc-500">for {qty} × {VARIANT_LABEL[variant]}</span>
                      </>
                    ) : (
                      <span className="text-zinc-500">Price shown at checkout</span>
                    )}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
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
                      Variant: <span className="uppercase">{VARIANT_LABEL[variant] ?? variant}</span>
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
              href={myShopHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              aria-label="Open Amway MyShop in a new tab"
            >
              Open MyShop
            </a>
          </div>

          <ul className="mt-4 space-y-3">
            {solos.map((s) => (
              <li key={s.sku} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                <div>
                  <div className="font-medium">{s.title ?? s.sku}</div>
                  <div className="text-xs text-zinc-500">SKU {s.sku}</div>
                </div>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    Buy
                  </a>
                ) : (
                  <a href={myShopHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    View in MyShop
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* === The Safety Plan Products (TSP merch) === */}
      <section id="tsp" className="space-y-4">
        <h2 className="text-2xl font-bold">The Safety Plan Products</h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tspProducts.map((p) => {
            const href = hrefForTsp(p);
            const external = isExternal(href);
            const canDirect = p.inStock !== false && DIRECT_GEAR.has(p.id) && !!p.stripeProductId;

            return (
              <article key={p.id} className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                <div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p
                    className={[
                      "mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs",
                      p.inStock === false ? "bg-amber-500/10 text-amber-300" : "bg-emerald-500/10 text-emerald-300",
                    ].join(" ")}
                  >
                    {p.inStock === false ? "Waitlist open" : "In stock"}
                  </p>
                  {p.blurb ? <p className="mt-2 text-sm text-zinc-400">{p.blurb}</p> : null}
                </div>

                <div className="mt-4">
                  {canDirect ? (
                    <button
                      type="button"
                      onClick={() => buyGearByProduct(p.stripeProductId!)}
                      className="inline-flex items-center rounded-xl bg-white px-3 py-2 text-sm font-medium text-black hover:opacity-90"
                      disabled={buyingProduct === p.stripeProductId}
                      aria-busy={buyingProduct === p.stripeProductId || undefined}
                    >
                      {buyingProduct === p.stripeProductId ? "Redirecting…" : "Buy"}
                    </button>
                  ) : (
                    <Link
                      href={href}
                      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="inline-flex items-center rounded-xl border border-white/15 px-3 py-2 text-sm font-medium text-white hover:border-white/30 hover:bg-white/10"
                    >
                      {p.inStock === false ? "View / Join waitlist" : "View"}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
