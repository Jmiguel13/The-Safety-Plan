import type { Metadata, Viewport } from "next";
import Link from "next/link";
import SpecGrid from "@/components/SpecGrid";
import CopySkus from "@/components/CopySkus";
import KitCheckoutForm from "@/components/KitCheckoutForm";
import { kits } from "@/lib/kits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const viewport: Viewport = { themeColor: "#0b0f10" };
export const metadata: Metadata = {
  title: "Resilient Kit — The Safety Plan",
  description: "Built for daily carry. Energy, hydration, recovery, morale.",
};

// ---------- Types ----------
type KitItem = { sku?: string; title?: string; qty?: number };
type Kit = {
  slug: string;
  title?: string;
  weight?: string | number;
  specs?: { weight?: string | number };
  contents?: KitItem[];
  items?: KitItem[];
  skus?: Array<string | number>;
  sku_list?: Array<string | number>;
  imageUrl?: string;
};

// ---------- Helpers ----------
function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}
function getKitBySlug(slug: string): Kit | null {
  const list = Array.isArray(kits) ? (kits as unknown[]) : [];
  const match = list.find((k) => isRecord(k) && (k as Kit).slug === slug);
  return (match as Kit) ?? null;
}
function asNonEmptyString(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim() ? v : fallback;
}
function toStringOrDash(v: unknown): string {
  if (typeof v === "string" && v.trim()) return v;
  if (typeof v === "number") return String(v);
  return "—";
}
function toStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x));
}
function skusToItems(skus: string[]): { sku: string; quantity: number }[] {
  return skus.map((sku) => ({ sku, quantity: 1 }));
}
function grd() {
  return "radial-gradient(1200px 500px at -10% -10%, rgba(16,185,129,0.18), transparent 65%), radial-gradient(900px 420px at 110% 20%, rgba(59,130,246,0.16), transparent 60%)";
}

export default function ResilientPage() {
  const kit = getKitBySlug("resilient");
  const title = asNonEmptyString(kit?.title, "Resilient Kit");
  const weight = toStringOrDash(kit?.weight ?? kit?.specs?.weight);

  const items: KitItem[] =
    (Array.isArray(kit?.contents) ? kit?.contents : kit?.items) ?? [];
  const skus = toStringArray(kit?.skus ?? kit?.sku_list);
  const copyItems = skusToItems(skus);

  const itemsCount = items.length || copyItems.length;

  const specs = [
    { label: "Weight", value: weight },
    { label: "Items", value: String(itemsCount) },
    { label: "SKUs", value: String(skus.length) },
  ];

  return (
    <main id="content" className="container max-w-6xl space-y-10 py-10">
      {/* Header block (no hero image) */}
      <section
        className="relative overflow-hidden rounded-3xl border border-white/10"
        style={{ backgroundImage: grd(), backgroundColor: "rgb(9 9 11 / 0.65)" }}
      >
        <div className="p-6 md:p-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {title}
          </h1>
          <p className="muted mt-2">
            Built for daily carry. Energy, hydration, recovery, morale.
          </p>

          <KitCheckoutForm kit={{ slug: "resilient", title }} className="pt-3" />

          <div className="pt-3">
            <SpecGrid specs={specs} />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/kits/resilient/items" className="btn-ghost">
              View SKUs
            </Link>
            {copyItems.length > 0 ? <CopySkus items={copyItems} /> : null}
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">What&rsquo;s inside</h2>

        {items.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((i, idx) => (
              <li key={`${i.sku ?? idx}`}>
                <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-3">
                  <div className="font-medium truncate">
                    {i.title ?? i.sku ?? "Item"}
                  </div>
                  {i.sku ? (
                    <div className="mt-0.5 text-xs text-zinc-500">
                      SKU {i.sku}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : copyItems.length > 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-zinc-950/60 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="muted text-xs">
                Paste any SKU in your Amway search bar to add to cart.
              </div>
              <CopySkus items={copyItems} />
            </div>
            <ul className="grid gap-1 font-mono text-sm">
              {copyItems.map((row) => (
                <li
                  key={row.sku}
                  className="flex items-center justify-between border-b border-[var(--border)]/50 pb-1"
                >
                  <span>{row.sku}</span>
                  <span className="muted">x{row.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="muted text-sm">Item list coming soon.</p>
        )}
      </section>
    </main>
  );
}
