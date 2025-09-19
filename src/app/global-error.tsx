// src/app/global-error.tsx
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
    <html lang="en">
      <body className="min-h-dvh bg-[var(--bg)] text-[var(--fg)] antialiased">
        <section className="mx-auto max-w-3xl px-4 py-16">
          <div className="panel-elevated p-8 space-y-5">
            <p className="text-sm text-red-300/80">Unexpected error</p>
            <h1 className="text-3xl font-extrabold tracking-tight">We hit a snag</h1>
            <p className="muted">
              Something went wrong. You can try again or head back to safety.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={reset} className="btn" aria-label="Retry the last action">
                Try again
              </button>
              <Link href="/" className="btn-ghost" aria-label="Go to home page">
                Go home
              </Link>
            </div>

            {process.env.NODE_ENV !== "production" && (
              <pre className="mt-4 overflow-auto rounded-md border border-white/10 bg-black/40 p-3 text-xs text-zinc-300">
                {error?.message}
                {error?.stack ? "\n\n" + error.stack : ""}
                {error?.digest ? "\n\ndigest: " + error.digest : ""}
              </pre>
            )}
          </div>

          <div className="mt-6 rounded-lg border border-white/10 p-4 text-sm text-zinc-400">
            If you’re in crisis: call{" "}
            <a className="underline underline-offset-2" href="tel:988">
              988
            </a>{" "}
            (Veterans press 1) or text{" "}
            <a className="underline underline-offset-2" href="sms:838255">
              838255
            </a>
            .
          </div>
        </section>
      </body>
    </html>
  );
}
