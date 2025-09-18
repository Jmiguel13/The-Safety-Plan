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

  return (
    <header className="grid items-center gap-8 md:grid-cols-[1.1fr_.9fr]">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-zinc-400">{subtitle}</p>

        <div className="flex flex-wrap gap-2 text-sm text-zinc-300">
          {weight && <span className="tag">{weight}</span>}
          <span className="tag">{stats.itemCount} items</span>
          <span className="tag">{stats.skuCount} SKUs</span>
        </div>

        <div className="pt-2 flex gap-3">
          <Link href={buyUrl} className="btn">Buy now</Link>
          <Link href={`/kits/${slug}/items`} className="btn-ghost">View items</Link>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero.src} alt={hero.alt} className="w-full h-auto object-cover" />
      </div>
    </header>
  );
}

