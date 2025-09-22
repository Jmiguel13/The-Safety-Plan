// src/app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import ClientHelpStripIsland from "@/components/ClientHelpStripIsland";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// ---- env helpers (server-only in App Router) ----
function toURL(value?: string) {
  try {
    return new URL(value ?? "");
  } catch {
    return new URL("http://localhost:3000");
  }
}

function readEnv() {
  // Read directly from process.env to avoid missing getEnv() export
  const {
    NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_ENABLE_HELP_STRIP,
    NEXT_PUBLIC_IMPACT_STAT,
    CRISIS_TEL,
    CRISIS_SMS,
  } = process.env;

  return {
    NEXT_PUBLIC_SITE_URL: NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    NEXT_PUBLIC_ENABLE_HELP_STRIP:
      (NEXT_PUBLIC_ENABLE_HELP_STRIP ?? "0").toString(),
    NEXT_PUBLIC_IMPACT_STAT:
      NEXT_PUBLIC_IMPACT_STAT ??
      "Every purchase supports prevention resources.",
    CRISIS_TEL: CRISIS_TEL ?? "18002738255",
    CRISIS_SMS: CRISIS_SMS ?? "838255",
  } as const;
}

const env = readEnv();

// ---- head config ----
export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  colorScheme: "dark light",
  initialScale: 1,
  width: "device-width",
};

export const metadata: Metadata = {
  metadataBase: toURL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "The Safety Plan",
    template: "%s — The Safety Plan",
  },
  description:
    "Mission-first wellness kits — focus, recovery, hydration, rest. Every purchase supports veteran suicide prevention.",
  keywords: [
    "The Safety Plan",
    "veterans",
    "wellness kits",
    "donate",
    "law enforcement",
    "resilient kit",
    "homefront kit",
  ],
  openGraph: {
    type: "website",
    url: "/",
    title: "The Safety Plan",
    siteName: "The Safety Plan",
    description:
      "Mission-first wellness kits — focus, recovery, hydration, rest. Every purchase supports veteran suicide prevention.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Safety Plan",
    description:
      "Mission-first wellness kits — focus, recovery, hydration, rest.",
    creator: "@thesafetyplan",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ---- ui bits ----
function formatTelHuman(n: string) {
  const digits = n.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `1-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return n;
}

function CrisisRibbon() {
  const tel = env.CRISIS_TEL;
  const sms = env.CRISIS_SMS;
  const telHref = `tel:${tel}`;
  const smsHref = `sms:${sms}`;

  return (
    <div className="w-full bg-red-600/95 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-sm">
        <span className="font-semibold tracking-wide">
          In crisis? You are not alone.
        </span>
        <div className="flex items-center gap-2">
          <a
            href={telHref}
            className="rounded-md bg-white/10 px-3 py-1.5 font-medium underline-offset-2 hover:underline"
          >
            Call {formatTelHuman(tel)}
          </a>
          <a
            href={smsHref}
            className="rounded-md bg-white/10 px-3 py-1.5 font-medium underline-offset-2 hover:underline"
          >
            Text {sms}
          </a>
          <Link
            href="/resources"
            className="rounded-md bg-white/10 px-3 py-1.5 font-medium underline-offset-2 hover:underline"
          >
            Resources
          </Link>
        </div>
      </div>
    </div>
  );
}

function JsonLd() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const json = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Safety Plan",
    url: siteUrl,
    sameAs: [
      "https://www.facebook.com/TheSafetyPlan",
      "https://www.instagram.com/thesafetyplan",
    ],
    logo: `${siteUrl}/icon.png`,
    description:
      "Mission-first wellness kits — focus, recovery, hydration, rest. Every purchase supports veteran suicide prevention.",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Crisis",
        telephone: `+${env.CRISIS_TEL}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

// ---- root layout ----
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const enableHelpStrip = env.NEXT_PUBLIC_ENABLE_HELP_STRIP === "1";

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        {/* Accessibility skip link */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-md focus:bg-zinc-800 focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>

        {/* Crisis ribbon */}
        <CrisisRibbon />

        {/* Optional client-only help strip */}
        {enableHelpStrip ? <ClientHelpStripIsland /> : null}

        {/* Header */}
        <header className="border-b border-zinc-800 bg-zinc-950/70 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold tracking-tight">
              The Safety Plan
            </Link>
            <nav className="flex items-center gap-5 text-sm">
              <Link href="/kits" className="hover:underline">
                Kits
              </Link>
              <Link href="/donate" className="hover:underline">
                Donate
              </Link>
              <Link href="/shop" className="hover:underline">
                Shop
              </Link>
              <Link href="/faq" className="hover:underline">
                FAQ
              </Link>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main id="main" className="mx-auto max-w-7xl px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-800">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <div className="text-sm text-zinc-400">
                {env.NEXT_PUBLIC_IMPACT_STAT}
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/privacy" className="hover:underline">
                Privacy
              </Link>
              <Link href="/terms" className="hover:underline">
                Terms
              </Link>
              <Link href="/sitemap.xml" className="hover:underline">
                Sitemap
              </Link>
              <Link href="/robots.txt" className="hover:underline">
                Robots
              </Link>
            </div>
            <div className="text-sm text-zinc-400">
              © {new Date().getFullYear()} The Safety Plan
            </div>
          </div>
        </footer>

        {/* JSON-LD */}
        <JsonLd />
      </body>
    </html>
  );
}
