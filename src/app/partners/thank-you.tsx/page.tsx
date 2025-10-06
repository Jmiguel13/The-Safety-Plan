// src/app/partners/thank-you/page.tsx
export const runtime = "nodejs";

import Link from "next/link";

export default function PartnersThankYou() {
  return (
    <section className="mx-auto max-w-2xl space-y-6 py-8">
      <h1 className="text-3xl">Request received ✅</h1>
      <p className="text-zinc-400">
        Thanks for reaching out. We’ll review your request and reply with a quote
        and lead time. If this is urgent, email{" "}
        <a className="underline underline-offset-4" href="mailto:contactsafetyplan@yahoo.com">
          contactsafetyplan@yahoo.com
        </a>
        .
      </p>
      <div className="flex gap-3">
        <Link className="btn" href="/kits">View Kits</Link>
        <Link className="btn-ghost" href="/shop">Shop</Link>
        <Link className="btn-ghost" href="/">Home</Link>
      </div>
    </section>
  );
}
