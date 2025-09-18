// src/app/gear/[slug]/page.tsx
import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";
import { TSP_PRODUCTS } from "@/lib/tsp-products";

/** Match /gear/some-slug to product.id (underscores -> hyphens) */
function findBySlug(slug: string) {
  const withSlugs = TSP_PRODUCTS.map((p) => ({ ...p, _slug: p.id.replace(/_/g, "-") }));
  return withSlugs.find((p) => p._slug === slug) || null;
}

export default async function GearPage({
  params,
}: {
  /** Next 15: params must be a Promise */
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = findBySlug(slug);

  if (!product) {
    return (
      <section className="min-h-[60vh] grid place-items-center px-6">
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

  const actionLabel = product.inStock ? "Buy" : "Waitlist";

  return (
    <section className="space-y-6 max-w-3xl">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">{product.title}</h1>
        {product.blurb ? <p className="muted">{product.blurb}</p> : null}
      </header>

      {product.inStock && product.url ? (
        product.url.startsWith("/") ? (
          <Link href={product.url} className="btn">{actionLabel}</Link>
        ) : (
          <a href={product.url} target="_blank" rel="noopener noreferrer" className="btn">
            {actionLabel}
          </a>
        )
      ) : (
        <WaitlistForm productId={product.id} productTitle={product.title} />
      )}

      <div>
        <Link href="/shop" className="btn-ghost">Back to Shop</Link>
      </div>
    </section>
  );
}

