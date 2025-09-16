// src/app/page.tsx
import Link from "next/link";
import NextImage from "next/image"; // <-- alias to avoid any shadowing
import { MYSHOP_BASE } from "@/lib/amway";
import { kits, type Kit } from "@/lib/kits";
import { heroForKit, statsForKit } from "@/lib/kits-helpers";

function titleCase(s: string) {
  return s ? s.replace(/^\w/, (c) => c.toUpperCase()) : s;
}

export default function Home() {
  const featured = (kits as Kit[]).slice(0, 2).map((k) => {
    const hero = heroForKit(k.slug, k); // always returns { src, alt }
    return {
      slug: k.slug,
      title: k.title ?? `${titleCase(k.slug)} Kit`,
      hero,
      stats: statsForKit(k),
      subtitle: k.subtitle ?? k.description ?? "",
    };
  });

  return (
    <section className="space-y-10 max-w-6xl mx-auto">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-b from-zinc-900/50 to-black p-8">
        <div className="space-y-4 max-w-2xl">
          <div className="tag tag-accent w-max">Mission-first</div>
          <h1 className="text-balance text-5xl font-extrabold tracking-tight">
            The Safety Plan
          </h1>
          <p className="muted text-lg">
            Wellness kits for focus, hydration, recovery, and rest — built for real-world use.
            Every purchase supports veteran suicide prevention and frontline support.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/kits" className="btn">Explore Kits</Link>
            <Link href="/donate" className="btn-ghost">Donate</Link>
            <a
              className="btn-ghost"
              href={MYSHOP_BASE}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open our official Amway storefront"
            >
              Open Storefront
            </a>
          </div>
        </div>
      </header>

      {/* Value pillars */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="panel p-4">
          <div className="label">Focus</div>
          <div className="value">Clean energy</div>
          <p className="muted text-sm">XS™ formulas to stay sharp without the crash.</p>
        </div>
        <div className="panel p-4">
          <div className="label">Hydration</div>
          <div className="value">Electrolytes</div>
          <p className="muted text-sm">Rapid mix packets for on-the-move use.</p>
        </div>
        <div className="panel p-4">
          <div className="label">Recovery</div>
          <div className="value">Core nutrients</div>
          <p className="muted text-sm">Nutrilite™ essentials that travel well.</p>
        </div>
      </div>

      {/* Featured kits */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Featured kits</h2>
          <Link href="/kits" className="btn-ghost text-sm">View all</Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {featured.map((k) => (
            <li key={k.slug} className="panel p-0 overflow-hidden">
              <div className="grid grid-cols-[136px_1fr]">
                {/* Thumb */}
                <div className="relative aspect-square">
                  <NextImage
                    src={k.hero.src}
                    alt={k.hero.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 136px, 40vw"
                    priority={false}
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2 min-w-0">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{k.title}</div>
                    <div className="muted text-sm truncate">
                      {k.subtitle
                        ? k.subtitle
                        : `${k.stats.itemCount} items • ${k.stats.skuCount} SKUs`}
                    </div>
                  </div>
                  <div className="mt-1 flex gap-2">
                    <Link href={`/kits/${k.slug}`} className="btn">View kit</Link>
                    <Link href={`/kits/${k.slug}/items`} className="btn-ghost">Items</Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Mission blurb */}
      <div className="panel-elevated p-6 space-y-2">
        <h2 className="text-xl font-semibold">Built for the mission</h2>
        <p className="muted">
          We design kits that work in rucks, glove boxes, and go-bags. Clean ingredients, compact
          formats, and practical selections — so your team has what it needs when it matters.
        </p>
      </div>
    </section>
  );
}
