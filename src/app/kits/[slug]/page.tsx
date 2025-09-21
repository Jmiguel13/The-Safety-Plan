// src/app/kits/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { getKit } from "@/lib/kits";
import Link from "next/link";
import KitCheckoutForm from "@/components/KitCheckoutForm";

export const dynamic = "force-static";

export default async function KitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kit = getKit(slug);
  if (!kit) return notFound();

  return (
    <section className="grid gap-10 md:grid-cols-[1.2fr,1fr]">
      {/* Left: copy + CTAs */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs tracking-wide">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Mission-ready wellness
        </div>

        <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
          {kit.title}
        </h1>
        {kit.subtitle && (
          <p className="mt-2 max-w-2xl text-zinc-300">{kit.subtitle}</p>
        )}

        {/* Inline Stripe checkout (choose full kit or custom) */}
        <KitCheckoutForm kit={kit} />

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-[10px] uppercase tracking-widest text-zinc-400">
              Weight
            </div>
            <div className="text-white">{kit.weight_lb ?? "—"}</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-[10px] uppercase tracking-widest text-zinc-400">
              Items
            </div>
            <div className="text-white">{kit.items?.length ?? 0}</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-[10px] uppercase tracking-widest text-zinc-400">
              SKUs
            </div>
            <div className="text-white">
              {kit.items?.map((i) => i.sku).filter(Boolean).length ?? 0}
            </div>
          </div>
        </div>

        {/* Contents preview */}
        <h2 className="mt-10 text-2xl font-semibold">What&apos;s inside</h2>
        <ul className="mt-4 space-y-3">
          {kit.items && kit.items.length > 0 ? (
            kit.items.slice(0, 6).map((item, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3"
              >
                <div>
                  <div className="font-medium text-white">{item.title}</div>
                  {item.note && (
                    <div className="text-xs text-zinc-400">{item.note}</div>
                  )}
                </div>
                <div className="text-xs text-zinc-500">
                  SKU {item.sku} × {item.qty ?? 1}
                </div>
              </li>
            ))
          ) : (
            <p className="text-zinc-500">Item list coming soon.</p>
          )}
        </ul>

        {kit.items && kit.items.length > 6 && (
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href={`/kits/${kit.slug}/items`}
              className="text-sm text-emerald-300 underline-offset-2 hover:underline"
            >
              View full list →
            </Link>
            <Link
              href={`/r/${kit.slug}?cart=1`}
              className="text-sm text-zinc-300 underline-offset-2 hover:underline"
            >
              Try Amway cart (items)
            </Link>
          </div>
        )}
      </div>

      {/* Right: hero image */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
        {kit.image ? (
          <Image
            src={kit.image}
            alt={kit.imageAlt ?? kit.title ?? ""}
            width={1200}
            height={800}
            className="aspect-video w-full rounded-2xl object-cover"
            priority
          />
        ) : (
          <div className="aspect-video rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-800" />
        )}
      </div>
    </section>
  );
}
