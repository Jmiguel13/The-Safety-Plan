// src/app/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-level error boundary. Renders inside <main> from your RootLayout.
 * Do NOT include <html> or <body> here.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log for debugging/observability
  useEffect(() => {
    console.error("[Route Error]", error);
  }, [error]);

  const isProd = process.env.NODE_ENV === "production";
  const message =
    error?.message?.trim() ||
    "Unexpected error. Please try again or return to the homepage.";

  return (
    <div className="min-h-[70vh] grid place-items-center px-6">
      <div className="text-center space-y-4 max-w-lg">
        <div className="tag tag-accent w-max mx-auto">Something went wrong</div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          We hit a snag
        </h1>

        <p className="muted text-sm md:text-base">{message}</p>

        {/* Helpful actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <button type="button" className="btn" onClick={() => reset()}>
            Try again
          </button>
          <Link href="/" className="btn-ghost">
            Go home
          </Link>
        </div>

        {/* Diagnostics (hidden in prod) */}
        {!isProd ? (
          <details className="mt-2 text-left panel p-4">
            <summary className="cursor-pointer font-medium">Debug details</summary>
            <pre className="mt-2 text-xs whitespace-pre-wrap break-words">
              {error?.stack || "(no stack available)"}
            </pre>
            {error?.digest ? (
              <p className="mt-2 text-xs muted">Digest: {error.digest}</p>
            ) : null}
          </details>
        ) : null}
      </div>
    </div>
  );
}
