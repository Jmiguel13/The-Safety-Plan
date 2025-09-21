// src/app/kits/[slug]/items/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { getKit } from "@/lib/kits";
import CopySkusButton from "@/components/CopySkusButton";

export const dynamic = "force-static";

type RouteProps = { params: Promise<{ slug: string }> };

export default async function KitItemsPage({ params }: RouteProps) {
  const { slug } = await params;
  const kit = getKit(slug);
  if (!kit) return notFound();

  const selections = (kit.items ?? []).map((i) => ({ sku: i.sku, qty: i.qty ?? 1 }));

  return (
    <section className="space-y-8">
      <header>
        <nav className="mb-2 text-xs text-zinc-500">
          <Link href="/kits" className="underline-offset-2 hover:underline">
            Kits
          </Link>{" "}
          /{" "}
          <Link href={`/kits/${kit.slug}`} className="underline-offset-2 hover:underline">
            {kit.title}
          </Link>{" "}
          / <span className="text-zinc-300">Items</span>
        </nav>

        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          What’s inside — {kit.title}
        </h1>
        {kit.subtitle && <p className="mt-2 max-w-2xl text-zinc-300">{kit.subtitle}</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/checkout/kit/${kit.slug}`}
            className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-300"
          >
            Buy full kit (Stripe)
          </Link>
          <Link
            href={`/r/${kit.slug}?cart=1`}
            className="rounded-full border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900"
          >
            Try Amway cart (items)
          </Link>
          <Link
            href={`/r/${kit.slug}?cart=0`}
            className="rounded-full border border-zinc-800/80 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
          >
            Open MyShop
          </Link>

          <CopySkusButton skus={selections} />
        </div>
      </header>

      <ul className="space-y-3">
        {(kit.items ?? []).map((item, idx) => (
          <li
            key={`${item.sku}-${idx}`}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
          >
            <div className="min-w-0">
              <div className="truncate font-medium text-white">{item.title}</div>
              {item.note && <div className="text-xs text-zinc-400">{item.note}</div>}
            </div>
            <div className="shrink-0 text-right text-xs text-zinc-400">
              <div>SKU {item.sku}</div>
              <div>Qty {item.qty ?? 1}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
