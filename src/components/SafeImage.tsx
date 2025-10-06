// src/components/SafeImage.tsx
// Server component that gracefully falls back when the file isn't present.
import Image, { ImageProps } from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";

type Props = Omit<ImageProps, "src" | "alt" | "fill"> & {
  src?: string;
  candidates?: string[];  // try these in order
  alt: string;
  height?: number;        // used for the fallback box
  fill?: boolean;
};

function firstExistingPublicPath(cands: string[]): string | null {
  try {
    const pub = join(process.cwd(), "public");
    for (const rel of cands) {
      const clean = rel.replace(/^\//, "");
      if (existsSync(join(pub, clean))) return `/${clean}`;
    }
  } catch {}
  return null;
}

export default function SafeImage({
  src,
  candidates,
  alt,
  height = 320,
  fill,
  className,
  ...rest
}: Props) {
  const tryList = [...(candidates ?? []), ...(src ? [src] : [])].filter(Boolean) as string[];
  const found = tryList.length ? firstExistingPublicPath(tryList) : null;

  if (!found) {
    return (
      <div
        className={[
          "w-full rounded-xl border border-white/10",
          "bg-gradient-to-br from-sky-900/30 via-emerald-900/20 to-sky-900/30",
          className,
        ].join(" ")}
        style={{ height }}
        aria-hidden="true"
      />
    );
  }

  if (fill) {
    return (
      <div className={["relative overflow-hidden rounded-xl border border-white/10", className].join(" ")} style={{ height }}>
        <Image src={found} alt={alt} fill sizes="(min-width: 768px) 900px, 100vw" style={{ objectFit: "cover" }} {...rest} />
      </div>
    );
  }

  return <Image src={found} alt={alt} className={className} {...rest} />;
}
