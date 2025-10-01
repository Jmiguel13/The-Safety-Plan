// src/app/kits/page.tsx
export const runtime = "nodejs";

import type { Metadata } from "next";
import Link from "next/link";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { kits } from "@/lib/kits";
import KitThumb from "@/components/KitThumb";
import { BRAND } from "@/lib/blank";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Kits — The Safety Plan",
  description: "Built for real needs: hydration, energy, recovery, and rest.",
};

type KitBrief = {
  slug: "resilient" | "homefront" | string;
  title?: string;
  subtitle?: string;
  tagline?: string;
  image?: string;
  imageUrl?: string;
};

function titleOf(slug: string, title?: string) {
  if (title && title.trim()) return title;
  return `${slug.slice(0, 1).toUpperCase()}${slug.slice(1)} Kit`;
}

/** Softer corner glows */
function cardGrad(slug: string) {
  const a =
    slug === "resilient"
      ? "rgba(16,185,129,.16)"
      : slug === "homefront"
      ? "rgba(56,189,248,.16)"
      : "rgba(148,163,184,.14)";
  const b =
    slug === "resilient"
      ? "rgba(59,130,246,.14)"
      : slug === "homefront"
      ? "rgba(34,197,94,.14)"
      : "rgba(148,163,184,.12)";
  return `radial-gradient(600px 260px at 6% 10%, ${a}, transparent 65%), radial-gradient(560px 240px at 94% 8%, ${b}, transparent 60%)`;
}

// file helpers
function publicIfExists(relPath?: string | null): string | null {
  if (!relPath || typeof relPath !== "string") return null;
  const rel = relPath.replace(/^\/+/, "");
  const abs = join(process.cwd(), "public", rel);
  return existsSync(abs) ? `/${rel}` : null;
}

function pickKitArt(slug: string, preferred?: string | null) {
  const prioritized = [`/images/kits/${slug}-hero.svg`];
  for (const p of prioritized) {
    const ok = publicIfExists(p);
    if (ok) return ok;
  }

  const fromData = publicIfExists(preferred ?? undefined);
  if (fromData) return fromData;

  const candidates = [
    `/images/kits/${slug}-hero.webp`,
    `/images/kits/${slug}-hero.png`,
    `/images/kits/${slug}-hero.jpg`,
    `/images/kits/${slug}-hero.jpeg`,
  ];
  for (const c of candidates) {
    const ok = publicIfExists(c);
    if (ok) return ok;
  }

  return (
    publicIfExists("/images/hero-safety-plan.webp") ||
    publicIfExists("/images/hero-tactical.jpg") ||
    null
  );
}

export default function KitsIndexPage() {
  const list = (kits as KitBrief[]).filter(Boolean);

  return (
    <main id="main" className="container py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Kits</h1>
          <p className="muted mt-2">Built for real needs: hydration, energy, recovery, and rest.</p>
        </div>

        {/* Built by BLANK (hide on xs to avoid crowding) */}
        <span
          aria-label={`Built by ${BRAND.name}`}
          className="hidden shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-wide text-zinc-300 sm:inline-flex"
          title={`Built by ${BRAND.name}`}
        >
          Built by {BRAND.name}
        </span>
      </div>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2">
        {list.map((k) => {
          const name = titleOf(k.slug, k.title);
          const line =
            k.subtitle ??
            k.tagline ??
            (k.slug === "resilient"
              ? "Built for daily carry. Energy, hydration, recovery, morale."
              : k.slug === "homefront"
              ? "Support for home base. Hydration, vitamins, recovery, rest."
              : "Mission-ready wellness essentials.");

          const heroSrc = pickKitArt(k.slug, k.image || k.imageUrl);

          return (
            <li key={k.slug}>
              <Link
                href={`/kits/${k.slug}`}
                className={[
                  "group block overflow-hidden rounded-2xl border border-white/10",
                  "transition-[box-shadow,transform,background-color]",
                  "hover:bg-white/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60",
                ].join(" ")}
                aria-label={`View ${name}`}
                style={{ backgroundColor: "rgb(9 9 11 / 0.65)" }}
              >
                {/* Visual */}
                <div className="relative aspect-[16/9]">
                  <div
                    className="absolute inset-0"
                    style={{ background: cardGrad(k.slug) }}
                    aria-hidden="true"
                  />
                  <KitThumb
                    src={heroSrc}
                    alt={`${name} hero`}
                    fit="contain"
                    padding="p-6 md:p-10"
                    zoom={1.34}
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{name}</h2>
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
