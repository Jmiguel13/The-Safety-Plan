export const runtime = "nodejs";

import type { Metadata } from "next";
import { BRAND, CONTACT } from "@/lib/blank";
import { REPACK_POLICY } from "@/lib/kits-bom";

export const metadata: Metadata = {
  title: "Disclosures — The Safety Plan",
  description:
    "Assembly, repackaging, supplement labeling, allergens, and contact details.",
  alternates: { canonical: "/disclosures" },
};

// Optional: set your Google Business Profile URL in env
const GBP_URL = (process.env.NEXT_PUBLIC_BLANK_GBP_URL ?? "").trim();

export default function DisclosuresPage() {
  return (
    <main className="container space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Disclosures</h1>
        <p className="muted mt-2">
          Transparency for how our kits are assembled, how consumables are
          handled, and where to go for questions or concerns.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Assembly</h2>
        <p>
          Kits are assembled by <strong>{BRAND.name}</strong> using products
          sourced from third-party manufacturers and authorized distributors.
          Items arrive in their original retail packaging unless noted.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Repackaging</h2>
        <p className="whitespace-pre-wrap">{REPACK_POLICY}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Supplement Facts &amp; Allergens</h2>
        <p>
          For any consumable, always refer to the manufacturer’s label for
          complete Supplement Facts, usage directions, warnings, and allergen
          information. If a repackaged unit is provided, it is labeled with the
          original product name, serving size, lot, and best-by information
          where applicable.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Quality &amp; Lot Tracking</h2>
        <p>
          We maintain lot tracking for outbound shipments. If you have a
          question about a specific item, contact us with your order number so
          we can locate the associated lot information.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>
          Questions or concerns?{" "}
          {CONTACT.email ? (
            <>
              Email{" "}
              <a className="underline" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
              {CONTACT.phone ? " • " : null}
            </>
          ) : null}
          {CONTACT.phone ? <span>Call {CONTACT.phone}</span> : null}.
        </p>
      </section>

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
    </main>
  );
}
