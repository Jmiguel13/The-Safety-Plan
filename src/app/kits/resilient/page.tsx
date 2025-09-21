// src/app/kits/resilient/page.tsx
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import SpecGrid from "@/components/SpecGrid";
import CopySkus from "@/components/CopySkus";
import BuyLink from "@/components/BuyLink";
import { kits } from "@/lib/kits";

export const viewport: Viewport = { themeColor: "#0b0f10" };
export const metadata: Metadata = {
  title: "Resilient Kit — The Safety Plan",
  description: "Built for daily carry. Energy, hydration, recovery, morale.",
};
export const dynamic = "error";

type Kit = {
  slug: string;
  title?: string;
  weight?: string | number;
  specs?: { weight?: string | number };
  contents?: unknown[];
  items?: unknown[];
  skus?: unknown[];
  sku_list?: unknown[];
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}
function getKitBySlug(slug: string): Kit | null {
  const list = Array.isArray(kits) ? (kits as unknown[]) : [];
  const match = list.find((k) => isRecord(k) && k.slug === slug);
  return (match as Kit) ?? null;
}
function asNonEmptyString(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim() ? v : fallback;
}
function toStringOrDash(v: unknown): string {
  if (typeof v === "string" && v.trim()) return v;
  if (typeof v === "number") return String(v);
  return "-";
}
function toStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x));
}
function skusToItems(skus: string[]): { sku: string; quantity: number }[] {
  return skus.map((sku) => ({ sku, quantity: 1 }));
}

export default function ResilientPage() {
  const kit = getKitBySlug("resilient");

  const title = asNonEmptyString(kit?.title, "Resilient Kit");
  const weight = toStringOrDash(
    kit?.weight ?? kit?.specs?.weight
  );

  const contents = (Array.isArray(kit?.contents) ? kit?.contents : kit?.items) ?? [];
  const skus = toStringArray(kit?.skus ?? kit?.sku_list);
  const copyItems = skusToItems(skus);

  const itemsCount = (Array.isArray(contents) ? contents.length : 0) || copyItems.length;

  const specs = [
    { label: "Weight", value: weight },
    { label: "Items", value: String(itemsCount) },
    { label: "SKUs", value: String(copyItems.length) },
  ];

  return (
    <main id="content" className="container max-w-5xl space-y-8 py-10">
      <header className="grid items-start gap-6 md:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-4">
          <h1>{title}</h1>
          <p className="muted">
            Built for daily carry. Energy, hydration, recovery, morale.
          </p>

          <div className="flex flex-wrap gap-3">
            <BuyLink href="/r/resilient" className="btn" payload={{ slug: "resilient" }}>
              Buy now
            </BuyLink>
            <Link href="/kits/resilient/items" className="btn-ghost">
              View SKUs
            </Link>
            {copyItems.length > 0 ? <CopySkus items={copyItems} /> : null}
          </div>

          <div className="pt-2">
            <SpecGrid specs={specs} />
          </div>
        </div>

        <div className="panel-inset grid aspect-[4/3] place-items-center rounded-xl">
          <div className="preview-dot" />
          <div className="sr-only">Product preview placeholder</div>
        </div>
      </header>

      <section className="space-y-3">
        <h2>What&apos;s inside</h2>

        {copyItems.length === 0 ? (
          <p className="muted text-sm">Item list coming soon.</p>
        ) : (
          <div className="panel rounded-xl border border-[var(--border)] p-4">
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
        )}
      </section>

      <div className="divider" />

      <div className="flex flex-wrap gap-3">
        <BuyLink href="/r/resilient" className="btn" payload={{ slug: "resilient" }}>
          Buy now
        </BuyLink>
        <Link href="/kits/resilient/items" className="btn-ghost">
          View SKUs
        </Link>
        {copyItems.length > 0 ? <CopySkus items={copyItems} /> : null}
      </div>
    </main>
  );
}
