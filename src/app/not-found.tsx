// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl py-16 space-y-6">
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

      <div className="panel-elevated p-4 text-sm">
        <strong className="font-semibold">In crisis?</strong>{" "}
        Call <a className="link-chip tel" href="tel:988">988</a> (Veterans press 1) or text{" "}
        <a className="link-chip sms" href="sms:838255">838255</a>.
      </div>
    </section>
  );
}
