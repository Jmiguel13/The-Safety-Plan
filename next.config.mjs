// next.config.mjs
/** @type {import('next').NextConfig} */

// Dev/preview-friendly: allow Next inline/eval/WS/etc so the app can boot.
const cspLoose = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https: http: ws: wss:",
  "media-src 'self' blob: data:",
  "object-src 'none'",
  "form-action 'self'",
].join('; ');

// Tighten later (you’ll likely move to nonces or hashes in real prod).
const cspStrict = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  "script-src 'self'", // TODO: swap to nonce/hashes when you’re ready
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "media-src 'self' blob: data:",
  "object-src 'none'",
  "form-action 'self'",
].join('; ');

// Only turn on the strict CSP when you ask for it.
const nextConfig = {
  async headers() {
    const strict = process.env.NEXT_STRICT_CSP === '1';
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Content-Security-Policy', value: strict ? cspStrict : cspLoose }],
      },
    ];
  },
};

export default nextConfig;
