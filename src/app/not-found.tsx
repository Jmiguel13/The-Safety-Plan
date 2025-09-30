// src/app/not-found.tsx
import Link from "next/link";
import { getSiteConfig, formatTelHuman, telHref, smsHref } from "@/lib/site";

export default function NotFound() {
  const { CRISIS_TEL, CRISIS_SMS } = getSiteConfig();

  return (
    <section className="container py-16 space-y-6">
      <h1 className="text-4xl font-extrabold tracking-tight">Page not found</h1>
      <p className="muted">
        We couldn’t find what you were looking for. Try one of these:
      </p>

      <div className="flex flex-wrap gap-3 pt-2">
        <Link href="/" className="btn">Home</Link>
        <Link href="/shop" className="btn-ghost">Shop</Link>
        <Link href="/kits" className="btn-ghost">Kits</Link>
        <Link href="/faq" className="btn-ghost">FAQ</Link>
      </div>

      <div
        role="region"
        aria-label="Crisis support"
        className="panel-elevated p-4 text-sm"
      >
        <strong className="font-semibold">In crisis?</strong>{" "}
        Call{" "}
        <a className="link-chip tel" href={telHref(CRISIS_TEL)}>
          {formatTelHuman(CRISIS_TEL)}
        </a>{" "}
        (Veterans press 1) or text{" "}
        <a className="link-chip sms" href={smsHref(CRISIS_SMS)}>
          {CRISIS_SMS}
        </a>
        .
      </div>
    </section>
  );
}
