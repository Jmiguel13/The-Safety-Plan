// src/app/gear/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";
import { TSP_PRODUCTS } from "@/lib/tsp-products";

export const dynamic = "force-dynamic";

/** Map product id -> route slug (underscores → hyphens) */
function idToSlug(id: string) {
  return id.replace(/_/g, "-");
}

/** Find a product by route slug */
function findBySlug(slug: string) {
  return TSP_PRODUCTS.map((p) => ({ ...p, _slug: idToSlug(p.id) }))
    .find((p) => p._slug === slug) || null;
}

/** SEO */
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = findBySlug(params.slug);
  if (!product) {
    return {
      title: "Gear unavailable — The Safety Plan",
      description: "This item isn’t published yet.",
    };
  }
  return {
    title: `${product.title} — The Safety Plan`,
    description: product.blurb || "The Safety Plan gear.",
    openGraph: {
      title: product.title,
      description: product.blurb || "The Safety Plan gear.",
      url: `/gear/${params.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: product.title,
      description: product.blurb || "The Safety Plan gear.",
    },
  };
}

export default function GearPage({ params }: { params: { slug: string } }) {
  const product = findBySlug(params.slug);

  if (!product) {
    return (
      <section className="min-h-[60vh] grid place-items-center">
        <div className="text-center space-y-3">
          <div className="tag tag-accent w-max mx-auto">Not found</div>
          <h1 className="text-3xl font-extrabold tracking-tight">Gear unavailable</h1>
          <p className="muted">This item isn’t published yet.</p>
          <div className="pt-2">
            <Link href="/shop" className="btn-ghost">Back to Shop</Link>
          </div>
        </div>
      </section>
    );
  }

  const { title, blurb, url, inStock, id } = product;

  return (
    <section className="space-y-6 max-w-3xl">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
        {blurb ? <p className="muted">{blurb}</p> : null}
      </header>

      {/* If the item is in stock and has a URL, render a Buy button; otherwise render waitlist */}
      {inStock && url ? (
        url.startsWith("/") ? (
          <Link href={url} className="btn">Buy</Link>
        ) : (
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn">Buy</a>
        )
      ) : (
        <WaitlistForm productId={id} productTitle={title} />
      )}

      <div>
        <Link href="/shop" className="btn-ghost">Back to Shop</Link>
      </div>
    </section>
  );
}
