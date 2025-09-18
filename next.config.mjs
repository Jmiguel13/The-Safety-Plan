// next.config.mjs

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const cspProd = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "media-src 'self' blob: data:",
  "object-src 'none'",
  "form-action 'self'",
].join("; ");

const nextConfig = {
  async headers() {
    if (!isProd) {
      // DEV: no CSP at all to avoid inline-script blocks
      return [];
    }
    // PROD: strict CSP
    return [
      {
        source: "/:path*",
        headers: [{ key: "Content-Security-Policy", value: cspProd }],
      },
    ];
  },
};

export default nextConfig;
