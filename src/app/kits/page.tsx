// src/app/kits/page.tsx
import Link from "next/link";
import { kits, type Kit } from "@/lib/kits";

function titleCase(s: string) {
  return s ? s.replace(/^\w/, (c) => c.toUpperCase()) : s;
}

type KitCard = {
  slug: string;
  title: string;
  subtitle?: string;
  itemsCount: number;
};

function toCards(data: Kit[]): KitCard[] {
  return data.map((k) => ({
    slug: k.slug,
    title: k.title ?? `${titleCase(k.slug)} Kit`,
    subtitle: k.subtitle ?? k.description ?? undefined,
    itemsCount: Array.isArray(k.items) ? k.items.length : 0,
  }));
}

export default function KitsIndex() {
  const cards = toCards(kits as Kit[]);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Kits</h1>
        <p className="muted">Choose a kit to view the contents and details.</p>
      </header>

      {cards.length === 0 ? (
        <div className="panel p-6">
          <p className="muted">No kits are published yet.</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {cards.map((k) => (
            <li
              key={k.slug}
              className="panel p-4 md:p-5 flex items-center justify-between gap-4"
            >
              <div className="min-w-0 space-y-1">
                <div className="font-semibold truncate">{k.title}</div>
                {k.subtitle ? (
                  <div className="muted text-sm truncate">{k.subtitle}</div>
                ) : null}
                {k.itemsCount > 0 ? (
                  <div className="text-xs text-zinc-500">
                    {k.itemsCount} {k.itemsCount === 1 ? "item" : "items"}
                  </div>
                ) : null}
              </div>

              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/kits/${k.slug}`}
                  className="btn-ghost"
                  aria-label={`View ${k.title}`}
                >
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
      )}
    </section>
  );
}
