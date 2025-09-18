"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log for dev
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-dvh bg-black text-white p-6">
        <h2 className="text-lg font-semibold">App crashed</h2>
        <p className="mt-2 opacity-80">{error?.message ?? "Unknown error"}</p>
        <button
          className="mt-4 rounded-md border border-white/20 px-3 py-1 text-sm hover:bg-white/10"
          onClick={() => reset()}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
