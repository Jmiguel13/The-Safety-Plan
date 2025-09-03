// next.config.ts
import type { NextConfig } from "next";

const useReactCompiler =
  process.env.REACT_COMPILER === "1" ||
  process.env.REACT_COMPILER?.toLowerCase() === "true";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "connect-src 'self' https:",
  "font-src 'self' https: data:",
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
