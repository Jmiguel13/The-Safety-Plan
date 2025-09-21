// src/app/donate/cancel/page.tsx
import Link from "next/link";

export const metadata = { title: "Checkout canceled" };

export default function CancelPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4">
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 rounded-full bg-yellow-300" />
          <h1 className="text-xl font-semibold">Checkout canceled</h1>
        </div>
        <p className="mt-2 text-sm text-yellow-200/90">
          No charge was made. You can continue browsing and try again anytime.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/kits"
          className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-300"
        >
          Back to kits
        </Link>
        <Link
          href="/"
          className="rounded-full border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900"
        >
          Home
        </Link>
      </div>
    </section>
  );
}
