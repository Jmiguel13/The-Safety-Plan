// src/app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "The Safety Plan";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(135deg, #0a0a0a 0%, #111827 100%)",
          color: "white",
          fontFamily: "system-ui, Segoe UI, Roboto, Inter",
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: -1 }}>
          THE SAFETY PLAN
        </div>
        <div style={{ marginTop: 12, fontSize: 28, opacity: 0.85 }}>
          Mission-first wellness kits — focus, recovery, hydration, rest.
        </div>
        <div style={{ marginTop: 28, fontSize: 22, opacity: 0.7 }}>
          Every purchase supports veteran suicide prevention.
        </div>
      </div>
    ),
    { ...size }
  );
}

