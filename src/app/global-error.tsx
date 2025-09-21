// src/app/global-error.tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-muted-foreground">
            {error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={() => reset()}
            className="mt-6 rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            Try again
          </button>
          {error?.digest && (
            <p className="mt-3 text-xs text-muted-foreground">
              Error ID: <code>{error.digest}</code>
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
