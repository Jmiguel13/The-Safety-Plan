// src/components/KitHeader.tsx
"use client";

import Link from "next/link";
import type { Kit } from "@/lib/kits";
import { weightLabel, statsForKit, heroForKit, titleForKit, subtitleForKit } from "@/lib/kits-helpers";

export default function KitHeader({ slug, kit, buyUrl }: { slug: string; kit: Kit; buyUrl: string }) {
  const stats = statsForKit(kit);
  const weight = weightLabel(kit);
  const hero = heroForKit(slug, kit);
  const title = titleForKit(slug, kit);
  const subtitle = subtitleForKit(slug, kit);

  const skuLabel = stats.skuCount > 0 ? `${stats.skuCount} SKUs` : "—";
  const itemLabel = stats.itemCount > 0 ? `${stats.itemCount} items` : "—";

  return (
    <header className="grid items-center gap-8 md:grid-cols-[1.1fr_.9fr]">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-zinc-400">{subtitle}</p>

        <div className="flex flex-wrap gap-2 text-sm text-zinc-300">
          {weight && <span className="tag">{weight}</span>}
          <span className="tag">{itemLabel}</span>
          <span className="tag">{skuLabel}</span>
        </div>

        <div className="pt-2 flex gap-3">
          <Link href={buyUrl} className="btn">Buy now</Link>
          <Link href={`/kits/${slug}/items`} className="btn-ghost">View items</Link>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-zinc-800 min-h-[12rem]">
        {hero?.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero.src} alt={hero.alt} className="w-full h-auto object-cover" />
        ) : (
          <div
            aria-hidden
            className="w-full h-full"
            style={{
              background:
                "radial-gradient(120% 120% at 0% 0%, rgba(0,200,255,.18), transparent), radial-gradient(120% 120% at 100% 100%, rgba(255,170,0,.18), transparent), radial-gradient(120% 120% at 30% 70%, rgba(0,255,150,.14), transparent)",
              minHeight: "12rem",
            }}
          />
        )}
      </div>
    </header>
  );
}
