import Image from "next/image";

// Swap these out with your real CDN/asset URLs later.
// Aspect ratio is fixed for a tidy grid; captions are short and readable.
const photos = Array.from({ length: 12 }).map((_, i) => ({
  src: `https://picsum.photos/seed/mission-${i + 1}/1200/800`,
  alt: `Mission photo ${i + 1}`,
  caption: `Mission photo ${i + 1}`,
}));

export default function Gallery() {
  return (
    <section aria-label="Mission photos">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p) => (
          <li
            key={p.src}
            className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel)]"
          >
            {/* Image wrapper to enforce ratio and let next/image fill */}
            <div className="relative aspect-[4/3]">
              <Image
                src={p.src}
                alt={p.alt}
                fill
                loading="lazy"
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Hover caption */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-sm text-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {p.caption}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

