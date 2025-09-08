import Link from "next/link";
import { myShopLink } from "@/lib/amway";

export const viewport = { themeColor: "#0b0f10" };
export const dynamic = "error";

export default function HomePage() {
  return (
    <main className="space-y-10">
      {/* Hero */}
      <section
        className="grid items-center gap-8 md:grid-cols-[1.2fr_.8fr]"
        aria-labelledby="hero-title"
      >
        <div className="space-y-4">
          <span className="tag tag-accent w-max" aria-label="Mission Ready">
            Mission Ready
          </span>

          <h1 id="hero-title" className="leading-tight">
            Wellness Kits for Focused Lives
          </h1>

          <p className="muted max-w-xl">
            Clean energy, hydration, recovery, rest. Every purchase supports veteran suicide prevention resources.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-1" aria-label="Primary actions">
            <Link href="/kits" className="btn">Explore Kits</Link>
            <Link href="/donate" className="btn-ghost">Donate</Link>
            <a
              href={myShopLink("/", "hero")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Open Storefront
            </a>
            <Link href="/faq#veteran-awareness" className="tag">Line Check</Link>
          </div>
        </div>

        {/* Polished hero preview + stats */}
        <div className="panel p-5 hidden md:block">
          <div
            className="preview-surface bg-grid aspect-[4/3] rounded-lg border border-[var(--border)] overflow-hidden grid place-items-center"
            aria-label="Kit preview"
          >
            <div className="pulse-dot" />
            <div className="sr-only">Preview area</div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="panel p-3">
              <div className="stat" role="group" aria-label="Weight">
                <div className="label">Weight</div>
                <div className="value">1.2 lb</div>
              </div>
            </div>
            <div className="panel p-3">
              <div className="stat" role="group" aria-label="Durability">
                <div className="label">Durability</div>
                <div className="value">IP54</div>
              </div>
            </div>
            <div className="panel p-3">
              <div className="stat" role="group" aria-label="Contents">
                <div className="label">Contents</div>
                <div className="value">12 items</div>
              </div>
            </div>
            <div className="panel p-3">
              <div className="stat" role="group" aria-label="Support">
                <div className="label">Support</div>
                <div className="value">24/7</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" role="separator" aria-hidden="true" />

      {/* Featured kits */}
      <section className="grid gap-4 md:grid-cols-3" aria-labelledby="featured-kits">
        <h2 id="featured-kits" className="sr-only">Featured Kits</h2>

        <article className="card-tactical">
          <h3 className="text-xl font-semibold">Resilient</h3>
          <p className="muted text-sm mt-1">Daily carry energy and recovery.</p>
          <div className="mt-3 flex gap-2">
            <Link href="/kits/resilient" className="btn">View</Link>
            <Link href="/r/resilient" className="btn-ghost">Buy</Link>
          </div>
        </article>

        <article className="card-tactical">
          <h3 className="text-xl font-semibold">Homefront</h3>
          <p className="muted text-sm mt-1">Home base hydration and rest.</p>
          <div className="mt-3 flex gap-2">
            <Link href="/kits/homefront" className="btn">View</Link>
            <Link href="/r/homefront" className="btn-ghost">Buy</Link>
          </div>
        </article>

        <article className="card-tactical">
          <h3 className="text-xl font-semibold">Gallery</h3>
          <p className="muted text-sm mt-1">Real kit shots and field notes.</p>
          <div className="mt-3">
            <Link href="/gallery" className="btn-ghost">Open gallery</Link>
          </div>
        </article>
      </section>
      {/* Bottom Donate strip removed per request */}
    </main>
  );
}
