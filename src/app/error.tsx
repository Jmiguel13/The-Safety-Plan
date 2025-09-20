"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Optional server/console reporting
  console.error(error);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12" role="alert" aria-live="polite">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>

      {error?.digest ? (
        <p className="mt-2 text-xs text-zinc-500">Error ID: {error.digest}</p>
      ) : null}

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

      {/* Crisis help inline (non-blocking) */}
      <p className="mt-6 text-xs text-zinc-500">
        In crisis? Call <a className="underline" href="tel:988">988</a> (Veterans press 1) or
        text <a className="underline" href="sms:838255">838255</a>.
      </p>
    </div>
  );
}
