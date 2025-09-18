import Link from "next/link";
import { notFound } from "next/navigation";

import { kits, type Kit } from "@/lib/kits";
import {
  titleForKit,
  subtitleForKit,
  statsForKit,
  normalizeItems,
} from "@/lib/kits-helpers";
import ItemRow from "@/components/ItemRow";
import BuyButtons from "@/components/BuyButtons";
import CopySkus from "@/components/CopySkus";

export const revalidate = 86400;

export function generateStaticParams() {
  return (kits as Kit[]).map((k) => ({ slug: k.slug }));
}

export default async function KitItemsPage({
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
  const items = normalizeItems(kit);
  const cartItems = items.map(({ sku, qty }) => ({ sku, qty }));

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{title} • Items</h1>
        <p className="muted">
          {subtitle || `${stats.itemCount} items • ${stats.skuCount} SKUs`}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <BuyButtons items={cartItems} fallbackSkusTitle={`${title} — SKUs`} />
          <CopySkus items={cartItems} />
          <Link href={`/kits/${slug}`} className="btn-ghost">
            Back to kit
          </Link>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="panel p-4">
          <p className="muted text-sm">No items are listed for this kit yet.</p>
        </div>
      ) : (
        <ul className="grid gap-2">
          {items.map((it) => (
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
      )}
    </section>
  );
}
