// src/app/error.tsx
"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-dvh grid place-items-center bg-black text-white px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
        <p className="text-zinc-400">If this keeps happening, please try again later.</p>
        {error?.digest && (
          <p className="mt-2 text-xs text-zinc-500">Error ID: {error.digest}</p>
        )}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="btn"
          >
            Try again
          </button>
          <Link href="/" className="btn-ghost">Go home</Link>
        </div>
      </div>
    </main>
  );
}
