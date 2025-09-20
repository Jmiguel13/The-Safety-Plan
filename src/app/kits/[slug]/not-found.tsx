// src/app/kits/[slug]/not-found.tsx
import Link from "next/link";

export default function KitNotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Kit not found</h1>
      <p className="mt-2 text-zinc-400">
        We couldn’t find that kit. Try browsing all kits instead.
      </p>
      <div className="mt-6">
        <Link href="/kits" className="btn">
          Browse kits
        </Link>
      </div>
    </main>
  );
}
