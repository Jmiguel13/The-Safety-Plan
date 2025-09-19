// src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    // Everything except Next internals + common statics
    "/((?!_next/|favicon.ico$|icon.*|apple-icon.*|opengraph-image|robots.txt|sitemap.xml|manifest.webmanifest).*)",
  ],
};

function buildCsp() {
  const IS_PROD = process.env.NODE_ENV === "production";
  const strict = process.env.NEXT_STRICT_CSP === "1";

  // Stripe allowlists
  const STRIPE_SCRIPT = ["https://js.stripe.com"];
  const STRIPE_FRAME  = ["https://js.stripe.com", "https://hooks.stripe.com"];
  const STRIPE_CONN   = ["https://api.stripe.com"];
  const STRIPE_IMG    = ["https://*.stripe.com", "https://*.stripe.network"];

  const connectSrc = [
    "'self'",
    "https:",
    "wss:",
    "https://api.openai.com",
    ...STRIPE_CONN,
  ];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    connectSrc.push(process.env.NEXT_PUBLIC_SUPABASE_URL);
  }

  const scriptSrc = [
    "'self'",
    "'unsafe-inline'", // remove if you fully nonce/hash inline
    "https:",
    ...STRIPE_SCRIPT,
  ];
  if (!IS_PROD) scriptSrc.push("'unsafe-eval'");

  const base = [
    `default-src 'self'`,
    `style-src 'self' 'unsafe-inline' https:`,
    `img-src 'self' data: blob: https: ${STRIPE_IMG.join(" ")}`,
    `font-src 'self' https: data:`,
    `script-src ${scriptSrc.join(" ")}`,
    `connect-src ${connectSrc.join(" ")}`,
    // allow Stripe Checkout/JS frames
    `frame-src 'self' ${STRIPE_FRAME.join(" ")}`,
    `frame-ancestors 'self'`,
    `base-uri 'self'`,
    // if a form ever posts offsite (e.g. Checkout), allow it
    `form-action 'self' https://checkout.stripe.com`,
    `object-src 'none'`,
  ];

  if (strict) base.push(`upgrade-insecure-requests`);
  return base.join("; ");
}

export function middleware(request: NextRequest) {
  const res = NextResponse.next();

  // Core security headers
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  res.headers.set("Cross-Origin-Resource-Policy", "same-site");
  res.headers.set("X-DNS-Prefetch-Control", "on");
  res.headers.set("Origin-Agent-Cluster", "?1");
  res.headers.set("X-Permitted-Cross-Domain-Policies", "none");

  // CSP (toggle Report-Only via env)
  const csp = buildCsp();
  if (process.env.NEXT_CSP_REPORT_ONLY === "1") {
    res.headers.set("Content-Security-Policy-Report-Only", csp);
  } else {
    res.headers.set("Content-Security-Policy", csp);
  }

  // Avoid caching HTML
  if (request.headers.get("accept")?.includes("text/html")) {
    res.headers.set("Cache-Control", "no-store");
  }

  return res;
}
