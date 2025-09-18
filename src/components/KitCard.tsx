// src/components/KitCard.tsx
import Link from "next/link";
import Image from "next/image";

export type KitCardProps = {
  slug: string;
  title: string;
  hero: { src: string; alt: string };
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

  const LeftThumb = (
    <div className="panel overflow-hidden p-0">
      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
        {/* Thumb */}
        <div className="relative aspect-[16/10] sm:aspect-auto sm:h-full">
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            className="object-cover"
            sizes="(min-width: 640px) 200px, 100vw"
          />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-3 min-w-0">
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

  const TopThumb = (
    <div className="panel overflow-hidden p-0">
      <div className="relative aspect-[16/10]">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="p-5 flex flex-col gap-3 min-w-0">
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
  );

  return layout === "topThumb" ? TopThumb : LeftThumb;
}

