"use client";

/**
 * Global error boundary for crashes before layouts render.
 * This file MUST wrap output with <html> and <body>.
 * https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-errors-globally
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="bg-black text-white">
      <body>
        <main className="min-h-dvh grid place-items-center px-6">
          <div className="text-center space-y-3">
            <div className="tag tag-accent w-max mx-auto">App error</div>
            <h1 className="text-2xl font-extrabold tracking-tight">Something went wrong</h1>
            <p className="muted text-sm">{error?.message ?? "Unexpected error"}</p>
            <button type="button" className="btn" onClick={() => reset()}>
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
