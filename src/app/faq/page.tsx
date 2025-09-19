// src/app/faq/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { myShopLink } from "@/lib/amway";

export const metadata: Metadata = {
  title: "FAQ — The Safety Plan",
  description: "Answers about kits, ordering, shipping, and our mission.",
};

export default function FaqPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
        <p className="muted">Kits, ordering, and mission details.</p>

        {/* Quick anchors (the “buttons” you wanted back) */}
        <nav aria-label="FAQ shortcuts" className="mt-3 flex flex-wrap gap-2">
          <a href="#kits" className="link-chip">What’s in the kits?</a>
          <a href="#ordering" className="link-chip">How do I order?</a>
          <a href="#veteran-awareness" className="link-chip">Resources</a>
          <a href="#support" className="link-chip">How else can I help?</a>
        </nav>
      </header>

      {/* Kits */}
      <article id="kits" className="faq-card">
        <h2 className="text-xl font-semibold">What’s in the kits?</h2>
        <p className="muted">
          Each kit focuses on clean energy, hydration, recovery, and rest. Exact contents can vary
          slightly by availability, but the outcome is consistent: mission-ready wellness.
        </p>
        <div className="mt-3">
          <Link href="/kits" className="link-chip">Browse Kits</Link>
        </div>
      </article>

      {/* Ordering */}
      <article id="ordering" className="faq-card">
        <h2 className="text-xl font-semibold">How do I order?</h2>
        <p className="muted">
          Use our storefront to purchase directly. UTM tracking helps us measure mission impact.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={myShopLink("/")}
            target="_blank"
            rel="noopener noreferrer"
            className="link-chip"
          >
            Open Storefront
          </a>
          <Link href="/donate" className="link-chip">Donate Instead</Link>
        </div>
      </article>

      {/* Resources */}
      <article id="veteran-awareness" className="faq-card">
        <h2 className="text-xl font-semibold">Veteran awareness & resources</h2>
        <p className="muted">
          If you or someone you know is struggling, you’re not alone. Consider talking to a trusted
          person and reaching out to support resources in your area.
        </p>
        <ul className="mt-3 grid gap-2 text-sm">
          <li>
            <a className="link-chip tel" href="tel:988">Call 988 (US)</a>
            <span className="muted ml-2">— 24/7 Suicide & Crisis Lifeline</span>
          </li>
          <li>
            <a className="link-chip sms" href="sms:988">Text 988 (US)</a>
            <span className="muted ml-2">— Text line for crisis support</span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-zinc-500">
          In emergencies, call your local emergency number immediately.
        </p>
      </article>

      {/* Support the mission */}
      <article id="support" className="faq-card">
        <h2 className="text-xl font-semibold">How else can I help?</h2>
        <p className="muted">Share the mission, sponsor a kit, or donate to fund more distributions.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/donate" className="btn">Donate</Link>
          <Link href="/kits" className="btn-ghost">Explore Kits</Link>
        </div>
      </article>
    </section>
  );
}
