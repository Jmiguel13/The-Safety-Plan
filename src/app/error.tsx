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
    <div className="min-h-[70vh] grid place-items-center px-6">
      <div className="text-center space-y-4 max-w-md">
        <div className="tag tag-accent w-max mx-auto">Error</div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Something went wrong
        </h1>
        <p className="muted text-sm">
          {error?.message ?? "Unexpected error."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button type="button" className="btn" onClick={() => reset()}>
            Try again
          </button>
          <Link href="/" className="btn-ghost">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
