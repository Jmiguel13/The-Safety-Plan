// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { getEnv } from "@/lib/env";

const inter = Inter({ subsets: ["latin"] });

function safeBase(u: string) {
  try { return new URL(u); } catch { return new URL("http://localhost:3000"); }
}

const env = (() => {
  try { return getEnv(); } catch { return null; }
})();

export const metadata: Metadata = {
  metadataBase: safeBase(env?.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "The Safety Plan", template: "%s — The Safety Plan" },
  description:
    "Mission-first wellness kits — focus, recovery, hydration, rest. Every purchase supports veteran suicide prevention.",
  openGraph: {
    title: "The Safety Plan",
    description:
      "Mission-first wellness kits — focus, recovery, hydration, rest. Every purchase supports veteran suicide prevention.",
    url: "/",
    siteName: "The Safety Plan",
    images: ["/opengraph-image"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Safety Plan",
    description: "Mission-first wellness kits — focus, recovery, hydration, rest.",
    images: ["/opengraph-image"],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-black text-white">
      <body className={inter.className}>
        {/* Site header */}
        <header className="sticky top-0 z-40 border-b border-zinc-900/80 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/50">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
            <Link href="/" className="font-semibold tracking-tight">The Safety Plan</Link>
            <nav className="flex items-center gap-3 text-sm">
              <Link href="/kits" className="btn-ghost">Kits</Link>
              <Link href="/shop" className="btn-ghost">Shop</Link>
              <Link href="/gallery" className="btn-ghost">Gallery</Link>
              <Link href="/faq" className="btn-ghost">FAQ</Link>
              <Link href="/donate" className="btn">Donate</Link>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>

        {/* Footer */}
        <footer className="mt-16 border-t border-zinc-900/80">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row">
            <p className="text-xs text-zinc-500">© {new Date().getFullYear()} The Safety Plan</p>
            <div className="flex items-center gap-4 text-xs">
              <Link href="/privacy" className="underline-offset-2 hover:underline">Privacy</Link>
              <Link href="/terms" className="underline-offset-2 hover:underline">Terms</Link>
              <a href="/api/version" className="text-zinc-500 underline-offset-2 hover:underline">Version</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
