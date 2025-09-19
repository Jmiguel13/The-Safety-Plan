// src/app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const start = new URL("/", raw);
  start.searchParams.set("utm_source", "pwa");

  return {
    name: "The Safety Plan",
    short_name: "Safety Plan",
    description:
      "Mission-first wellness kits — focus, recovery, hydration, rest. Every purchase supports veteran suicide prevention.",
    id: "/",
    start_url: start.toString(),
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui", "browser"],
    background_color: "#000000",
    theme_color: "#000000",
    lang: "en",
    dir: "ltr",
    orientation: "portrait",
    categories: ["health", "fitness", "shopping"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }, // default purpose: "any"
      { src: "/icons/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Shop", url: "/shop", description: "Open the storefront" },
      { name: "Kits", url: "/kits", description: "Browse wellness kits" },
      { name: "Donate", url: "/donate", description: "Support the mission" },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
