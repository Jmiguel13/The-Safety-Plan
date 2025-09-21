import type { Metadata } from "next";
import Link from "next/link";
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
  imageUrl?: string; // <-- add this to your kits data when you have images
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
    <main className="mx-auto max-w-6xl px-4 py-10">
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

          // If you add /public/images/kits/{slug}.jpg, you can set imageUrl accordingly.
          const bg = k.imageUrl
            ? `linear-gradient(0deg, rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url("${k.imageUrl}")`
            : cardGrad(k.slug);

          return (
            <li key={k.slug}>
              <Link
                href={`/kits/${k.slug}`}
                className="block rounded-2xl border border-white/10 overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                aria-label={`View ${name}`}
                style={{ backgroundColor: "rgb(9 9 11 / 0.65)" }}
              >
                <div
                  className="aspect-[5/3] bg-zinc-900/30"
                  style={{
                    backgroundImage: bg,
                    backgroundSize: k.imageUrl ? "cover" : undefined,
                    backgroundPosition: k.imageUrl ? "center" : undefined,
                  }}
                />
                <div className="p-4">
                  <div className="text-xs text-zinc-400">{name}</div>
                  <div className="mt-1 text-lg font-semibold">{name}</div>
                  <p className="muted mt-1 text-sm">{line}</p>

                  <div className="mt-3">
                    <span className="btn px-3 py-1 text-sm">View Kit</span>
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
