// next.config.mjs  (replace contents; then DELETE next.config.js to fix “redeclare” errors)
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.amway.com" },
      { protocol: "https", hostname: "images.ctfassets.net" }
    ]
  }
};

export default nextConfig;
