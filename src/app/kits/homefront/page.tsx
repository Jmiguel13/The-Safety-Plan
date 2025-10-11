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
  title: "Homefront Kit — The Safety Plan",
  description: "Best for recovery. Rehydrate, restore, and rest.",
};

// ---- Types ----
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

// ---- Helpers ----
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
  return "radial-gradient(1200px 500px at 0% 0%, rgba(56,189,248,0.18), transparent 65%), radial-gradient(900px 420px at 100% 15%, rgba(34,197,94,0.16), transparent 60%)";
}

export default function HomefrontPage() {
  const kit = getKitBySlug("homefront");
  const title = asNonEmptyString(kit?.title, "Homefront Kit");
  const weight = toStringOrDash(kit?.weight ?? kit?.specs?.weight);

  const contents: KitItem[] =
    (Array.isArray(kit?.contents) ? kit?.contents : kit?.items) ?? [];
  const skus = toStringArray(kit?.skus ?? kit?.sku_list);
  const copyItems = skusToItems(skus);

  const itemsCount =
    (Array.isArray(contents) ? contents.length : 0) || copyItems.length;

  const specs = [
    { label: "Weight", value: weight },
    { label: "Items", value: String(itemsCount) },
    { label: "SKUs", value: String(copyItems.length) },
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
            Best for recovery. Rehydrate, restore, and rest.
          </p>

          {/* Client checkout */}
          <KitCheckoutForm kit={{ slug: "homefront", title }} className="pt-3" />

          {/* Scaling hint (scrubbed wording) */}
          <p className="mt-2 text-xs text-zinc-500">
            Quantities scale by duration. Energy drinks are portioned by the selected duration
            (1 can, 10 cans, or 30 cans). Daily cans are included in your kit and not added to your MyShop cart.
          </p>

          {/* Specs */}
          <div className="pt-3">
            <SpecGrid specs={specs} />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/kits/homefront/items" className="btn-ghost">
              View SKUs
            </Link>
            {copyItems.length > 0 ? <CopySkus items={copyItems} /> : null}
          </div>
        </div>
      </section>

      {/* Contents */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">What&rsquo;s inside</h2>

        {copyItems.length === 0 ? (
          <p className="muted text-sm">Item list coming soon.</p>
        ) : (
          <div className="panel rounded-2xl border border-[var(--border)] p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="muted text-xs">
                Paste any SKU into your <strong>MyShop</strong> search bar to add to cart.
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
        )}
      </section>
    </main>
  );
}
