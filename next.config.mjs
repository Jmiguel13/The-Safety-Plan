/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // ✅ Keep modern formats, plus allow external images used by Gallery
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },         // demo images
      // Add real sources as you switch over:
      // { protocol: "https", hostname: "images.unsplash.com" },
      // { protocol: "https", hostname: "cdn.your-domain.com" },
    ],
  },

  async headers() {
    const security = [
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },                             // plus frame-ancestors below
      { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "base-uri 'self'",
          "frame-ancestors 'none'",
          "object-src 'none'",
          "form-action 'self'",
          "img-src 'self' data: blob: https:",        // allows next/image + remote assets
          "script-src 'self' 'unsafe-inline'",        // keep simple; can tighten with nonces later
          "style-src 'self' 'unsafe-inline'",
          "connect-src 'self' https:",                // add your APIs (e.g., https://*.supabase.co) when used
          "upgrade-insecure-requests",
        ].join("; "),
      },
    ];

    const longCache = [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ];

    return [
      { source: "/:path*", headers: security },

      // 🔒+⚡ Cache next assets hard
      { source: "/_next/static/:path*", headers: longCache },
      { source: "/_next/image/:path*", headers: longCache },
      { source: "/fonts/:path*", headers: longCache },
    ];
  },
};

export default nextConfig;
