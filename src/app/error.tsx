// src/app/error.tsx
"use client";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-neutral-400">
        {error?.message || "An unexpected error occurred."}
      </p>
      <div className="mt-6 flex gap-3">
        <button onClick={() => reset()} className="rounded-md border px-3 py-2 text-sm">
          Try again
        </button>
        <Link href="/" className="rounded-md bg-white/10 px-3 py-2 text-sm">
          Go home
        </Link>
      </div>
    </div>
  );
}
