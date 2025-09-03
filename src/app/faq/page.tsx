import type { Metadata, Viewport } from "next";
import Link from "next/link";
import CrisisCTA from "@/components/CrisisCTA";

export const viewport: Viewport = { themeColor: "#0b0f10" };

export const metadata: Metadata = {
  title: "FAQ — The Safety Plan",
  description: "Short, honest answers — and real ways to get help.",
};

export default function FAQPage() {
  return (
    <main id="content" className="container py-10 space-y-6">
      <header className="space-y-1">
        <h1>Questions & Answers</h1>
        <p className="muted text-sm">Quick answers, real impact.</p>
      </header>

      {/* Crisis resources */}
      <CrisisCTA />

      <div className="divider" />

      {/* FAQs */}
      <section className="space-y-4">
        <article className="panel p-4 md:p-6">
          <h3 className="text-lg font-semibold">Where do profits go?</h3>
          <p className="muted mt-2">
            After costs, every dollar fuels veteran-focused suicide prevention and frontline support—care kits,
            outreach, and community programs. We publish simple impact updates so you can see where help goes.
          </p>
        </article>

        <article className="panel p-4 md:p-6">
          <h3 className="text-lg font-semibold">What’s in the Resilient Kit?</h3>
          <p className="muted mt-2">
            Daily-carry wellness: clean energy, hydration, key vitamins, recovery aids, and a few morale boosters.
            It’s the “ready in your bag” kit.{" "}
            <Link className="underline hover:no-underline" href="/kits/resilient">
              See full kit
            </Link>
            .
          </p>
        </article>

        <article className="panel p-4 md:p-6">
          <h3 className="text-lg font-semibold">Shipping, returns, & warranty</h3>
          <ul className="mt-2 list-disc pl-6 space-y-1 text-[var(--fg-muted)]">
            <li>Fast continental U.S. shipping.</li>
            <li>30-day returns on unopened items.</li>
            <li>
              <span className="font-medium text-[var(--fg)]">180-day kit warranty</span> — we’ll replace or make it right
              for manufacturing defects or items damaged in transit. Normal wear and consumables aren’t covered.
            </li>
          </ul>
          <p className="muted mt-2 text-sm">
            Need a hand with an order?{" "}
            <Link className="underline hover:no-underline" href="/contact">
              Contact support
            </Link>
            .
          </p>
        </article>

        <article className="panel p-4 md:p-6">
          <h3 className="text-lg font-semibold">Who’s behind The Safety Plan?</h3>
          <p className="muted mt-2">
            A mission-driven crew of vets, families, and friends who believe the right gear plus community can save
            lives. Every purchase helps us reach the next person who needs it.
          </p>
        </article>
      </section>
    </main>
  );
}
