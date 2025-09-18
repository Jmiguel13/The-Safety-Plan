"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // optionally log to your APM
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-zinc-400">
        {error?.message ?? "Unexpected error."}
      </p>
      {error?.digest && (
        <p className="mt-1 text-xs text-zinc-500">Digest: {error.digest}</p>
      )}
      <button onClick={() => reset()} className="btn mt-6">
        Try again
      </button>
    </div>
  );
}
