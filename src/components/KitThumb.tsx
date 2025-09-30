// src/components/KitThumb.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src?: string | null;
  alt?: string;
  fit?: "cover" | "contain";   // default: contain
  padding?: string;            // e.g. "p-10"; default depends on fit
  sizes?: string;              // default below
  watermark?: string;          // shown if missing/broken
};

export default function KitThumb({
  src,
  alt = "",
  fit = "contain",
  padding,
  sizes = "(min-width: 1024px) 560px, (min-width: 640px) 48vw, 100vw",
  watermark,
}: Props) {
  const [broken, setBroken] = useState(false);
  const hasSrc = typeof src === "string" && src.trim().length > 0;
  const showImg = hasSrc && !broken;

  const pad = padding ?? (fit === "contain" ? "p-10" : "p-0");
  const obj = fit === "cover" ? "object-cover" : "object-contain";

  return (
    <div className="absolute inset-0">
      {showImg && (
        <Image
          src={src!}
          alt={alt}
          fill
          sizes={sizes}
          className={`${obj} ${pad} opacity-90 transition-opacity duration-300`}
          priority={false}
          onError={() => setBroken(true)}
          draggable={false}
        />
      )}

      {!showImg && watermark ? (
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-2xl font-semibold text-white/15 tracking-wide select-none">
            {watermark}
          </span>
        </div>
      ) : null}
    </div>
  );
}
