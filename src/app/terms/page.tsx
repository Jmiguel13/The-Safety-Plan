export const runtime = "nodejs";

import type { Metadata } from "next";
import { BRAND, CONTACT } from "@/lib/blank";

export const metadata: Metadata = {
  title: "Terms & Conditions — The Safety Plan",
  description: "Purchase terms, returns, disclaimers, and user responsibilities.",
};

export default function TermsPage() {
  return (
    <main className="container space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Terms &amp; Conditions</h1>
        <p className="muted mt-2">
          Please review these terms before purchasing or using our products and site.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Company</h2>
        <p>
          “We”, “us”, and “our” refer to <strong>{BRAND.legalName ?? BRAND.name}</strong>.
          By accessing this website or purchasing products, you agree to these terms.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Orders &amp; Payment</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Prices and availability are subject to change without notice.</li>
          <li>We reserve the right to refuse or cancel any order for any reason.</li>
          <li>Taxes and shipping charges are calculated at checkout where applicable.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Returns</h2>
        <p>
          For health and safety reasons, consumable items are not returnable once opened.
          If a product arrives damaged or incorrect, contact us within 14 days and we’ll help.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">No Medical Advice</h2>
        <p>
          Information provided by us is for general wellness purposes only and is not
          intended to diagnose, treat, cure, or prevent any disease. Consult a licensed
          medical professional before using any new supplement or regimen.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Use at Your Discretion</h2>
        <p>
          You are responsible for ensuring that any product is appropriate for your needs
          and that you follow the manufacturer’s directions and warnings.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, {BRAND.legalName ?? BRAND.name} shall
          not be liable for indirect, incidental, special, or consequential damages
          arising from your use of the site or products.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>
          {CONTACT.email ? (
            <>Email <a className="underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></>
          ) : null}
          {CONTACT.email && CONTACT.phone ? " • " : null}
          {CONTACT.phone ? <>Phone {CONTACT.phone}</> : null}
        </p>
      </section>
    </main>
  );
}
