// src/app/kits/page.tsx
import Link from "next/link";
import { kits, type Kit } from "@/lib/kits";
import { statsForKit, subtitleForKit } from "@/lib/kits-helpers";

export const dynamic = "force-dynamic";

function fallbackTitle(slug: string, title?: string) {
  if (title) return title;
  const t = slug ? slug[0].toUpperCase() + slug.slice(1) : "Kit";
  return `${t} Kit`;
}

export default function KitsIndex() {
  const list = (kits as Kit[]).map((k) => {
    const stats = statsForKit(k);
    return {
      slug: k.slug,
      title: fallbackTitle(k.slug, k.title),
      subtitle: subtitleForKit(k.slug, k),
      stats,
    };
  });

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
              <div className="muted text-sm truncate">
                {k.subtitle ? (
                  <span className="line-clamp-1">{k.subtitle}</span>
                ) : (
                  <span>
                    {k.stats.itemCount} items • {k.stats.skuCount} SKUs
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href={`/kits/${k.slug}`} className="btn-ghost" aria-label={`View ${k.title}`}>
                View
              </Link>
              <Link
                href={`/kits/${k.slug}/items`}
                className="btn-ghost"
                aria-label={`View items in ${k.title}`}
              >
                Items
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
