// src/app/gallery/page.tsx
import Image from "next/image";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const revalidate = 300;

type GalleryItem = { src: string; title: string; caption?: string };

// Optional captions keyed by filename (no extension)
const CAPTIONS: Record<string, string> = {
  // "gallery01": "On-the-go loadout",
};

const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

function toTitle(base: string): string {
  // gallery01 -> Gallery 01, homefront-kit -> Homefront Kit
  const m = /^gallery(\d+)$/i.exec(base);
  if (m) return `Gallery ${m[1].padStart(2, "0")}`;
  return base
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim() || "Untitled";
}

function readGallery(): GalleryItem[] {
  const publicDir = path.join(process.cwd(), "public");
  const galleryDir = path.join(publicDir, "gallery");
  const files: { file: string; src: string }[] = [];

  // A) Prefer /public/gallery/*
  if (fs.existsSync(galleryDir)) {
    for (const f of fs.readdirSync(galleryDir)) {
      const ext = path.extname(f).toLowerCase();
      if (!ALLOWED.has(ext)) continue;
      files.push({ file: f, src: `/gallery/${f}` });
    }
  }

  // B) If none found, fall back to /public/gallery*.*
  if (files.length === 0 && fs.existsSync(publicDir)) {
    for (const f of fs.readdirSync(publicDir)) {
      const ext = path.extname(f).toLowerCase();
      const base = path.basename(f, ext);
      if (!ALLOWED.has(ext)) continue;
      if (!/^gallery/i.test(base)) continue; // only files starting with "gallery"
      files.push({ file: f, src: `/${f}` });
    }
  }

  // Natural sort (gallery1, gallery2, gallery10...)
  files.sort((a, b) =>
    a.file.localeCompare(b.file, undefined, { numeric: true, sensitivity: "base" })
  );

  return files.map(({ file, src }) => {
    const base = file.replace(/\.[a-z0-9]+$/i, "");
    return { src, title: toTitle(base), caption: CAPTIONS[base] };
  });
}

export default async function GalleryPage() {
  const items = readGallery();

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Gallery</h1>
        <p className="muted">Real kit shots and field notes.</p>
      </header>

      {items.length === 0 ? (
        <div className="panel-elevated p-4 text-sm">
          <p className="muted">
            No images found. Add files to <code>/public/gallery</code> or files like{" "}
            <code>/public/gallery01.png</code>, then refresh.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <figure key={it.src} className="gallery-figure">
              <Image
                className="gallery-img"
                src={it.src}
                alt={it.title}
                width={1600}
                height={1000}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={i < 2}
              />
              <figcaption className="gallery-caption">
                <div>
                  <div className="font-medium">{it.title}</div>
                  {it.caption ? <div className="muted">{it.caption}</div> : null}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
