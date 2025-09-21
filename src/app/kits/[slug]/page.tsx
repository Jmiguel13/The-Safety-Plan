import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { kits } from "@/lib/kits";
import KitCheckoutForm from "@/components/KitCheckoutForm";

export const revalidate = 86_400;

// ---------- Types ----------
type KitItem = {
  sku?: string;
  title?: string;
};

type KitData = {
  slug: string;
  title?: string;
  blurb?: string;
  tagline?: string;
  imageUrl?: string;
  items?: KitItem[];
  skus?: string[];
};

type Params = { slug: "resilient" | "homefront" | (string & {}) };

// ---------- Helpers ----------
function toTitle(s: string) {
  return s ? s.replace(/^\w/, (c) => c.toUpperCase()) : s;
}
function findKit(slug: string) {
  return (kits as KitData[]).find((k) => String(k.slug) === String(slug));
}
function grdFor(slug: string) {
  // Subtle, branded gradients per kit; works even without an image.
  if (slug === "resilient") {
    return "radial-gradient(1200px 500px at -10% -10%, rgba(16,185,129,0.18), transparent 65%), radial-gradient(900px 420px at 110% 20%, rgba(59,130,246,0.16), transparent 60%)";
  }
  if (slug === "homefront") {
    return "radial-gradient(1200px 500px at 0% 0%, rgba(56,189,248,0.18), transparent 65%), radial-gradient(900px 420px at 100% 15%, rgba(34,197,94,0.16), transparent 60%)";
  }
  return "radial-gradient(1100px 460px at 0% 0%, rgba(148,163,184,0.16), transparent 60%)";
}
function imgMask() {
  // Soft vignette for image slot if/when an image is supplied
  return "radial-gradient(circle at 60% 40%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)";
}

// ---------- Next metadata/types (Next 15 quirk) ----------
export async function generateStaticParams() {
  return (kits as Array<{ slug: string }>).map((k) => ({ slug: String(k.slug) }));
}
export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const kit = findKit(slug);
  const base = kit?.title ?? `${toTitle(slug)} Kit`;
  return { title: base };
}

// ---------- Small presentational bits ----------
function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-br from-white/10 to-white/0">
      <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2">
        <div className="text-[11px] uppercase tracking-wide text-zinc-400">{label}</div>
        <div className="text-sm">{value}</div>
      </div>
    </div>
  );
}
function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-[1px] bg-gradient-to-br from-white/10 to-white/0 ${className}`}>
      <div className="rounded-2xl border border-white/10 bg-zinc-950/60">{children}</div>
    </div>
  );
}

// ---------- Page ----------
export default async function Page(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const kit = findKit(slug);
  if (!kit) notFound();

  const title = kit.title ?? `${toTitle(slug)} Kit`;
  const blurb =
    kit.tagline ||
    kit.blurb ||
    (slug === "resilient"
      ? "Built for daily carry. Energy, hydration, recovery, morale."
      : slug === "homefront"
      ? "Best for recovery. Rehydrate, restore, and rest."
      : "Mission-ready wellness essentials.");

  const itemCount = Array.isArray(kit.items) ? kit.items.length : 0;
  const skuCount = Array.isArray(kit.skus) ? new Set(kit.skus.map(String)).size : 0;
  const supportsStripe = slug === "resilient" || slug === "homefront";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <section
        className="relative rounded-3xl border border-white/10 overflow-hidden"
        style={{ backgroundImage: grdFor(slug), backgroundColor: "rgb(9 9 11 / 0.65)" }}
      >
        <div className="grid gap-8 md:grid-cols-[1.1fr,480px]">
          {/* Copy + actions */}
          <div className="p-6 md:p-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
              <p className="text-zinc-300">{blurb}</p>

              {/* Single buy control (Stripe bundle picker) */}
              {supportsStripe ? (
                <KitCheckoutForm
                  kit={{ slug: slug as "resilient" | "homefront", title }}
                  className="pt-1"
                />
              ) : null}

              {/* Stats */}
              <div className="flex flex-wrap gap-3 pt-3">
                <Stat label="Weight" value="—" />
                <Stat label="Items" value={itemCount} />
                <Stat label="SKUs" value={skuCount} />
              </div>

              <p className="text-xs text-zinc-400 pt-1">
                Every kit includes a <span className="font-medium">Morale Card</span>.
              </p>
            </div>
          </div>

          {/* Visual slot */}
          <div
            className="min-h-[260px] md:min-h-[100%] bg-zinc-900/40"
            style={{
              // If you later add kit.imageUrl, this mask keeps edges soft
              backgroundImage: kit.imageUrl
                ? `${imgMask()}, url("${kit.imageUrl}")`
                : undefined,
              backgroundSize: kit.imageUrl ? "cover" : undefined,
              backgroundPosition: kit.imageUrl ? "center" : undefined,
            }}
            aria-hidden="true"
          />
        </div>
      </section>

      {/* Contents */}
      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-semibold">What&rsquo;s inside</h2>

        {itemCount === 0 ? (
          <p className="muted">Item list coming soon.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {kit.items!.map((i: KitItem, idx: number) => (
              <li key={`${i.sku ?? idx}`}>
                <Panel>
                  <div className="p-3">
                    <div className="font-medium truncate">{i.title ?? i.sku ?? "Item"}</div>
                    {i.sku ? (
                      <div className="text-xs text-zinc-500 mt-0.5">SKU {i.sku}</div>
                    ) : null}
                  </div>
                </Panel>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
