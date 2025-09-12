"use client";

/**
 * Route-level error boundary. This renders inside your layout's <main>.
 * Do NOT include <html> or <body> here.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] grid place-items-center px-6">
      <div className="text-center space-y-3">
        <div className="tag tag-accent w-max mx-auto">Something went wrong</div>
        <h1 className="text-2xl font-extrabold tracking-tight">Something went wrong</h1>
        <p className="muted text-sm">{error?.message ?? "Unexpected error"}</p>
        <button type="button" className="btn" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </div>
  );
}
