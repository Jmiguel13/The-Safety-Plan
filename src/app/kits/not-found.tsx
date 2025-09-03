// app/kits/[slug]/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white grid place-items-center px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Kit not found</h1>
        <p className="text-zinc-400">The kit you’re looking for doesn’t exist or isn’t published.</p>
        <Link href="/kits" className="inline-block mt-6 underline">
          View all kits
        </Link>
      </div>
    </main>
  );
}
