// src/app/global-error.tsx
"use client";

export default function GlobalError(props: {
  error: Error & { digest?: string };
  reset?: () => void;
}) {
  const { error, reset } = props;
  const onClick = () => (typeof reset === "function" ? reset() : location.reload());
  return (
    <html>
      <body className="min-h-dvh p-6">
        <h2 className="text-lg font-semibold">App crashed</h2>
        <p className="mt-2 text-sm opacity-80">{error?.message}</p>
        <button onClick={onClick} className="mt-4 rounded-md border px-3 py-1 text-sm">
          Reload
        </button>
      </body>
    </html>
  );
}
