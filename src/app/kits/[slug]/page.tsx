import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { kits } from "@/lib/kits";
import KitCheckoutForm from "@/components/KitCheckoutForm";
import KitThumb from "@/components/KitThumb";
import {
  KITS_BOM,
  type KitSlug,
  kitTitle,
  scaledQty,
  REPACK_POLICY,
} from "@/lib/kits-bom";
import { getKitPrices, formatUsd, type Variant } from "@/lib/kit-pricing";
import { buildMyShopUrlWithUtm } from "@/lib/site";
import { BRAND, CONTACT } from "@/lib/blank";

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

/** Softer background without harsh bands */
function grdFor(slug: string) {
  if (slug === "resilient") {
    return [
      "radial-gradient(1200px 520px at -10% -10%, rgba(16,185,129,0.14), transparent 65%)",
      "radial-gradient(900px 420px at 110% 20%, rgba(59,130,246,0.12), transparent 60%)",
      "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.015) 60%, transparent 100%)",
    ].join(", ");
  }
  if (slug === "homefront") {
    return [
      "radial-gradient(1200px 520px at 0% 0%, rgba(56,189,248,0.14), transparent 65%)",
      "radial-gradient(900px 420px at 100% 15%, rgba(34,197,94,0.12), transparent 60%)",
      "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.015) 60%, transparent 100%)",
    ].join(", ");
  }
  return [
    "radial-gradient(1100px 460px at 0% 0%, rgba(148,163,184,0.14), transparent 60%)",
    "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.015) 60%, transparent 100%)",
  ].join(", ");
}

function isKitSlug(s: string): s is KitSlug {
  return s === "resilient" || s === "homefront";
}

/** Remove the word "sticks" and tidy whitespace/punctuation in notes. */
function cleanNote(note?: string) {
  if (!note) return "";
  return note
    .replace(/\bsticks\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s([,.;:!?])/g, "$1")
    .trim();
}

export async function generateStaticParams() {
  return (kits as Array<{ slug: string }>).map((k) => ({ slug: String(k.slug) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const kit = findKit(slug);
  const base = kit?.title ?? `${toTitle(slug)} Kit`;
  return { title: base };
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/0 p-[1px]">
      <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2">
        <div className="text-[11px] uppercase tracking-wide text-zinc-400">
          {label}
        </div>
        <div className="text-sm">{value}</div>
      </div>
    </div>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
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

  // Prefer explicit image from data; otherwise try conventional SVG in /public
  const heroSrc = kit.imageUrl || kit.image || `/images/kits/${slug}-hero.svg`;
  const heroAlt = kit.imageAlt ?? `${title} hero`;

  // --- Prices (for badges + live preview in the form) ---
  const prices = await getKitPrices();
  const priceOf = (v: Variant) => {
    const p = prices?.[slug]?.[v];
    return p ? formatUsd(p.unitAmount, p.currency) : undefined;
  };

  // Coerce null → undefined for the component prop type
  const kitPrices = prices?.[slug];
  const kitPricesSafe: Partial<
    Record<Variant, { unitAmount: number; currency: string }>
  > = {
    daily: kitPrices?.daily ?? undefined,
    "10day": kitPrices?.["10day"] ?? undefined,
    "30day": kitPrices?.["30day"] ?? undefined,
  };

  const bom = KITS_BOM[slug];
  const itemCount = bom.length;
  const skuCount = new Set(bom.map((i) => i.sku)).size;

  // MyShop link (kept on kits page)
  const myShopHref = buildMyShopUrlWithUtm();

  return (
    <main className="container py-10">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-3xl border border-white/10"
        style={{
          backgroundImage: grdFor(slug),
          backgroundColor: "rgb(9 9 11 / 0.65)",
        }}
      >
        <div className="grid gap-8 md:grid-cols-[1.05fr,520px]">
          {/* Copy + actions */}
          <div className="p-6 md:p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  {title}
                </h1>
                {/* Built by BLANK badge */}
                <span className="hidden shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-wide text-zinc-300 sm:inline-flex">
                  Built by {BRAND.name}
                </span>
              </div>

              <p className="text-zinc-300">{blurb}</p>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="tag">
                  Daily{priceOf("daily") ? ` — ${priceOf("daily")}` : ""}
                </span>
                <span className="tag">
                  10-Day{priceOf("10day") ? ` — ${priceOf("10day")}` : ""}
                </span>
                <span className="tag">
                  30-Day{priceOf("30day") ? ` — ${priceOf("30day")}` : ""}
                </span>
              </div>

              {/* Pass prices for live total preview in the form */}
              <KitCheckoutForm
                kit={{ slug, title }}
                prices={kitPricesSafe}
                className="pt-1"
              />

              {/* Keep Open MyShop here + helper line (matches price hint style) */}
              <div className="pt-3">
                <a
                  href={myShopHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  Open MyShop
                </a>
                <div className="mt-1 text-xs text-zinc-500">
                  For individual product purchases
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                <Stat label="Weight" value={weight} />
                <Stat label="Items" value={itemCount} />
                <Stat label="SKUs" value={skuCount} />
              </div>

              {/* Mobile-only "Built by" so it doesn't cramp the H1 */}
              <p className="pt-1 text-xs text-zinc-400 sm:hidden">
                Assembled by <span className="font-medium">{BRAND.name}</span>. Every
                kit includes a <span className="font-medium">Morale Card</span>.
              </p>
              {/* Desktop variant keeps the closing line but without repeating the brand */}
              <p className="hidden pt-1 text-xs text-zinc-400 sm:block">
                Every kit includes a <span className="font-medium">Morale Card</span>.
              </p>
            </div>
          </div>

          {/* Visual slot — centered, padded, no watermark for a cleaner read */}
          <div className="relative min-h-[340px] bg-zinc-900/40 md:min-h-[500px]">
            {/* gentle inner glows so the mark doesn't feel stuck on a flat panel */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(28rem 18rem at 30% 70%, rgba(56,189,248,.10), transparent), radial-gradient(26rem 16rem at 80% 25%, rgba(16,185,129,.08), transparent)",
              }}
            />
            <div className="absolute inset-0">
              <KitThumb
                src={heroSrc || null}
                alt={heroAlt}
                fit="contain"
                padding="p-10 md:p-14"
                zoom={1.30}
                className="h-full w-full rounded-none border-0 bg-transparent"
              />
            </div>
          </div>
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
              {KITS_BOM[slug].map((it) => {
                const noteCombined = `${it.repack ? "Repacked. " : ""}${it.note ?? ""}`;
                const noteClean = cleanNote(noteCombined);
                return (
                  <tr key={it.sku}>
                    <td className="whitespace-nowrap px-3 py-2 text-zinc-400">
                      {it.category}
                    </td>
                    <td className="px-3 py-2">{it.title}</td>
                    <td className="px-3 py-2 text-zinc-400">{it.sku}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {scaledQty(it, "daily")}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {scaledQty(it, "10day")}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {scaledQty(it, "30day")}
                    </td>
                    <td className="px-3 py-2 text-zinc-400">{noteClean}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="muted text-sm">
          {REPACK_POLICY}
          {(CONTACT.email || CONTACT.phone) ? (
            <>
              {" "}
              For questions, contact{" "}
              {CONTACT.email ? (
                <a className="underline" href={`mailto:${CONTACT.email}`}>
                  {CONTACT.email}
                </a>
              ) : null}
              {CONTACT.email && CONTACT.phone ? " • " : null}
              {CONTACT.phone ? <span>{CONTACT.phone}</span> : null}.
            </>
          ) : null}
        </p>

        <div className="pt-2">
          <Link href="/shop#kits" className="btn">
            Back to Shop
          </Link>
        </div>
      </section>
    </main>
  );
}
