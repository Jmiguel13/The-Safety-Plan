// src/components/KitCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export type KitCardProps = {
  slug: string;
  title: string;
  hero: { src?: string; alt?: string }; // made optional
  subtitle?: string;
  stats?: { itemCount: number; skuCount: number };
  /** If true, show both “View kit” and “Items” (used on /kits). Default: false */
  showItemsLink?: boolean;
  /** Layout option. Default: 'leftThumb' */
  layout?: "leftThumb" | "topThumb";
};

export default function KitCard({
  slug,
  title,
  hero,
  subtitle,
  stats,
  showItemsLink = false,
  layout = "leftThumb",
}: KitCardProps) {
  const meta =
    subtitle && subtitle.trim().length > 0
      ? subtitle
      : stats
      ? `${stats.itemCount} items • ${stats.skuCount} SKUs`
      : "";

  // kit logo mapping (icon-only)
  const logoSrc =
    slug === "resilient"
      ? "/kits/resilient.svg"
      : slug === "homefront"
      ? "/kits/homefront.svg"
      : null;

  const LogoBadge = logoSrc ? (
    <div
      className="absolute left-3 top-3 md:left-4 md:top-4 z-[1] select-none"
      aria-hidden
    >
      <Image
        src={logoSrc}
        alt=""
        width={72}
        height={72}
        priority={false}
        className="opacity-90 drop-shadow"
        draggable={false}
      />
    </div>
  ) : null;

  const Thumb = (top: boolean) => (
    <div className="panel overflow-hidden p-0">
      <div className={top ? "relative aspect-[16/10]" : "grid grid-cols-1 sm:grid-cols-[200px_1fr]"}>
        {/* Thumb */}
        <div className={top ? "relative h-full w-full" : "relative aspect-[16/10] sm:aspect-auto sm:h-full"}>
          {/* Logo overlay */}
          {LogoBadge}
          {/* Background tint always visible */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(600px 260px at 0% 0%, rgba(59,130,246,.08), transparent 60%), radial-gradient(520px 200px at 100% 0%, rgba(16,185,129,.08), transparent 60%)" }} aria-hidden />
          {/* Hero image only if present */}
          {hero?.src ? (
            <Image
              src={hero.src}
              alt={hero.alt ?? ""}
              fill
              quality={90}
              sizes={top ? "100vw" : "(min-width: 640px) 200px, 100vw"}
              className="object-cover"
              draggable={false}
              onError={(e) => {
                // hide broken image — gradient remains
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}
          <div className="absolute inset-0 bg-black/10" aria-hidden />
        </div>

        {/* Content */}
        <div className={top ? "p-5 flex flex-col gap-3 min-w-0" : "min-w-0 p-5 flex flex-col gap-3"}>
          <div className="min-w-0 space-y-1">
            <div className="font-medium truncate">{title}</div>
            {meta ? <div className="muted text-sm truncate">{meta}</div> : null}
          </div>

          <div className="mt-1 flex gap-2">
            <Link href={`/kits/${slug}`} className="btn">
              View kit
            </Link>
            {showItemsLink ? (
              <Link href={`/kits/${slug}/items`} className="btn-ghost">
                Items
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  return layout === "topThumb" ? Thumb(true) : Thumb(false);
}
