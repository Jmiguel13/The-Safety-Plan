// src/app/kits/[slug]/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] grid place-items-center px-6">
      <div className="text-center space-y-4 max-w-md">
        <div className="tag tag-accent w-max mx-auto">404</div>
        <h1 className="text-4xl font-extrabold tracking-tight">Kit not found</h1>
        <p className="muted">
          The kit you’re looking for doesn’t exist or isn’t published yet.
        </p>
        <div className="flex items-center justify-center gap-3 pt-1">
          <Link href="/" className="btn">Go home</Link>
          <Link href="/kits" className="btn-ghost" aria-label="View all kits">
            View all kits
          </Link>
        </div>
      </div>
    </section>
  );
}
