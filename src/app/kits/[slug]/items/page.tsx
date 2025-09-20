// src/app/kits/[slug]/items/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import KitItemsList from "@/components/KitItemsList";
import { getKit, kits, type Kit } from "@/lib/kits";
import { normalizeItems, titleForKit } from "@/lib/kits-helpers";

export const revalidate = 86400;

export async function generateStaticParams() {
  return (kits as Kit[]).map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const kit = getKit(slug);
  if (!kit) return { title: "Kit items — not found" };

  const base = titleForKit(slug, kit);
  return {
    title: `${base} — Items`,
    description: `See everything inside the ${base}.`,
    alternates: { canonical: `/kits/${slug}/items` },
  };
}

export default async function KitItemsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kit = getKit(slug);
  if (!kit) notFound();

  const items = normalizeItems(kit);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {titleForKit(slug, kit)} — Items
        </h1>
        <p className="muted">Everything included in the kit.</p>
      </header>

      <KitItemsList items={items} />

      <div className="pt-2">
        <Link href={`/kits/${slug}`} className="btn-ghost">
          Back to kit
        </Link>
      </div>
    </section>
  );
}
