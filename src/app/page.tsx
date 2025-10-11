// src/app/page.tsx
export const runtime = "nodejs";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { getSiteConfig } from "@/lib/site";
import { BRAND, CONTACT } from "@/lib/blank";

/** Inline icons */
function IconTarget(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 2a1 1 0 0 1 1 1v1.07A8 8 0 0 1 20.93 11H22a1 1 0 1 1 0 2h-1.07A8 8 0 0 1 13 19.93V21a1 1 0 1 1-2 0v-1.07A8 8 0 0 1 3.07 13H2a1 1 0 1 1 0-2h1.07A8 8 0 0 1 11 4.07V3a1 1 0 0 1 1-1Zm0 4a6 6 0 1 0 0 12A6 6 0 0 0 12 6Zm0 3a3 3 0 1 1 0 6a3 3 0 0 1 0-6Z"
      />
    </svg>
  );
}
function IconDrop(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12.66 3.28a1 1 0 0 0-1.32 0C8.2 5.98 5 10.06 5 13.25A7 7 0 0 0 12 20a7 7 0 0 0 7-6.75c0-3.19-3.2-7.27-6.34-9.97Z"
      />
    </svg>
  );
}
function IconMoon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M21 13a9 9 0 0 1-11.91 8.55a1 1 0 0 1-.19-1.82A7 7 0 0 0 13.73 4.1a1 1 0 0 1 1.29-1.14A9 9 0 0 1 21 13Z"
      />
    </svg>
  );
}
function IconHeart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12.76 4.75a4.5 4.5 0 0 1 6.37 6.36L12 18.25l-7.13-7.14A4.5 4.5 0 1 1 11.24 4.75L12 5.52z"
      />
    </svg>
  );
}

/** Prefer a real hero image if present (server only) */
function firstExistingPublicPath(candidates: string[]): string | null {
  try {
    const pub = join(process.cwd(), "public");
    for (const rel of candidates) {
      if (existsSync(join(pub, rel))) return `/${rel.replace(/^\/+/, "")}`;
    }
  } catch {}
  return null;
}

const HERO_SRC = firstExistingPublicPath([
  "images/hero-safety-plan.webp",
  "images/hero-safety-plan.jpg",
  "images/hero-safety-plan.png",
  "images/hero-safety-plan.svg",
  "hero-tactical.jpg",
]);

/** Next.js Image wrapper */
function HeroImg({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 768px) 50vw, 100vw"
      priority={false}
      className={className}
      style={{ objectFit: "cover" }}
    />
  );
}

/** Reusable accordion tile (click to open/close) */
function FeatureTile({
  title,
  desc,
  Icon,
  children,
}: {
  title: string;
  desc: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
}) {
  return (
    <details className="rounded-xl border border-white/10 bg-white/5 transition open:bg-white/7">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
        <span className="inline-flex size-9 items-center justify-center rounded-lg bg-white/10">
          <Icon className="size-5 text-white/90" />
        </span>
        <div className="flex-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-zinc-400">{desc}</p>
        </div>
        <span aria-hidden className="ml-2 select-none text-zinc-400">▾</span>
      </summary>
      <div className="px-4 pb-4 pt-1 text-sm text-zinc-300">{children}</div>
    </details>
  );
}

export default function Home() {
  const { IMPACT_STAT } = getSiteConfig();

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section
        className="container rounded-2xl border border-white/10 p-6 md:p-10"
        aria-labelledby="hero-title"
        style={{
          background:
            "radial-gradient(1200px 600px at 20% -10%, rgba(56,189,248,.12), transparent), radial-gradient(800px 400px at 100% 20%, rgba(16,185,129,.10), transparent)",
        }}
      >
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between gap-3">
              <h1
                id="hero-title"
                className="text-3xl font-semibold tracking-tight md:text-4xl"
              >
                Wellness with a mission
              </h1>

              {/* Built by BLANK pill */}
              <span
                className="inline-flex shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-wide text-zinc-300"
                aria-label={`Built by ${BRAND.name}`}
                title={`Built by ${BRAND.name}`}
              >
                Built by {BRAND.name}
              </span>
            </div>

            <p className="mt-3 text-zinc-400">
              Trusted essentials for long days and tough nights — you are not
              alone. Every kit is a reminder of resilience, recovery, and the
              mission we stand for together.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/kits" className="btn" aria-label="Browse kits">
                Browse kits
              </Link>
              <Link href="/shop" className="btn" aria-label="Shop">
                Shop
              </Link>
              <Link href="/donate" className="btn-ghost" aria-label="Donate">
                Donate
              </Link>
              <Link href="/resources" className="btn-ghost" aria-label="Resources">
                Resources
              </Link>
              <Link href="/about" className="btn-ghost" aria-label="About">
                About
              </Link>
            </div>

            <p className="mt-8 text-sm md:text-base text-zinc-300">
              Your support helps <strong>with</strong> prevention, outreach, and response.
            </p>
          </div>

          {/* Hero image slot */}
          <div
            className="relative h-56 w-full overflow-hidden rounded-xl border border-white/10 md:h-72"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.35)), radial-gradient(220px 140px at 30% 70%, rgba(16,185,129,.22), transparent), radial-gradient(220px 140px at 75% 30%, rgba(59,130,246,.22), transparent)",
            }}
            aria-label="Mission hero image"
          >
            {HERO_SRC ? (
              <HeroImg
                src={HERO_SRC}
                alt="The Safety Plan — wellness with a mission"
                className="absolute inset-0"
              />
            ) : (
              <div aria-hidden className="absolute inset-0" />
            )}
          </div>
        </div>
      </section>

      {/* FEATURES — click to open */}
      <section aria-labelledby="features-title" className="container">
        <h2 id="features-title" className="sr-only">
          What’s inside
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureTile
            title="Focus"
            desc="Clarity without the crash."
            Icon={IconTarget}
          >
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Nutrilite Ultra Focus Energy Pack</strong> — on-the-go focus.
              </li>
              <li>
                <strong>XS Energy (can)</strong> — quick boost when needed.
              </li>
            </ul>
          </FeatureTile>

          <FeatureTile
            title="Hydration"
            desc="Electrolytes for long days."
            Icon={IconDrop}
          >
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>XS Sports Electrolyte Drink Mix</strong> — simple, daily hydration.
              </li>
              <li>
                <strong>Extra electrolyte sticks</strong> — added coverage on hard days.
              </li>
            </ul>
          </FeatureTile>

          <FeatureTile title="Rest" desc="Recover and reset." Icon={IconMoon}>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Nutrilite Sleep Health</strong> — nightly support.
              </li>
              <li>
                <strong>Sweet Dreams Sleep Gummies</strong> — <em>2/night</em> as needed.
              </li>
            </ul>
          </FeatureTile>

          <FeatureTile
            title="Impact"
            desc="Your support helps with prevention."
            Icon={IconHeart}
          >
            <p>
              <strong>Every ~7 minutes</strong>, a U.S. veteran dies by suicide. Your
              support helps with prevention, outreach, and response — one kit,
              one conversation, one life at a time.
            </p>
          </FeatureTile>
        </div>
      </section>

      {/* KITS */}
      <section aria-labelledby="kits-title" className="container">
        <h2 id="kits-title" className="mb-4 text-xl font-semibold tracking-tight">
          Pick your kit
        </h2>

        <ul className="grid gap-4 md:grid-cols-2">
          {[
            {
              name: "Home Front Kit",
              href: "/kits/homefront",
              badge: "Best for recovery",
              gradient:
                "bg-gradient-to-br from-emerald-500/20 via-emerald-400/10 to-emerald-500/5",
            },
            {
              name: "Resilient Kit",
              href: "/kits/resilient",
              badge: "Mission-ready",
              gradient:
                "bg-gradient-to-br from-sky-500/20 via-sky-400/10 to-sky-500/5",
            },
          ].map((k) => (
            <li key={k.href}>
              <Link
                href={k.href}
                className={[
                  "group block rounded-xl border border-white/10 p-5 transition",
                  "hover:border-white/20 hover:bg-white/[0.03]",
                  k.gradient,
                ].join(" ")}
                aria-label={`View ${k.name}`}
              >
                <p className="text-xs text-emerald-300/80">{k.badge}</p>
                <p className="mt-1 text-lg font-medium">{k.name}</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Balanced essentials for performance and recovery — with impact
                  built in.
                </p>

                <div className="mt-4 text-sm text-zinc-300">
                  <span className="rounded-full bg-white/10 px-2 py-0.5">
                    Learn more →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* IMPACT STRIP (single sentence; no “fund”, no duplicates) */}
      <section
        aria-label="Impact"
        className="container rounded-xl border border-white/10 bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-emerald-500/10 p-5"
      >
        {(() => {
          const raw =
            (IMPACT_STAT as string) ||
            "Your support helps with prevention, outreach, and response.";
          const cleaned = raw.replace(/\bfund\b/gi, "with");

          return (
            <p className="text-sm text-zinc-200">
              <span className="font-semibold text-white">{cleaned}</span>
              {CONTACT?.email || CONTACT?.phone ? (
                <>
                  {" "}
                  Questions?{" "}
                  {CONTACT.email ? (
                    <a className="underline" href={`mailto:${CONTACT.email}`}>
                      {CONTACT.email}
                    </a>
                  ) : null}
                  {CONTACT.email && CONTACT.phone ? " • " : null}
                  {CONTACT.phone ? <span>{CONTACT.phone}</span> : null}
                  .
                </>
              ) : null}
            </p>
          );
        })()}
      </section>
    </div>
  );
}
