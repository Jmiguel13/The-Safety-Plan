// app/error.tsx
"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  return (
    <html>
      <body className="min-h-screen bg-black text-white grid place-items-center px-6">
        <div className="text-center max-w-lg">
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-zinc-400">{error.message || "Unexpected error"}</p>
          <button
            onClick={reset}
            className="mt-6 rounded-lg px-5 py-3 bg-white text-black hover:bg-zinc-200"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
