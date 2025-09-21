import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Keep middleware edge-safe and tiny.
 * Excludes Stripe webhook so the raw body passes through untouched.
 */
export const config = {
  matcher: [
    "/((?!_next/|favicon\\.ico$|icons/|.*\\.(png|jpg|jpeg|gif|svg|webp)$|opengraph-image|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|api/stripe/webhook).*)",
  ],
};

function buildCsp(): string {
  const IS_PROD = process.env.NODE_ENV === "production";

  // Stripe + Supabase allowlists
  const STRIPE_SCRIPT = ["https://js.stripe.com"];
  const STRIPE_FRAME = ["https://js.stripe.com", "https://hooks.stripe.com"];
  const STRIPE_CONN = ["https://api.stripe.com", "https://m.stripe.network"];
  const STRIPE_IMG = ["https://*.stripe.com", "https://*.stripe.network"];

  const connectSrc = ["'self'", "https:", "wss:", ...STRIPE_CONN];
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabase) connectSrc.push(supabase);

  const scriptSrc = ["'self'", "'unsafe-inline'", "https:", ...STRIPE_SCRIPT];
  if (!IS_PROD) scriptSrc.push("'unsafe-eval'");

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    `img-src 'self' data: blob: https: ${STRIPE_IMG.join(" ")}`,
    "style-src 'self' 'unsafe-inline' https:",
    "font-src 'self' https: data:",
    `script-src ${scriptSrc.join(" ")}`,
    `connect-src ${connectSrc.join(" ")}`,
    `frame-src 'self' ${STRIPE_FRAME.join(" ")}`,
    "form-action 'self' https://checkout.stripe.com",
  ].join("; ");
}

export function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();

    // Core security headers (safe defaults)
    res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("X-Frame-Options", "SAMEORIGIN");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=(), interest-cohort=()");
    res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
    res.headers.set("Cross-Origin-Resource-Policy", "same-site");
    res.headers.set("X-DNS-Prefetch-Control", "on");
    res.headers.set("Origin-Agent-Cluster", "?1");
    res.headers.set("X-Permitted-Cross-Domain-Policies", "none");

    // CSP is OFF by default; enable via env flags when ready
    const enableCsp = process.env.NEXT_STRICT_CSP === "1" || process.env.NEXT_CSP_REPORT_ONLY === "1";
    if (enableCsp) {
      const csp = buildCsp();
      if (process.env.NEXT_CSP_REPORT_ONLY === "1") {
        res.headers.set("Content-Security-Policy-Report-Only", csp);
      } else {
        res.headers.set("Content-Security-Policy", csp);
      }
    }

    // Avoid caching HTML
    if (req.headers.get("accept")?.includes("text/html")) {
      res.headers.set("Cache-Control", "no-store");
    }

    return res;
  } catch {
    // Never brick the site because of middleware
    return NextResponse.next();
  }
}
