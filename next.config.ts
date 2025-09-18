// next.config.ts
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Derive the exact Supabase hostname from env to avoid wildcards/any-casts
const supabaseHost = (() => {
  try {
    const u = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const h = new URL(u).hostname; // e.g., "vlakmzfwwrdtgdlejris.supabase.co"
    return h || "supabase.co";
  } catch {
    return "supabase.co";
  }
})();

const csp = [
  // Base
  "default-src 'self'",
  // Inline styles are common with Tailwind; a hash/nonce would be stricter
  "style-src 'self' 'unsafe-inline'",
  // Scripts: allow self; dev needs eval/inline for HMR
  isProd ? "script-src 'self'" : "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  // Images: allow https and data (for inline SVGs/embeds)
  "img-src 'self' data: https:",
  // Fonts: self + data
  "font-src 'self' data:",
  // Connections: exact Supabase host, Stripe API, Vercel insights, Amway, and dev HMR websockets
  [
    "connect-src 'self'",
    `https://${supabaseHost}`,
    "https://api.stripe.com",
    "https://*.vercel-insights.com",
    "https://vitals.vercel-insights.com",
    "https://*.amway.com",
    isProd ? "" : "ws://localhost:*",
    isProd ? "" : "ws://127.0.0.1:*",
  ]
    .filter(Boolean)
    .join(" "),
  // Frames: Stripe
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  // Form actions: Stripe Checkout
  "form-action 'self' https://checkout.stripe.com",
  // Objects blocked
  "object-src 'none'",
  // base-uri for CSP
  "base-uri 'self'",
].join("; ");

const securityHeaders = [
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: csp,
  },
  // Prevent clickjacking
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // No MIME sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // HSTS (subdomains) only in prod over HTTPS
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
  // Referrer policy (optional sane default)
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
] as const;

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  // Optional React Compiler toggle
  experimental: {
    reactCompiler: process.env.REACT_COMPILER === "1",
  },
  images: {
    dangerouslyAllowSVG: true,
    // Only allow remote origins you actually use. Add more if needed.
    remotePatterns: [
      // Amway assets (if any images load from main domain)
      { protocol: "https", hostname: "www.amway.com" },
      { protocol: "https", hostname: "amway.com" },
      // Your exact Supabase project host (derived above)
      { protocol: "https", hostname: supabaseHost },
      // Add your own CDN(s) as needed:
      // { protocol: "https", hostname: "cdn.yoursite.com" },
    ],
    // Block remote SVG script execution; we allow local SVG via dangerouslyAllowSVG
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Ensure metadataBase (used by app/metadata) picks up your prod URL
  // You can also set this via env if you read it inside app code.
  env: {
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders as unknown as Array<{ key: string; value: string }>,
      },
    ];
  },
  // Optional: custom redirects for your /r links if you add static mapping here
  // async redirects() {
  //   return [
  //     { source: "/r/test", destination: "/?r=test", permanent: false },
  //   ];
  // },
};

export default nextConfig;
