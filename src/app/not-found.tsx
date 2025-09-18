import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] grid place-items-center px-6">
      <div className="text-center space-y-3">
        <div className="tag tag-accent w-max mx-auto">404</div>
        <h1 className="text-4xl font-extrabold tracking-tight">Kit not found</h1>
        <p className="muted max-w-md mx-auto">
          The kit you are looking for doesn’t exist or isn’t published.
        </p>
        <div className="flex items-center justify-center gap-3 pt-1">
          <Link href="/" className="btn">Go home</Link>
          <Link href="/kits" className="btn-ghost" aria-label="View all kits">View All Kits</Link>
        </div>
      </div>
    </main>
  );
}

