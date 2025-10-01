import "./globals.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import ClientHelpStripIsland from "@/components/ClientHelpStripIsland";
import Header from "@/components/Header";            // ← normal import (client component)
import SiteFooter from "@/components/SiteFooter";
import { BRAND, CONTACT } from "@/lib/blank";        // used in JSON-LD

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// ---- env helpers ----
function toURL(value?: string) {
  try {
    return new URL(value ?? "");
  } catch {
    return new URL("http://localhost:3000");
  }
}

function readEnv() {
  const {
    NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_ENABLE_HELP_STRIP,
    NEXT_PUBLIC_IMPACT_STAT,
    CRISIS_TEL,
    CRISIS_SMS,
  } = process.env;

  return {
    NEXT_PUBLIC_SITE_URL: NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    NEXT_PUBLIC_ENABLE_HELP_STRIP: (NEXT_PUBLIC_ENABLE_HELP_STRIP ?? "0").toString(),
    NEXT_PUBLIC_IMPACT_STAT:
      NEXT_PUBLIC_IMPACT_STAT ??
      "Every kit helps us sustain prevention, outreach, and response.",
    CRISIS_TEL: (CRISIS_TEL ?? "988").toString(),
    CRISIS_SMS: (CRISIS_SMS ?? "838255").toString(),
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
  title: { default: "The Safety Plan", template: "%s — The Safety Plan" },
  description:
    "Mission-first wellness kits — focus, recovery, hydration, rest. Together we sustain prevention, outreach, and response.",
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
      "Mission-first wellness kits — focus, recovery, hydration, rest. Together we sustain prevention, outreach, and response.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Safety Plan",
    description:
      "Mission-first wellness kits — focus, recovery, hydration, rest.",
    creator: "@thesafetyplan",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

// ---- helpers (ui) ----
function formatTelHuman(n: string) {
  const digits = n.replace(/\D/g, "");
  if (digits.length <= 3) return digits; // "988"
  if (digits.length === 11 && digits.startsWith("1"))
    return `1-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  if (digits.length === 10)
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return n;
}

function CrisisRibbon() {
  const tel = env.CRISIS_TEL;
  const sms = env.CRISIS_SMS;

  return (
    <div className="w-full bg-red-600/95 text-white">
      <div className="container flex flex-wrap items-center justify-between gap-3 py-2 text-sm">
        <span className="font-semibold tracking-wide">
          {/* Grammar fix per Linwood */}
          you are not alone; every kit is a reminder of resilience, recovery, and the mission for which we stand together.
        </span>
        <div className="flex items-center gap-2">
          <a href={`tel:${tel}`} className="ribbon-chip">Call {formatTelHuman(tel)}</a>
          <a href={`sms:${sms}`} className="ribbon-chip">Text {sms}</a>
          <Link href="/resources" className="ribbon-chip">Resources</Link>
        </div>
      </div>
    </div>
  );
}

function JsonLd() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const json: Record<string, unknown> = {
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
      "Mission-first wellness kits — focus, recovery, hydration, rest.",
    brand: {
      "@type": "Brand",
      name: BRAND.name,
      slogan: BRAND.slogan,
    },
    contactPoint: [
      { "@type": "ContactPoint", contactType: "Crisis", telephone: `+${env.CRISIS_TEL}` },
      ...(CONTACT.email
        ? [{ "@type": "ContactPoint", contactType: "Customer Support", email: CONTACT.email }] as const
        : []),
      ...(CONTACT.phone
        ? [{ "@type": "ContactPoint", contactType: "Customer Support", telephone: CONTACT.phone }] as const
        : []),
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
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const enableHelpStrip = env.NEXT_PUBLIC_ENABLE_HELP_STRIP === "1";

  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body
        className="min-h-screen bg-zinc-950 text-zinc-100 antialiased"
        data-help-strip={enableHelpStrip ? "1" : undefined}
      >
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

        {/* Header (client component, imported normally) */}
        <Header />

        {/* Main */}
        <main id="main" className="container py-8">
          {children}
        </main>

        {/* Footer */}
        <SiteFooter impactText={env.NEXT_PUBLIC_IMPACT_STAT} />

        {/* JSON-LD */}
        <JsonLd />
      </body>
    </html>
  );
}
