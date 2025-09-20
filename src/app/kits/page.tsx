// src/app/kits/page.tsx
import type { Metadata } from "next";
import KitCard from "@/components/KitCard";
import { kits, type Kit } from "@/lib/kits";
import { heroForKit, statsForKit, subtitleForKit, titleForKit } from "@/lib/kits-helpers";

// Rebuild this static page at most once per day
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Kits",
  description:
    "Choose a mission-first wellness kit and see everything inside — focus, hydration, recovery, and rest.",
};

export default function KitsIndex() {
  const list = (kits as Kit[]).map((k) => ({
    slug: k.slug,
    title: titleForKit(k.slug, k),
    subtitle: subtitleForKit(k.slug, k),
    stats: statsForKit(k),
    hero: heroForKit(k.slug, k),
  }));

  return (
    <section className="space-y-6" aria-labelledby="kits-title">
      <header className="space-y-2">
        <h1 id="kits-title" className="text-4xl font-extrabold tracking-tight">
          Kits
        </h1>
        <p className="muted">Choose a kit and see everything inside.</p>
      </header>

      {list.length === 0 ? (
        <div className="panel-elevated p-4 text-sm">
          <p className="muted">
            No kits available yet. Please check back soon.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {list.map((k) => (
            <li key={k.slug}>
              <KitCard
                slug={k.slug}
                title={k.title}
                hero={k.hero}
                subtitle={k.subtitle}
                stats={k.stats}
                showItemsLink
                layout="leftThumb"
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
