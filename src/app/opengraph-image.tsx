// src/app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const title = "The Safety Plan";
  const subtitle = "Mission-first wellness kits";
  const strap = "Focus • Hydration • Recovery • Rest";

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          alignItems: "stretch",
          justifyContent: "stretch",
          background:
            "linear-gradient(180deg, rgba(0,0,0,.6), rgba(0,0,0,.6)), radial-gradient(800px 420px at 15% 0%, rgba(56,189,248,.22), transparent), radial-gradient(900px 520px at 100% 60%, rgba(16,185,129,.20), transparent), #0b1113",
          color: "#e8f1f2",
          fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
          letterSpacing: "-0.01em",
        }}
      >
        {/* Grid inset panel */}
        <div
          style={{
            display: "flex",
            flex: 1,
            padding: "56px 64px",
            border: "1px solid rgba(255,255,255,.08)",
            margin: 16,
            borderRadius: 20,
            background:
              "repeating-linear-gradient(0deg, rgba(255,255,255,.02) 0px, rgba(255,255,255,.02) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, rgba(255,255,255,.02) 0px, rgba(255,255,255,.02) 1px, transparent 1px, transparent 24px), rgba(255,255,255,.02)",
          }}
        >
          {/* Left: Copy */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
            <div
              style={{
                fontSize: 72,
                fontWeight: 800,
                lineHeight: 1.02,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 600,
                color: "#cfe8ee",
              }}
            >
              {subtitle}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 26,
                color: "#a9b5b7",
              }}
            >
              {strap}
            </div>

            {/* Footer chips */}
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <div
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,.14)",
                  background: "rgba(255,255,255,.04)",
                  fontSize: 20,
                }}
              >
                thesafetyplan.org
              </div>
              <div
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,.14)",
                  background: "rgba(255,255,255,.04)",
                  fontSize: 20,
                }}
              >
                Every purchase supports prevention
              </div>
            </div>
          </div>

          {/* Right: simple abstract motif */}
          <div
            style={{
              width: 360,
              height: "100%",
              borderLeft: "1px solid rgba(255,255,255,.08)",
              marginLeft: 32,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(240px 160px at 30% 30%, rgba(16,185,129,.35), transparent 60%), radial-gradient(300px 200px at 80% 70%, rgba(59,130,246,.35), transparent 60%)",
                filter: "blur(2px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "conic-gradient(from 180deg at 60% 40%, rgba(255,255,255,.05), transparent 120deg, transparent 240deg, rgba(255,255,255,.05) 360deg)",
                mixBlendMode: "screen",
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
