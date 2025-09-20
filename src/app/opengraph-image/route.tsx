// src/app/opengraph-image/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

// 1200x630 is the de-facto OG size
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Prefer your new hero; gracefully fall back to a neutral gradient
const HERO_CANDIDATES = [
  "/images/hero-safety-plan.webp",
  "/images/hero-safety-plan.jpg",
  "/images/hero-safety-plan.png",
  "/hero-tactical.jpg", // legacy fallback if still present
];

async function findHeroURL(req: Request): Promise<string | null> {
  const { protocol, host } = new URL(req.url);
  const origin = `${protocol}//${host}`;

  for (const rel of HERO_CANDIDATES) {
    try {
      const url = `${origin}${rel}`;
      const res = await fetch(url, { method: "HEAD", cache: "no-store" });
      if (res.ok) return url;
    } catch {
      // ignore and try next candidate
    }
  }
  return null;
}

export async function GET(req: Request) {
  const heroUrl = await findHeroURL(req);

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          position: "relative",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial",
          background: "#0b1012",
        }}
      >
        {/* Background image (if available) */}
        {heroUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroUrl}
            alt=""
            width={size.width}
            height={size.height}
            style={{
              position: "absolute",
              inset: 0,
              objectFit: "cover",
              filter: "saturate(1.05) contrast(1.05) brightness(0.9)",
            }}
          />
        ) : (
          // Soft gradient fallback that matches the site palette
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(900px 420px at 20% 0%, rgba(16,185,129,.22), transparent 60%), radial-gradient(900px 420px at 100% 25%, rgba(56,189,248,.20), transparent 60%), #0b1012",
            }}
          />
        )}

        {/* Dark veil for text legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,.5), rgba(0,0,0,.35) 40%, rgba(0,0,0,.6))",
          }}
        />

        {/* Copy block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 64,
            gap: 16,
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "#d1fae5",
              background: "rgba(16,185,129,.12)",
              border: "1px solid rgba(16,185,129,.35)",
              padding: "8px 12px",
              borderRadius: 999,
              fontSize: 26,
              lineHeight: 1,
              fontWeight: 600,
              width: "fit-content",
            }}
          >
            The Safety Plan
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              color: "white",
              maxWidth: 960,
              textShadow: "0 2px 8px rgba(0,0,0,.45)",
            }}
          >
            <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -1 }}>
              Wellness with a mission
            </div>
            <div style={{ fontSize: 34, color: "#cbd5e1" }}>
              Balanced essentials for performance and recovery — with impact built in.
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
