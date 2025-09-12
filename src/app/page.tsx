// src/app/page.tsx
import Link from "next/link";
import { MYSHOP_BASE } from "@/lib/amway";

export default function Home() {
  return (
    <section className="space-y-10 max-w-5xl mx-auto">
      {/* Hero */}
      <header className="space-y-5">
        <div className="space-y-2">
          <h1 className="text-balance text-5xl font-extrabold leading-tight tracking-tight">
            The Safety Plan
          </h1>
          <p className="muted max-w-prose">
            Mission-first wellness kits — focus, recovery, hydration, rest.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
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
      </header>

      {/* Tactical status strip */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="panel p-4">
          <div className="label">Focus</div>
          <div className="value">XS Energy</div>
        </div>
        <div className="panel p-4">
          <div className="label">Hydration</div>
          <div className="value">Electrolytes</div>
        </div>
        <div className="panel p-4">
          <div className="label">Recovery</div>
          <div className="value">Essential nutrients</div>
        </div>
      </div>

      {/* Mission blurb */}
      <div className="panel-elevated p-5 space-y-2">
        <h2 className="text-xl font-semibold">What we do</h2>
        <p className="muted max-w-prose">
          We build clean, effective wellness kits to meet real needs: hydration, energy, recovery,
          and rest. Every purchase advances veteran suicide prevention and frontline support.
        </p>
      </div>
    </section>
  );
}
