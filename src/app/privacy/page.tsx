export const runtime = "nodejs";

import type { Metadata } from "next";
import { BRAND, CONTACT } from "@/lib/blank";

export const metadata: Metadata = {
  title: "Privacy Policy — The Safety Plan",
  description: "How we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <main className="container space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="muted mt-2">
          We respect your privacy. This policy explains what we collect and how we use it.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Account and order information you provide during checkout.</li>
          <li>Basic analytics and device information used to improve the site.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">How We Use Information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>To process orders, provide support, and improve our products.</li>
          <li>To send transactional messages related to your order.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Sharing</h2>
        <p>
          We do not sell your personal information. We share only as needed with service
          providers (e.g., payment processing, fulfillment) to operate the business.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Data Security</h2>
        <p>
          We take reasonable measures to protect information; however no system is 100% secure.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>
          For privacy requests or questions, contact{" "}
          {CONTACT.email ? (
            <a className="underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          ) : (
            <span>{BRAND.name}</span>
          )}
          {CONTACT.phone ? <> • {CONTACT.phone}</> : null}.
        </p>
      </section>
    </main>
  );
}
