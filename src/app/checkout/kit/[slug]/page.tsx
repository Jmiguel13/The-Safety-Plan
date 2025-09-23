// src/app/checkout/kit/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { kits, type Kit } from "@/lib/kits";
import KitCheckoutForm, { type KitSlug } from "../KitCheckoutForm";

// Rebuild this static page at most once per day
export const revalidate = 86_400;

export const metadata: Metadata = { title: "Checkout — Kit" };

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = (Array.isArray(kits) ? kits : [])
    .map((k) => k?.slug)
    .filter((s): s is string => Boolean(s));
  return slugs.map((slug) => ({ slug }));
}

function getKitBySlug(slug: string): Kit | undefined {
  const all = Array.isArray(kits) ? kits : [];
  return all.find((k) => String(k?.slug) === String(slug));
}

// ✅ Next 15 expects async params in the entry signature
export default async function KitCheckoutPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const kit = getKitBySlug(slug);
  if (!kit) notFound();

  const input = {
    slug: kit.slug as KitSlug,
    title: kit.title,
  };

  const items =
    Array.isArray(
      (kit as unknown as { items?: Array<{ sku: string; title?: string; qty?: number }> }).items
    )
      ? (kit as unknown as { items: Array<{ sku: string; title?: string; qty?: number }> }).items
      : [];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold">{kit.title ?? "Kit checkout"}</h1>
      {"subtitle" in kit && (kit as { subtitle?: string }).subtitle ? (
        <p className="mt-2 max-w-2xl text-zinc-300">
          {(kit as { subtitle?: string }).subtitle}
        </p>
      ) : null}

      <KitCheckoutForm kit={input} />

      <h2 className="mt-10 text-2xl font-semibold">What&apos;s inside</h2>
      <ul className="mt-4 list-disc space-y-1 pl-6 text-sm text-zinc-200">
        {items.map((it, i) => (
          <li key={`${it.sku}-${i}`}>
            {it.title ?? it.sku}
            {typeof it.qty === "number" && it.qty > 0 ? (
              <span className="text-zinc-400"> ×{it.qty}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
