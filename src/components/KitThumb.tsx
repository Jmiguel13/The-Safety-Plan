"use client";

import Image from "next/image";

type Props = {
  src: string | null;
  alt: string;
  /** Keep full mark visible */
  fit?: "contain" | "cover";
  /** Inner padding so art breathes */
  padding?: string;
  /** Extra class on wrapper */
  className?: string;
  /** Scale factor applied to the contained image (1 = no scale) */
  zoom?: number;
};

export default function KitThumb({
  src,
  alt,
  fit = "contain",
  padding = "p-6 md:p-8",
  className = "",
  zoom = 1.24, // a touch larger so the icon reads on the card
}: Props) {
  return (
    <div
      className={[
        // wrapper is borderless; the card link already has a border
        "relative h-full w-full overflow-hidden rounded-xl bg-black/20",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className,
      ].join(" ")}
    >
      {/* very soft center glow so the mark doesn't feel 'stuck' */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(30% 35% at 50% 54%, rgba(255,255,255,0.05), transparent 70%)",
        }}
      />

      {/* padded, centered image */}
      <div
        className={[
          "absolute inset-0 flex items-center justify-center",
          padding,
        ].join(" ")}
      >
        {src ? (
          <div className="relative h-full w-full">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-contain will-change-transform"
              style={{
                objectFit: fit,
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
              }}
              priority={false}
            />
          </div>
        ) : (
          <div
            aria-hidden
            className="h-full w-full rounded-lg"
            style={{
              background:
                "radial-gradient(60% 50% at 20% 20%, rgba(56,189,248,.14), transparent), radial-gradient(40% 40% at 80% 20%, rgba(16,185,129,.10), transparent)",
            }}
          />
        )}
      </div>
    </div>
  );
}
