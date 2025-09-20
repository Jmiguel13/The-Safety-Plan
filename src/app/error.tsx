"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      {error?.digest && (
        <p className="mt-2 text-xs text-zinc-500">Error ID: {error.digest}</p>
      )}
      <p className="mt-2 text-sm text-zinc-400">
        {error?.message ?? "An unexpected error occurred."}
      </p>

      <div className="mt-6 flex gap-3">
        <button onClick={() => reset()} className="btn px-4 py-2" type="button">
          Try again
        </button>
        <Link href="/" className="btn-ghost px-4 py-2">
          Go home
        </Link>
      </div>
    </div>
  );
}
