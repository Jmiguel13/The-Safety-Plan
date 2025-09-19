// src/app/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="mx-auto max-w-2xl rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-100"
    >
      <h2 className="font-semibold tracking-tight">Something went wrong.</h2>
      <p className="mt-1 text-sm opacity-80">
        Please try again. If the issue persists, let us know.
      </p>

      <div className="mt-3 flex gap-2">
        <button onClick={() => reset()} className="btn px-3 py-1">
          Try again
        </button>
        <Link href="/" className="btn-ghost px-3 py-1">
          Home
        </Link>
      </div>

      {error?.digest ? (
        <p className="mt-3 text-xs opacity-60">Error ID: {error.digest}</p>
      ) : null}
    </div>
  );
}
