// next.config.ts
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const useReactCompiler =
  process.env.REACT_COMPILER === "1" ||
  process.env.REACT_COMPILER?.toLowerCase() === "true";

// Build a CSP string. In dev we allow react-refresh requirements.
const csp = [
  "default-src 'self'",
  // Dev needs 'unsafe-eval' (react-refresh) and sometimes blob: for chunks
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' blob:" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  // Dev needs websocket + localhost for HMR / refresh overlay
  `connect-src 'self' https:${isDev ? " ws: http://localhost:*" : ""}`,
  "font-src 'self' https: data:",
  // Dev may create workers from blob:
  `worker-src 'self'${isDev ? " blob:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
].join("; ");

const baseConfig: NextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

const nextConfig: NextConfig = useReactCompiler
  ? { ...baseConfig, experimental: { reactCompiler: true } }
  : baseConfig;

export default nextConfig;
