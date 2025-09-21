"use client";

import * as React from "react";
import NextImage, { ImageProps } from "next/image";

type SafeImageProps = Omit<ImageProps, "src" | "onError"> & {
  /** Can be null/undefined/empty; we’ll fall back automatically */
  src?: string | null;
  /** Optional explicit fallback image */
  fallbackSrc?: string;
};

/** Transparent 1×1 PNG data URI (no asset needed) */
const TRANSPARENT_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=";

export default function SafeImage({
  src,
  alt,
  fallbackSrc,
  onLoadingComplete,
  ...rest
}: SafeImageProps) {
  const [errored, setErrored] = React.useState(false);

  const resolvedSrc =
    (!errored && src && String(src).trim().length > 0 ? String(src) : undefined) ??
    fallbackSrc ??
    TRANSPARENT_PNG;

  return (
    <NextImage
      {...rest}
      src={resolvedSrc}
      alt={alt ?? ""}
      onError={() => setErrored(true)}
      onLoadingComplete={onLoadingComplete}
    />
  );
}
