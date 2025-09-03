export const viewport = {
  themeColor: "#0b0f10",
};
export const dynamic = "error";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="grid items-center gap-8 md:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-4">
          <div className="tag tag-accent w-max">Mission Ready</div>
          <h1>Wellness Kits for Focused Lives</h1>
          <p className="muted max-w-xl">
            Clean energy, hydration, recovery, rest. Every purchase supports veteran suicide prevention resources.
          </p>

          {/* CTA row: Shop, Donate, FAQ anchor */}
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/kits" className="btn">Explore Kits</Link>
            <Link href="/donate" className="btn-ghost">Donate</Link>
            <Link href="/shop" className="btn-ghost">Open Storefront</Link>
            <Link href="/faq#veteran-awareness" className="tag">Line Check</Link>
          </div>
        </div>

        <div className="panel p-5 hidden md:block">
          <div className="rounded-lg border border-[var(--border)] bg-black/30 aspect-[4/3] grid place-items-center">
            {/* replaced inline styles with classes */}
            <div className="w-7 h-7 rounded-full bg-[var(--ok)]" />
            <div className="sr-only">Preview area</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="panel p-3">
              <div className="stat"><div className="label">Weight</div><div className="value">1.2 lb</div></div>
            </div>
            <div className="panel p-3">
              <div className="stat"><div className="label">Durability</div><div className="value">IP54</div></div>
            </div>
            <div className="panel p-3">
              <div className="stat"><div className="label">Contents</div><div className="value">12 items</div></div>
            </div>
            <div className="panel p-3">
              <div className="stat"><div className="label">Support</div><div className="value">24/7</div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card-tactical">
          <h3>Resilient</h3>
          <p className="muted text-sm mt-1">Daily carry energy and recovery.</p>
          <div className="mt-3 flex gap-2">
            <Link href="/kits/resilient" className="btn">View</Link>
            <Link href="/r/resilient" className="btn-ghost">Buy</Link>
          </div>
        </div>
        <div className="card-tactical">
          <h3>Homefront</h3>
          <p className="muted text-sm mt-1">Home base hydration and rest.</p>
          <div className="mt-3 flex gap-2">
            <Link href="/kits/homefront" className="btn">View</Link>
            <Link href="/r/homefront" className="btn-ghost">Buy</Link>
          </div>
        </div>
        <div className="card-tactical">
          <h3>Gallery</h3>
          <p className="muted text-sm mt-1">Real kit shots and field notes.</p>
          <div className="mt-3"><Link href="/gallery" className="btn-ghost">Open gallery</Link></div>
        </div>
      </section>

      {/* Subtle mission strip with another Donate entry point */}
      <section className="panel p-5 flex flex-wrap items-center justify-between gap-3">
        <p className="muted text-sm">
          Your support funds our first production run and gets kits into the hands of those who need them most.
        </p>
        <Link href="/donate" className="btn">Donate</Link>
      </section>
    </div>
  );
}
