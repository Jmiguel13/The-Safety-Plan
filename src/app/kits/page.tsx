// src/app/kits/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { kits } from "@/lib/kits";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Kits — The Safety Plan",
  description: "Built for real needs: hydration, energy, recovery, and rest.",
};

type KitBrief = {
  slug: string;
  title?: string;
  tagline?: string;
  imageUrl?: string;   // optional legacy key
  image?: string;      // supports your current data
};

function titleOf(slug: string, title?: string) {
  if (title && title.trim()) return title;
  return `${slug.slice(0, 1).toUpperCase()}${slug.slice(1)} Kit`;
}

function cardGrad(slug: string) {
  if (slug === "resilient") {
    return "radial-gradient(600px 260px at 0% 0%, rgba(16,185,129,0.18), transparent 65%), radial-gradient(520px 220px at 100% 0%, rgba(59,130,246,0.16), transparent 60%)";
  }
  if (slug === "homefront") {
    return "radial-gradient(600px 260px at 0% 0%, rgba(56,189,248,0.18), transparent 65%), radial-gradient(520px 220px at 100% 0%, rgba(34,197,94,0.16), transparent 60%)";
  }
  return "radial-gradient(560px 240px at 0% 0%, rgba(148,163,184,0.16), transparent 60%)";
}

/** Point these to whatever logo assets you actually have */
const LOGO_MAP: Record<string, string | undefined> = {
  // If your assets are PNGs, point to .png; if they’re SVGs, point to .svg
  resilient: "/images/kits/resilient-hero.png",  // or /images/kits/resilient-logo.svg
  homefront: "/images/kits/homefront-hero.png",  // or /images/kits/homefront-logo.svg
};

export default function KitsIndexPage() {
  const list = (kits as KitBrief[]).filter((k) => k && k.slug);

  return (
    <main id="main" className="container py-10">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Kits</h1>
      <p className="muted mt-2">Built for real needs: hydration, energy, recovery, and rest.</p>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2">
        {list.map((k) => {
          const name = titleOf(k.slug, k.title);
          const line =
            k.tagline ||
            (k.slug === "resilient"
              ? "Built for daily carry. Energy, hydration, recovery, morale."
              : k.slug === "homefront"
              ? "Support for home base. Hydration, vitamins, recovery, rest."
              : "Mission-ready wellness essentials.");

          const logoOrHero = LOGO_MAP[k.slug] || k.imageUrl || k.image || null;

          return (
            <li key={k.slug}>
              <Link
                href={`/kits/${k.slug}`}
                className="group block overflow-hidden rounded-2xl border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                aria-label={`View ${name}`}
                style={{ backgroundColor: "rgb(9 9 11 / 0.65)" }}
              >
                {/* Visual */}
                <div className="relative aspect-[5/3]">
                  <div className="absolute inset-0" style={{ background: cardGrad(k.slug) }} aria-hidden="true" />
                  {logoOrHero ? (
                    <Image
                      src={logoOrHero}
                      alt={`${name} logo`}
                      fill
                      sizes="(min-width: 1024px) 560px, (min-width: 640px) 48vw, 100vw"
                      className="object-contain p-10 opacity-90 transition-all duration-300 group-hover:opacity-100"
                      priority={false}
                    />
                  ) : null}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="text-lg font-semibold">{name}</div>
                  <p className="muted mt-1 text-sm">{line}</p>
                  <div className="mt-3">
                    <span className="btn px-3 py-1 text-sm">View kit</span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
