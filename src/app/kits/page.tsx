// src/app/kits/page.tsx
export const runtime = "nodejs";

import type { Metadata } from "next";
import Link from "next/link";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { kits } from "@/lib/kits";
import KitThumb from "@/components/KitThumb";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Kits — The Safety Plan",
  description: "Built for real needs: hydration, energy, recovery, and rest.",
};

type KitBrief = {
  slug: string;
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

function cardGrad(slug: string) {
  if (slug === "resilient") {
    return "radial-gradient(600px 260px at 0% 0%, rgba(16,185,129,.18), transparent 65%), radial-gradient(520px 220px at 100% 0%, rgba(59,130,246,.16), transparent 60%)";
  }
  if (slug === "homefront") {
    return "radial-gradient(600px 260px at 0% 0%, rgba(56,189,248,.18), transparent 65%), radial-gradient(520px 220px at 100% 0%, rgba(34,197,94,.16), transparent 60%)";
  }
  return "radial-gradient(560px 240px at 0% 0%, rgba(148,163,184,.16), transparent 60%)";
}

// file helpers
function publicIfExists(relPath?: string | null): string | null {
  if (!relPath || typeof relPath !== "string") return null;
  const rel = relPath.replace(/^\/+/, "");
  const abs = join(process.cwd(), "public", rel);
  return existsSync(abs) ? `/${rel}` : null;
}

// prefer logo-style hero SVG first
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

function pickBadgeArt(slug: string) {
  const candidates = [
    `/images/kits/${slug}-badge.svg`,
    `/images/kits/${slug}-badge.webp`,
    `/images/kits/${slug}-badge.png`,
    `/images/kits/${slug}-logo.svg`,
  ];
  for (const c of candidates) {
    const ok = publicIfExists(c);
    if (ok) return ok;
  }
  return null;
}

export default function KitsIndexPage() {
  const list = (kits as KitBrief[]).filter(Boolean);

  return (
    <main id="main" className="container py-10">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Kits</h1>
      <p className="muted mt-2">Built for real needs: hydration, energy, recovery, and rest.</p>

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
          const badgeSrc = pickBadgeArt(k.slug);

          return (
            <li key={k.slug}>
              <Link
                href={`/kits/${k.slug}`}
                className="group block overflow-hidden rounded-2xl border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                aria-label={`View ${name}`}
                style={{ backgroundColor: "rgb(9 9 11 / 0.65)" }}
              >
                {/* Visual */}
                <div className="relative aspect-[5/3] md:aspect-[21/9]">
                  <div className="absolute inset-0" style={{ background: cardGrad(k.slug) }} aria-hidden="true" />
                  <KitThumb
                    src={heroSrc}
                    alt={`${name} hero`}
                    fit="cover"
                    padding="p-0"
                    watermark={name}
                  />
                  {badgeSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={badgeSrc}
                      alt={`${name} badge`}
                      className="absolute left-4 top-4 h-14 w-14 rounded-lg bg-black/30 p-2 backdrop-blur-sm"
                      decoding="async"
                      loading="lazy"
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
