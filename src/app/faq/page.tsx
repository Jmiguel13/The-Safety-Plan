// src/app/faq/page.tsx
import type { Metadata } from "next";
import StructuredData, { type JsonLdObject } from "@/components/StructuredData";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about donations, shipping, returns, and our mission to support veteran suicide prevention.",
  alternates: { canonical: "/faq" },
};

type FAQ = {
  id: string;
  q: string;
  a: React.ReactNode;
  /** Special style/placement */
  variant?: "crisis" | "default";
};

const SUPPORT_EMAIL = "contactsafetyplan@yahoo.com";

/** Put CRISIS first and mark it as special */
const faqs: FAQ[] = [
  {
    id: "crisis",
    variant: "crisis",
    q: "What if I’m in crisis right now?",
    a: (
      <>
        If you or someone you know is in immediate danger, call{" "}
        <a className="underline" href="tel:988">988</a> (Veterans press 1) or
        text{" "}
        <a className="underline" href="sms:838255">838255</a>. We’re here to help
        connect resources, but we are <em>not</em> an emergency service.
      </>
    ),
  },

  {
    id: "donations-how-it-works",
    q: "How do donations work?",
    a: (
      <>
        We use Stripe to securely process donations. You can choose a preset
        amount or enter a custom amount. Every donation funds resources for
        veterans in crisis and our outreach efforts. If you need a receipt,
        it’s emailed automatically after checkout.
      </>
    ),
  },
  {
    id: "donations-tax",
    q: "Are donations tax-deductible?",
    a: (
      <>
        Not at this time. We’re focused on rapid deployment and direct support
        for veterans. If/when a 501(c)(3) arm is established, we’ll update this
        page and your receipts accordingly.
      </>
    ),
  },
  {
    id: "kits-what-are-they",
    q: "What’s in the kits?",
    a: (
      <>
        Two mission-first kits:
        <ul className="mt-2 list-disc pl-5 text-zinc-300">
          <li>
            <strong>Resilient Kit</strong> — daily carry: focus, hydration,
            recovery, rest.
          </li>
          <li>
            <strong>Homefront Kit</strong> — home base support: hydration,
            vitamins, recovery, and rest.
          </li>
        </ul>
        <div className="mt-3">
          See details on <Link href="/kits" className="underline">the kits page</Link>.
        </div>
      </>
    ),
  },
  {
    id: "shipping",
    q: "How long does shipping take?",
    a: (
      <>
        Most orders ship within 2–4 business days. You’ll receive a tracking
        link via email as soon as your order is on the way. If something looks
        delayed, reply to your order email and we’ll help.
      </>
    ),
  },
  {
    id: "returns",
    q: "What’s the returns/refunds policy?",
    a: (
      <>
        Unopened kits can be returned within 30 days of delivery. For opened
        consumables, contact us and we’ll work with you on a fair resolution.
        Donations are not refundable once processed, but mistakes happen — reach
        out and we’ll review case-by-case.
      </>
    ),
  },
  {
    id: "contact",
    q: "How do I contact support?",
    a: (
      <>
        Email us at{" "}
        <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
          {SUPPORT_EMAIL}
        </a>{" "}
        and include your order number (if applicable). For urgent issues related
        to a current donation or checkout, reply to your Stripe receipt email — it
        routes fastest.
      </>
    ),
  },
];

// Strictly typed JSON-LD (no `any`)
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, id }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: {
      "@type": "Answer",
      text:
        id === "donations-how-it-works"
          ? "We use Stripe to securely process donations. Receipts are emailed automatically."
          : id === "donations-tax"
          ? "Not at this time; we will update if/when a 501(c)(3) arm is established."
          : id === "kits-what-are-they"
          ? "Resilient (daily carry) and Homefront (home support) kits designed around focus, hydration, recovery, and rest."
          : id === "shipping"
          ? "Most orders ship within 2–4 business days with email tracking."
          : id === "returns"
          ? "Unopened kits refundable within 30 days. Donations are generally non-refundable."
          : id === "contact"
          ? `Email ${SUPPORT_EMAIL} and include your order number.`
          : "Call 988 (Veterans press 1) or text 838255 for immediate help.",
    },
    url: `/faq#${id}`,
  })),
} satisfies JsonLdObject;

export default function FAQPage() {
  return (
    <>
      {/* Page-level JSON-LD */}
      <StructuredData data={faqJsonLd} />

      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
          <p className="mt-2 text-zinc-400">
            Quick answers about donations, kits, shipping, and support.
          </p>
        </header>

        <div className="grid gap-3">
          {faqs.map(({ q, a, id, variant }) => {
            const isCrisis = variant === "crisis";
            const wrapper =
              "group rounded-lg p-4 " +
              (isCrisis
                ? "border border-red-500/40 bg-red-500/10"
                : "border border-white/10 bg-white/[0.03]");
            const iconColor = isCrisis ? "text-red-200" : "text-white/90";

            return (
              <details key={id} id={id} className={wrapper} open={isCrisis}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <span className="text-base font-medium">
                    {isCrisis ? (
                      <span className="inline-flex items-center gap-2">
                        <span aria-hidden className="inline-block size-2 rounded-full bg-red-300" />
                        {q}
                      </span>
                    ) : (
                      q
                    )}
                  </span>
                  <svg
                    className={`size-5 shrink-0 transition-transform group-open:rotate-180 ${iconColor}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .92 1.18l-4.2 3.33a.75.75 0 0 1-.92 0l-4.2-3.33a.75.75 0 0 1-.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </summary>
                <div className={`mt-3 ${isCrisis ? "text-red-100/90" : "text-zinc-300"}`}>
                  {a}
                </div>
              </details>
            );
          })}
        </div>

        <section aria-label="Need more help" className="mt-10">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm text-zinc-300">
              Still stuck?{" "}
              <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
                Email support
              </a>{" "}
              or browse our <Link href="/kits" className="underline">kits</Link>.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
