// src/app/kits/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { kits } from "@/lib/kits";
import KitCheckoutForm from "@/components/KitCheckoutForm";
import { KITS_BOM, type KitSlug, kitTitle, scaledQty, REPACK_POLICY } from "@/lib/kits-bom";
import { getKitPrices, formatUsd, type Variant } from "@/lib/kit-pricing";

export const revalidate = 86_400;

type KitData = {
  slug: string;
  title?: string;
  blurb?: string;
  tagline?: string;
  imageUrl?: string;
  skus?: string[];
  image?: string;
  imageAlt?: string;
  weight_lb?: number | string;
};

type Params = { slug: string };

function toTitle(s: string) {
  return s ? s.replace(/^\w/, (c) => c.toUpperCase()) : s;
}
function findKit(slug: string) {
  return (kits as KitData[]).find((k) => String(k.slug) === String(slug));
}
function grdFor(slug: string) {
  if (slug === "resilient") {
    return "radial-gradient(1200px 500px at -10% -10%, rgba(16,185,129,0.18), transparent 65%), radial-gradient(900px 420px at 110% 20%, rgba(59,130,246,0.16), transparent 60%)";
  }
  if (slug === "homefront") {
    return "radial-gradient(1200px 500px at 0% 0%, rgba(56,189,248,0.18), transparent 65%), radial-gradient(900px 420px at 100% 15%, rgba(34,197,94,0.16), transparent 60%)";
  }
  return "radial-gradient(1100px 460px at 0% 0%, rgba(148,163,184,0.16), transparent 60%)";
}
function imgMask() {
  return "radial-gradient(circle at 60% 40%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)";
}
function isKitSlug(s: string): s is KitSlug {
  return s === "resilient" || s === "homefront";
}

export async function generateStaticParams() {
  return (kits as Array<{ slug: string }>).map((k) => ({ slug: String(k.slug) }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const kit = findKit(slug);
  const base = kit?.title ?? `${toTitle(slug)} Kit`;
  return { title: base };
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/0 p-[1px]">
      <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2">
        <div className="text-[11px] uppercase tracking-wide text-zinc-400">{label}</div>
        <div className="text-sm">{value}</div>
      </div>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!isKitSlug(slug)) notFound();

  const kit = findKit(slug) as KitData | undefined;
  if (!kit) notFound();

  const title = kit.title ?? kitTitle(slug);
  const blurb =
    kit.tagline ||
    kit.blurb ||
    (slug === "resilient"
      ? "Built for daily carry. Energy, hydration, recovery, morale."
      : slug === "homefront"
      ? "Best for recovery. Rehydrate, restore, and rest."
      : "Mission-ready wellness essentials.");

  const weight = kit.weight_lb ?? "—";
  const heroImage = kit.imageUrl ?? kit.image;
  const heroAlt = kit.imageAlt ?? `${title} hero`;

  const prices = await getKitPrices();
  const priceOf = (v: Variant) => {
    const p = prices?.[slug]?.[v];
    return p ? formatUsd(p.unitAmount, p.currency) : undefined;
  };

  const bom = KITS_BOM[slug];
  const itemCount = bom.length;
  const skuCount = new Set(bom.map((i) => i.sku)).size;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-3xl border border-white/10"
        style={{ backgroundImage: grdFor(slug), backgroundColor: "rgb(9 9 11 / 0.65)" }}
      >
        <div className="grid gap-8 md:grid-cols-[1.1fr,480px]">
          {/* Copy + actions */}
          <div className="p-6 md:p-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
              <p className="text-zinc-300">{blurb}</p>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="tag">Daily{priceOf("daily") ? ` — ${priceOf("daily")}` : ""}</span>
                <span className="tag">10-Day{priceOf("10day") ? ` — ${priceOf("10day")}` : ""}</span>
                <span className="tag">30-Day{priceOf("30day") ? ` — ${priceOf("30day")}` : ""}</span>
              </div>

              <KitCheckoutForm kit={{ slug, title }} className="pt-1" />

              <div className="flex flex-wrap gap-3 pt-3">
                <Stat label="Weight" value={weight} />
                <Stat label="Items" value={itemCount} />
                <Stat label="SKUs" value={skuCount} />
              </div>

              <p className="pt-1 text-xs text-zinc-400">
                Every kit includes a <span className="font-medium">Morale Card</span>.
              </p>
            </div>
          </div>

          {/* Visual slot */}
          <div
            className="min-h-[260px] bg-zinc-900/40 md:min-h-[100%]"
            style={
              heroImage
                ? {
                    backgroundImage: `${imgMask()}, url("${heroImage}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
            aria-label={heroImage ? heroAlt : undefined}
            aria-hidden={heroImage ? undefined : true}
          />
        </div>
      </section>

      {/* Quantity breakdown (BOM) */}
      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-semibold">What’s inside</h2>

        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-950/60">
              <tr>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">Product</th>
                <th className="px-3 py-2 text-left">SKU</th>
                <th className="px-3 py-2 text-right">Daily</th>
                <th className="px-3 py-2 text-right">10-Day</th>
                <th className="px-3 py-2 text-right">30-Day</th>
                <th className="px-3 py-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {bom.map((it) => (
                <tr key={it.sku}>
                  <td className="px-3 py-2 whitespace-nowrap text-zinc-400">{it.category}</td>
                  <td className="px-3 py-2">{it.title}</td>
                  <td className="px-3 py-2 text-zinc-400">{it.sku}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{scaledQty(it, "daily")}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{scaledQty(it, "10day")}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{scaledQty(it, "30day")}</td>
                  <td className="px-3 py-2 text-zinc-400">{it.repack ? "Repacked. " : ""}{it.note ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="muted text-sm">{REPACK_POLICY}</p>

        <div className="pt-2">
          <Link href="/shop#kits" className="btn">Back to Shop</Link>
        </div>
      </section>
    </main>
  );
}
