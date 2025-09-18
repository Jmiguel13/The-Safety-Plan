// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { MYSHOP_BASE } from "@/lib/amway";
import { kits, type Kit } from "@/lib/kits";
import { heroForKit, statsForKit } from "@/lib/kits-helpers";

/** Title-case helper */
function titleCase(s: string) {
  return s ? s.replace(/^\w/, (c) => c.toUpperCase()) : s;
}

/** Safe hero for kits (prevents crashes if an image is missing) */
function safeHeroForKit(
  slug: string,
  kit: Pick<Kit, "image" | "imageAlt" | "title" | "subtitle" | "description">
) {
  const h = heroForKit(slug, kit);
  const src =
    typeof h?.src === "string" && h.src.trim()
      ? h.src.trim()
      : "/kits/placeholder.svg";
  const alt =
    typeof h?.alt === "string" && h.alt.trim()
      ? h.alt.trim()
      : `${titleCase(slug)} hero image`;
  return { src, alt };
}

export default function Home() {
  // Page-level hero (swap to a real photo later if desired)
  const heroSrc = "/images/hero-soft.svg"; // ensure this exists in /public/images
  const heroAlt = "Service members supporting one another — The Safety Plan";

  const pillars = [
    { label: "Focus",     value: "Clean energy",   blurb: "XS™ formulas to stay sharp without the crash." },
    { label: "Hydration", value: "Electrolytes",   blurb: "Rapid mix packets for on-the-move use." },
    { label: "Recovery",  value: "Core nutrients", blurb: "Nutrilite™ essentials that travel well." },
  ] as const;

  const featured = (kits as Kit[]).slice(0, 2).map((k) => ({
    slug: k.slug,
    title: k.title ?? `${titleCase(k.slug)} Kit`,
    hero: safeHeroForKit(k.slug, k),
    stats: statsForKit(k),
    subtitle: k.subtitle ?? k.description ?? "",
  }));

  return (
    <section className="space-y-12 max-w-6xl mx-auto">
      {/* =============================== HERO =============================== */}
      <header className="overflow-hidden rounded-2xl border border-[var(--border)] bg-grid">
        <div className="grid md:grid-cols-2">
          {/* Left: copy & CTAs */}
          <div className="p-8 md:p-12">
            <div className="tag tag-accent w-max mb-4">Mission-first</div>

            <h1
              className="text-balance font-extrabold tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 5vw, 3.25rem)", lineHeight: 1.05 }}
            >
              The Safety Plan
            </h1>

            <p className="muted mt-3 text-lg md:text-xl max-w-prose">
              Wellness kits for focus, hydration, recovery, and rest — built for real-world use.
              Every purchase supports veteran suicide prevention and frontline support.
            </p>

            {/* Discreet stat callout */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-yellow-500/25 bg-yellow-500/10 px-3 py-1.5 text-sm text-yellow-200">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-300" aria-hidden="true" />
              <span className="font-medium">
                Every <span className="tabular-nums">7</span> minutes, one veteran takes their life.
              </span>
            </div>

            {/* Two primary actions only */}
            <div className="flex flex-wrap gap-3 pt-6">
              <Link href="/kits" className="btn">Explore Kits</Link>
              <Link href="/donate" className="btn-ghost">Donate</Link>
            </div>

            {/* Subtle storefront link */}
            <div className="pt-3">
              <a
                href={MYSHOP_BASE}
                target="_blank"
                rel="noopener noreferrer"
                className="link-chip"
                aria-label="Open our official Amway storefront"
              >
                Shop on Amway →
              </a>
            </div>
          </div>

          {/* Right: hero art */}
          <div className="relative h-64 md:h-auto">
            <Image
              src={heroSrc}
              alt={heroAlt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
              unoptimized={heroSrc.endsWith(".svg")}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/15 to-transparent" />
          </div>
        </div>
      </header>

      {/* ============================ VALUE PILLARS ============================ */}
      <section className="grid gap-3 sm:grid-cols-3">
        {pillars.map((p) => (
          <div key={p.label} className="panel-inset p-4">
            <div className="text-xs uppercase tracking-wide text-zinc-400">{p.label}</div>
            <div className="mt-0.5 font-medium">{p.value}</div>
            <p className="muted text-sm mt-1">{p.blurb}</p>
          </div>
        ))}
      </section>

      {/* ============================ FEATURED KITS ============================ */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Featured kits</h2>
          <Link href="/kits" className="btn-ghost text-sm">View all</Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {featured.map((k) => (
            <li key={k.slug} className="panel overflow-hidden">
              <div className="relative aspect-[16/9]">
                <Image
                  src={k.hero.src}
                  alt={k.hero.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 50vw, 100vw"
                  unoptimized={k.hero.src.endsWith(".svg")}
                />
              </div>
              <div className="p-4 space-y-1">
                <div className="font-medium">{k.title}</div>
                <div className="muted text-sm">
                  {k.subtitle ? k.subtitle : `${k.stats.itemCount} items • ${k.stats.skuCount} SKUs`}
                </div>
                <div className="pt-2">
                  <Link href={`/kits/${k.slug}`} className="btn">View kit</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* =============================== CTA BAND ============================== */}
      <section className="panel-elevated p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">Built for the mission</h3>
          <p className="muted max-w-prose">
            We design kits that work in rucks, glove boxes, and go-bags. Clean ingredients, compact
            formats, and practical selections — so your team has what it needs when it matters.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/kits" className="btn">Browse Kits</Link>
        </div>
      </section>
    </section>
  );
}
