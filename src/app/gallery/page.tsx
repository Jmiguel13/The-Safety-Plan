import type { Metadata, Viewport } from "next";
import Gallery from "@/components/Gallery";

export const viewport: Viewport = { themeColor: "#0b0f10" };

export const metadata: Metadata = {
  title: "Mission Gallery — The Safety Plan",
  description: "Moments from pack-outs, deliveries, and the community who make it possible.",
};

export default function GalleryPage() {
  return (
    <main id="content" className="container py-10 space-y-6">
      <header className="space-y-1">
        <h1>Mission Gallery</h1>
        <p className="muted text-sm">Clean, fast-loading grid. Hover or tap for captions.</p>
      </header>

      <Gallery />
    </main>
  );
}
