import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { kits, type Kit } from "@/lib/kits";
import {
  heroForKit,
  titleForKit,
  subtitleForKit,
  statsForKit,
  weightLabel,
  normalizeItems,
} from "@/lib/kits-helpers";
import BuyButtons from "@/components/BuyButtons";
import ItemRow from "@/components/ItemRow";

export const revalidate = 86400;

export function generateStaticParams() {
  return (kits as Kit[]).map((k) => ({ slug: k.slug }));
}

export default async function KitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const kit = (kits as Kit[]).find((k) => k.slug === slug);
  if (!kit) return notFound();

  const title = titleForKit(kit.slug, kit);
  const subtitle = subtitleForKit(kit.slug, kit);
  const stats = statsForKit(kit);
  const hero = heroForKit(kit.slug, kit);
  const weight = weightLabel(kit);

  const items = normalizeItems(kit);
  const cartItems = items.map(({ sku, qty }) => ({ sku, qty }));

  return (
    <section className="space-y-8">
      <header className="overflow-hidden rounded-2xl border border-[var(--border)] bg-grid preview-surface">
        <div className="grid md:grid-cols-[320px_1fr]">
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full">
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 320px, 100vw"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          </div>

          <div className="p-6 md:p-8 flex flex-col gap-3">
            <div className="tag tag-accent w-max">Kit</div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
            {subtitle ? <p className="muted">{subtitle}</p> : null}

            <div className="flex flex-wrap gap-2 pt-1 text-sm">
              <span className="pill">{stats.itemCount} items</span>
              <span className="pill">{stats.skuCount} SKUs</span>
              {weight ? <span className="pill">{weight}</span> : null}
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <BuyButtons items={cartItems} fallbackSkusTitle={`${title} — SKUs`} />
              <Link href={`/kits/${kit.slug}/items`} className="btn-ghost">
                View all items
              </Link>
            </div>
          </div>
        </div>
      </header>

      {items.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">What’s inside</h2>
          <ul className="grid gap-2">
            {items.slice(0, 5).map((it) => (
              <ItemRow
                key={it.sku}
                title={it.title}
                sku={it.sku}
                qty={it.qty}
                note={it.note}
                buyUrl={it.buy_url}
                contextRight={`in ${title}`}
              />
            ))}
          </ul>
          {items.length > 5 ? (
            <div>
              <Link href={`/kits/${kit.slug}/items`} className="btn-ghost">
                See all {items.length} items
              </Link>
            </div>
          ) : null}
        </section>
      )}
    </section>
  );
}
