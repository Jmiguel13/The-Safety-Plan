// src/components/HomeHero.tsx
import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="grid gap-8 md:grid-cols-[1.2fr,1fr]">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs tracking-wide">
          <span className="h-2 w-2 rounded-full bg-emerald-400" /> Mission-ready wellness
        </span>
        <h1 className="mt-4 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
          Mission-Ready <br /> Wellness Kits
        </h1>
        <p className="mt-4 max-w-xl text-zinc-300">
          Every purchase fuels veteran support and suicide prevention. Built to be carried. Designed to make a difference.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {/* Internal routes → Link */}
          <Link
            href="/kits"
            className="rounded-full bg-emerald-400 px-4 py-2 text-black hover:bg-emerald-300"
          >
            Explore Kits
          </Link>

          <Link
            href="/shop"
            className="rounded-full border border-zinc-700 px-4 py-2 hover:bg-zinc-900"
          >
            Visit Shop
          </Link>

          {/* FAQ */}
          <Link
            href="/faq"
            className="rounded-full border border-zinc-700 px-4 py-2 hover:bg-zinc-900"
          >
            FAQ
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-[.15em]">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/5 px-2 py-1">Resilient</span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/5 px-2 py-1">Homefront</span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/5 px-2 py-1">Line Check</span>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="aspect-video rounded-2xl border border-zinc-800 bg-zinc-900/40" />
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-zinc-400">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <div className="text-[10px] uppercase tracking-widest">Weight</div>
            <div className="text-white">1.2 lb</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <div className="text-[10px] uppercase tracking-widest">Durability</div>
            <div className="text-white">IP54</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <div className="text-[10px] uppercase tracking-widest">Contents</div>
            <div className="text-white">12 essentials</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <div className="text-[10px] uppercase tracking-widest">Support</div>
            <div className="text-white">24/7</div>
          </div>
        </div>
      </div>
    </section>
  );
}
