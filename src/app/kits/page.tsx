// src/app/kits/page.tsx
import KitCard from "@/components/KitCard";
import { kits, type Kit } from "@/lib/kits";
import { heroForKit, statsForKit, subtitleForKit } from "@/lib/kits-helpers";

// Rebuild this static page at most once per day
export const revalidate = 86400;

function titleCase(s: string) {
  return s ? s.replace(/^\w/, (c) => c.toUpperCase()) : s;
}

function safeHeroForKit(
  slug: string,
  kit: Pick<Kit, "image" | "imageAlt" | "title" | "subtitle" | "description">
) {
  const h = heroForKit(slug, kit);
  const src =
    typeof h?.src === "string" && h.src.trim() ? h.src.trim() : "/kits/placeholder.svg";
  const alt =
    typeof h?.alt === "string" && h.alt.trim() ? h.alt.trim() : `${titleCase(slug)} hero image`;
  return { src, alt };
}

export default function KitsIndex() {
  const list = (kits as Kit[]).map((k) => ({
    slug: k.slug,
    title: k.title ?? `${titleCase(k.slug)} Kit`,
    subtitle: subtitleForKit(k.slug, k),
    stats: statsForKit(k),
    hero: safeHeroForKit(k.slug, k),
  }));

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Kits</h1>
        <p className="muted">Choose a kit and see everything inside.</p>
      </header>

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
    </section>
  );
}

