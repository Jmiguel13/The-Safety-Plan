// src/app/kits/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";

import { kits, type Kit } from "@/lib/kits";
import { MYSHOP_BASE } from "@/lib/amway";
import KitHeader from "@/components/KitHeader";
import KitItemsList from "@/components/KitItemsList";
import { normalizeItems, fullKitCartUrl } from "@/lib/kits-helpers";
import { TSP_PRODUCTS } from "@/lib/tsp-products";

export const dynamic = "force-dynamic";

/** Find a kit by slug */
function findKit(slug: string): Kit | null {
  const list = kits as Kit[];
  return list.find((k) => k.slug === slug) ?? null;
}

export default async function KitPage({
  params,
}: {
  /** Next 15 type checker expects Promise for params */
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const kit = findKit(slug);
  if (!kit) notFound();

  const items = normalizeItems(kit);
  const addAllUrl = fullKitCartUrl(kit) ?? undefined;

  // KitHeader requires a string; fall back to MyShop root if we can't build a cart URL
  const buyUrl = addAllUrl || MYSHOP_BASE;

  // Optional Safety Plan gear section
  const gear =
    Array.isArray(kit.gear)
      ? kit.gear
          .map((id) => TSP_PRODUCTS.find((g) => g.id === id) || null)
          .filter((g): g is NonNullable<typeof g> => Boolean(g))
      : [];

  return (
    <section className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <KitHeader slug={slug} kit={kit} buyUrl={buyUrl} />

      {/* What's inside */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">What’s inside</h2>
        {items.length ? (
          <KitItemsList items={items} />
        ) : (
          <div className="panel-elevated p-6">
            <p className="muted">
              No items yet. Add SKUs under <code>items[]</code> in{" "}
              <code>src/lib/kits.ts</code>.
            </p>
          </div>
        )}
      </div>

      {/* Optional Safety Plan gear */}
      {gear.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">The Safety Plan gear</h2>
          <ul className="space-y-3">
            {gear.map((g) => {
              const href = `/gear/${g.id.replace(/_/g, "-")}`;
              return (
                <li key={g.id} className="glow-row">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{g.title}</div>
                    {g.blurb ? <div className="text-sm muted">{g.blurb}</div> : null}
                  </div>
                  <Link href={href} className="link-chip" aria-label={`View ${g.title}`}>
                    View
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Bottom CTAs */}
      <div className="flex flex-wrap gap-3">
        {items.length > 0 && addAllUrl ? (
          <a
            href={addAllUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            aria-label={`Add full ${kit.title ?? "kit"} to MyShop cart`}
          >
            Add full kit to cart
          </a>
        ) : null}
        <Link href={`/kits/${slug}/items`} className="btn-ghost">
          View items
        </Link>
      </div>
    </section>
  );
}
