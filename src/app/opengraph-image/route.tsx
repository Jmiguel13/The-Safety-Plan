// src/app/opengraph-image/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

function getHost(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try {
    return new URL(raw).host;
  } catch {
    return "localhost:3000";
  }
}

export async function GET() {
  const host = getHost();

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 48,
          color: "#e8f1f2",
          background:
            "radial-gradient(900px 420px at 15% -10%, rgba(59,130,246,.18), transparent 60%)," +
            "radial-gradient(800px 360px at 100% 20%, rgba(16,185,129,.16), transparent 60%)," +
            "#0d1315",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 24, opacity: 0.9 }}>
          <div style={{ width: 12, height: 12, borderRadius: 9999, background: "#36d399" }} />
          <span>Mission-first wellness kits</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -1, lineHeight: 1.04 }}>
            The Safety Plan
          </div>
          <div style={{ fontSize: 34, color: "#a9b5b7", maxWidth: 900 }}>
            Focus • Recovery • Hydration • Rest — every order funds veteran suicide prevention.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 16,
            fontSize: 28,
            color: "#c9e8ff",
          }}
        >
          <span>{host}</span>
          <span style={{ fontSize: 22, color: "#e8f1f2", opacity: 0.9 }}>Share • Save a life</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
