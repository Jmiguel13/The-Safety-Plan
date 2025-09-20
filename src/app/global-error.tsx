"use client";

import Link from "next/link";

/**
 * Global error boundary. This file REPLACES the root layout when thrown,
 * so it MUST render its own <html> and <body>. Avoid Tailwind here because
 * the root layout (which imports global CSS) is not rendered.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Minimal inline styles so this looks sane without the app's CSS
  const pageStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    backgroundColor: "#0d1315",
    color: "#e8f1f2",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  };
  const wrapStyle: React.CSSProperties = {
    maxWidth: 720,
    margin: "0 auto",
    padding: "3rem 1.25rem",
  };
  const h1Style: React.CSSProperties = {
    fontSize: "1.5rem",
    fontWeight: 700,
    margin: 0,
  };
  const pMuted: React.CSSProperties = { color: "#a9b5b7", fontSize: 14, marginTop: 8 };
  const row: React.CSSProperties = { display: "flex", gap: 12, marginTop: 24 };
  const btn: React.CSSProperties = {
    appearance: "none",
    border: "1px solid #1f2a2f",
    borderRadius: 9999,
    padding: "0.5rem 1rem",
    background: "rgba(255,255,255,0.06)",
    color: "#e8f1f2",
    cursor: "pointer",
  };
  const ghost: React.CSSProperties = {
    ...btn,
    background: "transparent",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  };
  const link: React.CSSProperties = { color: "#c9e8ff", textDecoration: "none" };

  return (
    <html lang="en" suppressHydrationWarning>
      <body style={pageStyle}>
        <div style={wrapStyle} role="alert" aria-live="polite">
          <h1 style={h1Style}>App crashed</h1>

          {error?.digest ? (
            <p style={{ ...pMuted, fontSize: 12 }}>Error ID: {error.digest}</p>
          ) : null}

          <p style={pMuted}>{error?.message ?? "An unexpected error occurred."}</p>

          <div style={row}>
            <button type="button" onClick={() => reset()} style={btn}>
              Try again
            </button>
            {/* Internal navigation must use <Link /> for Next lint rule */}
            <Link href="/" style={ghost}>
              Go home
            </Link>
          </div>

          <p style={{ ...pMuted, marginTop: 24 }}>
            In crisis? Call <a href="tel:988" style={link}>988</a> (Veterans press 1) or text{" "}
            <a href="sms:838255" style={link}>838255</a>.
          </p>
        </div>
      </body>
    </html>
  );
}
