// src/app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { getEnv } from "@/lib/env.server"; // server-only import (wrapped below)
import { getSiteConfig } from "@/lib/site";
import StructuredData, { type JsonLdObject } from "@/components/StructuredData";

// --- Fonts / base classes ---
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

// --- Utilities ---
function toURL(value?: string) {
  try {
    return new URL(value ?? "");
  } catch {
    return new URL("http://localhost:3000");
  }
}

// Load env on server (never throws in RSC tree)
const env = (() => {
  try {
    return getEnv();
  } catch {
    return null;
  }
})();

// Site config + URLs
const siteURL = (env?.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000").replace(/\/+$/, "");
const { CRISIS_TEL, CRISIS_SMS } = getSiteConfig();

// Social profiles for JSON-LD `sameAs`
const SAME_AS = [
  "https://www.facebook.com/profile.php?id=61580229291031",
  // Add more when ready:
  // "https://www.instagram.com/yourhandle",
  // "https://x.com/yourhandle",
];

// --- Metadata ---
export const metadata: Metadata = {
  metadataBase: toURL(env?.NEXT_PUBLIC_SITE_URL),
  title: { default: "The Safety Plan", template: `%s � The Safety Plan` },
  description:
    "Mission-first wellness kits � focus, recovery, hydration, rest. Every purchase supports veteran suicide prevention.",
  openGraph: {
    title: "The Safety Plan",
    description:
      "Mission-first wellness kits � focus, recovery, hydration, rest. Every purchase supports veteran suicide prevention.",
    url: "/",
    siteName: "The Safety Plan",
    images: ["/opengraph-image"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Safety Plan",
    description: "Mission-first wellness kits � focus, recovery, hydration, rest.",
    images: ["/opengraph-image"],
  },
  icons: { icon: "/favicon.ico" },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

// --- Safe, optional client island import ---
// We avoid dynamic({ ssr:false }) because this is a Server Component file.
// If the module or its default export isn't present, we simply skip rendering it.
import * as HelpIslandNS from "@/components/ClientHelpStripIsland";
type HelpIslandProps = { enabled?: boolean };
const HelpIsland =
  (HelpIslandNS as unknown as { default?: React.ComponentType<HelpIslandProps> }).default ?? null;

// --- Root layout ---
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();
  const helpStripEnabled = (process.env.NEXT_PUBLIC_ENABLE_HELP_STRIP ?? "0") !== "0";

  // JSON-LD payloads (typed)
  const websiteLd: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Safety Plan",
    url: siteURL,
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteURL}/search?q={query}`,
      "query-input": "required name=query",
    },
  };

  const orgLd: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Safety Plan",
    url: siteURL,
    logo: `${siteURL}/favicon.ico`,
    sameAs: SAME_AS,
  };

  const jsonLd: JsonLdObject[] = [websiteLd, orgLd];

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} bg-black text-white`}
    >
      <head>
        <StructuredData data={jsonLd} />
      </head>

      <body
        className={`${inter.className} min-h-dvh bg-[var(--bg)] text-[var(--fg)] antialiased`}
        data-help-strip={helpStripEnabled ? "1" : "0"}
      >
        {/* Skip link */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white/10 focus:px-3 focus:py-2"
        >
          Skip to content
        </a>

        {/* Header */}
        <header
          role="banner"
          className="sticky top-0 z-40 border-b border-zinc-900/80 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/50"
          style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 0px)" }}
        >
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
            <Link
              href="/"
              className="-mx-1 px-1 font-semibold tracking-tight"
              aria-label="The Safety Plan � Home"
            >
              The Safety Plan
            </Link>

            <nav aria-label="Primary" className="site-nav">
              <details className="group open:pb-2 sm:open:pb-0 sm:static sm:block">
                <summary className="list-none cursor-pointer sm:hidden" aria-label="Toggle menu">
                  <span className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-1 text-sm/6">
                    Menu
                    <svg
                      className="size-4 transition-transform group-open:rotate-180"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .92 1.18l-4.2 3.33a.75.75 0 0 1-.92 0l-4.2-3.33a.75.75 0 0 1-.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>

                {/* Nav */}
                <ul className="mt-2 flex flex-col gap-1 text-sm sm:mt-0 sm:flex-row sm:items-center sm:gap-3">
                  <li>
                    <Link href="/shop" className="btn px-3 py-1">
                      Shop
                    </Link>
                  </li>
                  <li>
                    <Link href="/kits" className="btn-ghost block px-2 py-1">
                      Kits
                    </Link>
                  </li>
                  <li>
                    <Link href="/gallery" className="btn-ghost block px-2 py-1">
                      Gallery
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="btn-ghost block px-2 py-1">
                      FAQ
                    </Link>
                  </li>
                  <li className="sm:ml-1">
                    <Link href="/donate" className="btn px-3 py-1">
                      Donate
                    </Link>
                  </li>
                </ul>
              </details>
            </nav>
          </div>

          {/* Crisis ribbon (desktop) */}
          <div
            role="region"
            aria-label="Crisis support"
            className="mx-auto mt-2 hidden w-full max-w-6xl px-4 pb-2 md:block"
          >
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-red-300" />
                <strong className="tracking-wide">In crisis?</strong>
                <span className="opacity-90">
                  {" "}
                  Call{" "}
                  <a href={`tel:${CRISIS_TEL}`} className="underline underline-offset-2 hover:opacity-100">
                    {CRISIS_TEL}
                  </a>{" "}
                  (Veterans press 1) or text{" "}
                  <a href={`sms:${CRISIS_SMS}`} className="underline underline-offset-2 hover:underline">
                    {CRISIS_SMS}
                  </a>
                  .
                </span>
              </span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main id="content" className="mx-auto w-full max-w-6xl px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-zinc-900/80" role="contentinfo">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row">
            <p className="text-xs text-zinc-500">
              {"\u00A9"} {year} The Safety Plan
            </p>
            <div className="flex items-center gap-4 text-xs">
              <Link href="/privacy" className="underline-offset-2 hover:underline">
                Privacy
              </Link>
              <Link href="/terms" className="underline-offset-2 hover:underline">
                Terms
              </Link>
              <Link href="/api/version" className="text-zinc-500 underline-offset-2 hover:underline">
                Version
              </Link>
            </div>
          </div>
        </footer>

        {/* Mobile floating help strip � render only if component exists AND toggle is enabled */}
        {helpStripEnabled && HelpIsland ? <HelpIsland enabled /> : null}
      </body>
    </html>
  );
}
