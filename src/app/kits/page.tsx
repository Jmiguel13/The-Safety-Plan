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
  imageUrl?: string; // optionally set in your kits data
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

export default function KitsIndexPage() {
  const list = (kits as KitBrief[]).filter((k) => k && k.slug);

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Kits</h1>
      <p className="muted mt-2">
        Built for real needs: hydration, energy, recovery, and rest.
      </p>

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

          return (
            <li key={k.slug}>
              <Link
                href={`/kits/${k.slug}`}
                className="block overflow-hidden rounded-2xl border border-white/10 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                aria-label={`View ${name}`}
                style={{ backgroundColor: "rgb(9 9 11 / 0.65)" }}
              >
                {/* Hero */}
                <div className="relative aspect-[5/3]">
                  {k.imageUrl ? (
                    <>
                      <Image
                        src={k.imageUrl}
                        alt={`${name} hero`}
                        fill
                        priority={false}
                        quality={90}
                        sizes="(min-width: 1024px) 560px, (min-width: 640px) 48vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/30 to-transparent" />
                    </>
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{ background: cardGrad(k.slug) }}
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* single, non-duplicated title */}
                  <div className="text-lg font-semibold">{name}</div>
                  {/* tagline only (no 2nd copy of the title) */}
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
