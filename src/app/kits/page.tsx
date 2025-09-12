// src/app/kits/page.tsx
import Link from "next/link";
import { kits, type Kit } from "@/lib/kits";

function titleCase(s: string) {
  return s ? s.replace(/^\w/, (c) => c.toUpperCase()) : s;
}

function statsFor(k: Kit) {
  const items = Array.isArray(k.items) ? k.items : [];
  const itemCount = items.length;
  const skuCount = new Set(items.map((i) => String(i.sku))).size;
  return { itemCount, skuCount };
}

export default function KitsIndex() {
  const list = (kits as Kit[]).map((k) => ({
    slug: k.slug,
    title: k.title ?? `${titleCase(k.slug)} Kit`,
    subtitle: k.subtitle ?? k.description ?? undefined,
    stats: statsFor(k),
  }));

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Kits</h1>
        <p className="muted">Choose a kit and see everything inside.</p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {list.map((k) => (
          <li key={k.slug} className="panel p-4 flex items-center justify-between">
            <div className="min-w-0">
              <div className="font-medium truncate">{k.title}</div>
              {k.subtitle ? (
                <div className="muted text-sm truncate">{k.subtitle}</div>
              ) : (
                <div className="muted text-sm">
                  {k.stats.itemCount} items • {k.stats.skuCount} SKUs
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Link href={`/kits/${k.slug}`} className="btn-ghost" aria-label={`View ${k.title}`}>
                View
              </Link>
              <Link
                href={`/kits/${k.slug}/items`}
                className="btn-ghost"
                aria-label={`View items in ${k.title}`}
              >
                View items
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
