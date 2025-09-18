import type { Metadata, Viewport } from "next";
import Link from "next/link";
import SpecGrid from "@/components/SpecGrid";
import CopySkus from "@/components/CopySkus";
import BuyLink from "@/components/BuyLink";
import { kits } from "@/lib/kits";

export const viewport: Viewport = { themeColor: "#0b0f10" };
export const metadata: Metadata = {
  title: "Resilient Kit � The Safety Plan",
  description: "Built for daily carry. Energy, hydration, recovery, morale.",
};
export const dynamic = "error";

type AnyRec = Record<string, unknown>;
type Spec = { label: string; value: string };

function getPath(obj: unknown, path: string[]): unknown {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur && typeof cur === "object" && key in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return cur;
}
const asString = (v: unknown, fallback: string) =>
  typeof v === "string" && v.trim() ? v : fallback;

function skusToItems(skus: unknown): { sku: string; quantity: number }[] {
  if (!Array.isArray(skus)) return [];
  return (skus as unknown[]).map((s) => ({ sku: String(s), quantity: 1 }));
}
function getKit(slug: string): AnyRec | null {
  const list = (kits as unknown) as AnyRec[];
  return Array.isArray(list) ? list.find((k) => k?.["slug"] === slug) ?? null : null;
}

export default function ResilientPage() {
  const kit = getKit("resilient");
  const title = asString(getPath(kit, ["title"]), "Resilient Kit");
  const weightRaw = getPath(kit, ["weight"]) ?? getPath(kit, ["specs", "weight"]);
  const weight =
    typeof weightRaw === "string" || typeof weightRaw === "number" ? String(weightRaw) : "-";
  const contentsAny = getPath(kit, ["contents"]) ?? getPath(kit, ["items"]);
  const contents = Array.isArray(contentsAny) ? (contentsAny as unknown[]) : [];
  const skus = (getPath(kit, ["skus"]) ?? getPath(kit, ["sku_list"])) as unknown;
  const copyItems = skusToItems(skus);

  const itemsCount = (contents?.length ?? 0) || copyItems.length;
  const specs: Spec[] = [
    { label: "Weight", value: weight },
    { label: "Items", value: String(itemsCount) },
    { label: "SKUs", value: String(copyItems.length) },
  ];

  return (
    <main id="content" className="container py-10 space-y-8 max-w-5xl">
      <header className="grid gap-6 md:grid-cols-[1.2fr_.8fr] items-start">
        <div className="space-y-4">
          <h1>{title}</h1>
          <p className="muted">Built for daily carry. Energy, hydration, recovery, morale.</p>
          <div className="flex flex-wrap gap-3">
            <BuyLink href="/r/resilient" className="btn" payload={{ slug: "resilient" }}>
              Buy now
            </BuyLink>
            <Link href="/kits/resilient/items" className="btn-ghost">View SKUs</Link>
            {copyItems.length ? <CopySkus items={copyItems} /> : null}
          </div>
          <div className="pt-2">
            <SpecGrid specs={specs} />
          </div>
        </div>

        <div className="panel-inset aspect-[4/3] rounded-xl grid place-items-center">
          <div className="preview-dot" />
          <div className="sr-only">Product preview placeholder</div>
        </div>
      </header>

      <section className="space-y-3">
        <h2>What&apos;s inside</h2>
        {!copyItems.length ? (
          <p className="muted text-sm">Item list coming soon.</p>
        ) : (
          <div className="panel p-4 rounded-xl border border-[var(--border)]">
            <div className="flex justify-between items-center mb-2">
              <div className="muted text-xs">Paste any SKU in your Amway search bar to add to cart.</div>
              <CopySkus items={copyItems} />
            </div>
            <ul className="grid gap-1 font-mono text-sm">
              {copyItems.map((row, i) => (
                <li key={i} className="flex items-center justify-between border-b border-[var(--border)]/50 pb-1">
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
        <Link href="/kits/resilient/items" className="btn-ghost">View SKUs</Link>
        {copyItems.length ? <CopySkus items={copyItems} /> : null}
      </div>
    </main>
  );
}

