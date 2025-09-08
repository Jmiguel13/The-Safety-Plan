// src/app/kits/page.tsx
import Link from "next/link";
import { kits } from "@/lib/kits";

type KitLite = {
  slug: string;
  title?: string;
  items?: Array<{ sku: string; qty?: number }>;
  skus?: string[];
};

function titleCase(s: string) {
  return s ? s.replace(/^\w/, (c) => c.toUpperCase()) : s;
}

function counts(k: KitLite) {
  const itemCount = Array.isArray(k.items) ? k.items.length : Array.isArray(k.skus) ? k.skus.length : 0;
  const skuSet = Array.isArray(k.items)
    ? new Set(k.items.map((i) => String(i.sku)))
    : new Set((Array.isArray(k.skus) ? k.skus : []).map(String));
  return { itemCount, skuCount: skuSet.size };
}

export const dynamic = "force-dynamic";

export default function KitsIndexPage() {
  const data = (kits as unknown as KitLite[]).map((k) => ({
    slug: k.slug,
    title: k.title ?? `${titleCase(k.slug)} Kit`,
    ...counts(k),
  }));

  return (
    <section className="space-y-8 max-w-4xl">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Kits</h1>
        <p className="muted">Curated bundles for energy, hydration, recovery, and rest.</p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {data.map((k) => (
          <li key={k.slug} className="panel p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{k.title}</div>
              <div className="muted text-sm">{k.itemCount} items • {k.skuCount} SKUs</div>
            </div>
            <div className="flex gap-2">
              <Link href={`/kits/${k.slug}`} className="btn-ghost">View</Link>
              <Link href={`/r/${k.slug}`} className="btn">Buy</Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
