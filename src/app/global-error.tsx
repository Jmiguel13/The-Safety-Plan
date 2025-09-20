"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-2xl font-semibold">App crashed</h1>
          {error?.digest && (
            <p className="mt-2 text-xs text-zinc-500">Error ID: {error.digest}</p>
          )}
          <p className="mt-2 text-sm text-zinc-400">
            {error?.message ?? "An unexpected error occurred."}
          </p>

          <button onClick={() => reset()} className="btn mt-6 px-4 py-2" type="button">
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
