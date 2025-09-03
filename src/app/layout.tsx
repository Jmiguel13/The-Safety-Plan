import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NeedHelpRibbon from "@/components/NeedHelpRibbon";

export const metadata: Metadata = {
  title: "The Safety Plan",
  description: "Mission kits built for focus, recovery, hydration, rest.",
};

export const viewport: Viewport = {
  themeColor: "#0B1415",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-grid antialiased">
        <a href="#content" className="skip-link">Skip to content</a>
        <header className="site-header" role="banner">
          <SiteHeader />
        </header>
        <main id="content" className="container mx-auto px-4 py-8 md:py-10 max-w-5xl" role="main">
          {children}
        </main>
        <footer role="contentinfo">
          <SiteFooter />
        </footer>
        <NeedHelpRibbon />
      </body>
    </html>
  );
}







