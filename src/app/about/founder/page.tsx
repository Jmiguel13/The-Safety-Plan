export const runtime = "nodejs";

import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { CONTACT } from "@/lib/blank";

export const metadata: Metadata = {
  title: "Founder — The Safety Plan",
  description:
    "Background, motivation, and the path that shaped The Safety Plan.",
  alternates: { canonical: "/about/founder" },
};

// Customize via env (safe defaults)
const NAME = (process.env.NEXT_PUBLIC_FOUNDER_NAME ?? "Josh").toString();
const TITLE = (process.env.NEXT_PUBLIC_FOUNDER_TITLE ?? "Founder").toString();
const LINKEDIN = (process.env.NEXT_PUBLIC_FOUNDER_LINKEDIN ?? "").toString();
// Press link provided
const PRESS_LINK =
  "https://www.postandcourier.com/greenville/news/greenville-wellness-veteran-suicide-prevention/article_a22a4118-3ae6-4e62-ae0a-1beb1131e41a.html";

// Optional headshot in /public/images
function publicIfExists(rel: string) {
  try {
    const abs = join(process.cwd(), "public", rel.replace(/^\/+/, ""));
    return existsSync(abs) ? `/${rel.replace(/^\/+/, "")}` : null;
  } catch {
    return null;
  }
}

const HEADSHOT =
  publicIfExists("images/founder.jpg") ||
  publicIfExists("images/founder.png") ||
  publicIfExists("images/founder.webp");

export default function FounderPage() {
  return (
    <main className="container space-y-10">
      <header className="grid gap-4 md:grid-cols-[160px,1fr] md:items-center">
        <div className="h-40 w-40 overflow-hidden rounded-xl border border-white/10 bg-white/5 md:h-44 md:w-44">
          {HEADSHOT ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={HEADSHOT}
              alt={`${NAME} — ${TITLE}`}
              className="h-full w-full object-cover"
              decoding="async"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
              Upload /public/images/founder.jpg
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{NAME}</h1>
          <p className="text-zinc-400">{TITLE}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {LINKEDIN ? (
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
              >
                LinkedIn
              </a>
            ) : null}
            {CONTACT.email ? (
              <a
                href={`mailto:${CONTACT.email}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
              >
                Email
              </a>
            ) : null}
            <a
              href={PRESS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
            >
              Press feature
            </a>
          </div>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <h2 className="text-lg font-semibold">Why we started</h2>
          <p className="mt-2 text-zinc-300">
            The Safety Plan exists to close practical gaps—small things that add up
            when stress is high and days are long. The goal is simple: put useful,
            trusted essentials in reach and keep support visible.
          </p>
        </article>

        <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <h2 className="text-lg font-semibold">Service &amp; community</h2>
          <p className="mt-2 text-zinc-300">
            Our work is shaped by the people we serve—veterans, law enforcement,
            and their families. Feedback loops matter; we listen, adjust, and build
            with intent.
          </p>
        </article>

        {/* Background / story (kept high-signal; doesn’t overtake the page) */}
        <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <h2 className="text-lg font-semibold">Background</h2>
          <p className="mt-2 text-zinc-300">
            I’ve spent years building solutions and standing up community efforts
            tied to wellness and prevention. That path ultimately led to creating
            mission-first kits—practical, repeatable ways to support resilience,
            recovery, hydration, and rest.
          </p>
          <p className="mt-2 text-zinc-300">
            Along the way I’ve partnered with local organizations, leveraged my
            technology/operations background, and focused on making support more
            visible day to day.
          </p>
        </article>

        <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <h2 className="text-lg font-semibold">Personal note</h2>
          <p className="mt-2 text-zinc-300">
            I’m also a dad. Dess and Ollie are daily reminders of why this work
            matters—showing up for our people, building tools that help, and
            keeping hope in view.
          </p>
        </article>
      </section>

      <div className="pt-2">
        <a href="/about" className="btn-ghost">Back to About</a>
      </div>
    </main>
  );
}
