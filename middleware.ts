// middleware.ts
import { NextResponse } from "next/server";

const isStrict = process.env.NEXT_STRICT_CSP === "1";

function securityHeaders() {
  const h = new Headers();

  // Always-on safety headers
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  h.set("X-Content-Type-Options", "nosniff");
  h.set("X-Frame-Options", "DENY");
  h.set("X-DNS-Prefetch-Control", "off");
  h.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  h.set("Cross-Origin-Opener-Policy", "same-origin");
  h.set("Cross-Origin-Resource-Policy", "same-origin");

  // HSTS (fine to send in dev)
  h.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  if (isStrict) {
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'self'",
      "object-src 'none'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https:",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");
    h.set("Content-Security-Policy", csp);
  }

  return h;
}

export function middleware() {
  const res = NextResponse.next();
  const headers = securityHeaders();
  headers.forEach((v, k) => res.headers.set(k, v));
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon\\.svg|apple-touch-icon\\.png|robots\\.txt|sitemap\\.xml|opengraph-image).*)",
  ],
};
