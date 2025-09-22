import { ImageResponse } from "next/og";

export const runtime = "edge"; // ok on route handlers

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#0b0b0b",
          color: "#fff",
          padding: 64,
          letterSpacing: "-0.02em",
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 800, marginBottom: 16 }}>
          The Safety Plan
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.9,
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          Wellness kits for frontline fighters. Every purchase helps prevent veteran suicide.
        </div>
      </div>
    ),
    { width: 1200, height: 630 } // <- put size here for route handlers
  );
}
