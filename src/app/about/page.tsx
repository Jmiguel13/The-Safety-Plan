export const runtime = "nodejs";

import type { Metadata } from "next";
import Link from "next/link";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { BRAND, CONTACT } from "@/lib/blank";
import { REPACK_POLICY } from "@/lib/kits-bom";

export const metadata: Metadata = {
  title: "About — The Safety Plan",
  description:
    "Who we are, why we exist, and how we support resilience, recovery, hydration, and rest.",
  alternates: { canonical: "/about" },
};

// Optional: set your Google Business Profile URL in env
const GBP_URL = (process.env.NEXT_PUBLIC_BLANK_GBP_URL ?? "").trim();
// Optional founder display name from env
const FOUNDER_NAME = (process.env.NEXT_PUBLIC_FOUNDER_NAME ?? "Founder").toString();

// Server-side helper to safely pick a hero image from /public
function firstExistingPublicPath(paths: string[]): string | null {
  const base = join(process.cwd(), "public");
  for (const rel of paths) {
    const abs = join(base, rel.replace(/^\/+/, ""));
    try {
      if (existsSync(abs)) return "/" + rel.replace(/^\/+/, "");
    } catch {
      // ignore
    }
  }
  return null;
}

const HERO = firstExistingPublicPath([
  "images/hero-safety-plan.webp",
  "images/hero-safety-plan.jpg",
  "images/hero-safety-plan.png",
]);

export default function AboutPage() {
  return (
    <main className="container space-y-10">
      {/* Hero */}
      <section
        className="overflow-hidden rounded-2xl border border-white/10"
        style={{
          background:
            "radial-gradient(1200px 520px at 0% 0%, rgba(56,189,248,.12), transparent), radial-gradient(900px 420px at 100% 10%, rgba(16,185,129,.10), transparent)",
        }}
      >
        <div className="grid items-stretch gap-6 md:grid-cols-2">
          <div className="p-6 md:p-10">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              About The Safety Plan
            </h1>
            <p className="mt-3 text-zinc-300">
              We build mission-first wellness kits designed around four pillars:
              focus, hydration, recovery, and rest. Our aim is simple—make it
              easier to get through long days and tough nights, while keeping
              support within reach.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/kits" className="btn">Browse kits</Link>
              <Link href="/resources" className="btn-ghost">Resources</Link>
              {/* NEW: Founder button */}
              <Link href="/about/founder" className="btn-ghost">Founder</Link>
            </div>
          </div>

          {/* Visual */}
          <div
            className="min-h-[220px] bg-zinc-900/40"
            style={
              HERO
                ? {
                    backgroundImage: `linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.35)), url(${HERO})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
            aria-hidden
          />
        </div>
      </section>

      {/* Pillars */}
      <section aria-labelledby="pillars-title" className="space-y-4">
        <h2 id="pillars-title" className="text-xl font-semibold">
          What guides our work
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Focus", "Clarity without the crash."],
            ["Hydration", "Electrolytes and balance for long days."],
            ["Recovery", "Rebuild and restore between pushes."],
            ["Rest", "Protect sleep—protect performance."],
          ].map(([title, desc]) => (
            <li key={title} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-base font-medium">{title}</div>
              <p className="mt-1 text-sm text-zinc-400">{desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* How we work */}
      <section aria-labelledby="how-title" className="space-y-3">
        <h2 id="how-title" className="text-xl font-semibold">How we work</h2>
        <ul className="list-disc space-y-2 pl-6 text-zinc-300">
          <li>
            We assemble kits using products from third-party manufacturers and
            authorized distributors. Items arrive in original retail packaging
            unless noted.
          </li>
          <li>
            When we repack an item for convenience or dosing, we label it with
            the original product name and include required info. See our
            disclosures for details.
          </li>
          <li>
            For individual product purchases, we provide a link to the
            manufacturer or authorized storefront, as applicable.
          </li>
        </ul>
      </section>

      {/* Meet the founder — small card that doesn’t dominate the page */}
      <section aria-labelledby="founder-cta" className="space-y-3">
        <h2 id="founder-cta" className="text-xl font-semibold">Who’s behind this</h2>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-zinc-300">
            The Safety Plan was founded to close practical gaps—keeping useful
            essentials in reach and support visible. Learn more about{" "}
            <Link href="/about/founder" className="underline">
              {FOUNDER_NAME}
            </Link>{" "}
            and the story that led to this mission.
          </p>
        </div>
      </section>

      {/* Transparency & safety */}
      <section aria-labelledby="transparency-title" className="space-y-3">
        <h2 id="transparency-title" className="text-xl font-semibold">
          Transparency &amp; safety
        </h2>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-zinc-300">
            Always refer to the manufacturer’s label for directions, warnings,
            and allergen information. If you’re unsure whether a product is
            right for you, talk with a licensed medical professional before use.
          </p>
          <p className="mt-3 text-sm text-zinc-400 whitespace-pre-wrap">
            {REPACK_POLICY}
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            Questions?{" "}
            {CONTACT.email ? (
              <a className="underline" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
            ) : (
              BRAND.name
            )}
            {CONTACT.phone ? <> • {CONTACT.phone}</> : null}
          </p>
        </div>

        {/* Discreet legal/business link — not the focus */}
        {(GBP_URL || CONTACT.website) ? (
          <p className="text-xs text-zinc-500">
            Business information (assembler):{" "}
            <a
              className="underline"
              href={GBP_URL || CONTACT.website!}
              target="_blank"
              rel="noopener noreferrer"
            >
              {BRAND.name}
            </a>
            .
          </p>
        ) : null}
      </section>
    </main>
  );
}
