// src/app/kits/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { getKit } from "@/lib/kits";
import Link from "next/link";

export default function KitPage({ params }: { params: { slug: string } }) {
  const kit = getKit(params.slug);
  if (!kit) return notFound();

  // Build Amway multi-add URL
  const cartUrl = (() => {
    if (!kit.items || kit.items.length === 0) return null;
    const base = process.env.NEXT_PUBLIC_AMWAY_MYSHOP_URL || "https://cart.amway.com";
    const skuParams = kit.items.map((i) => `sku=${i.sku}&qty=${i.qty ?? 1}`).join("&");
    return `${base}/?${skuParams}`;
  })();

  return (
    <section className="grid gap-10 md:grid-cols-[1.1fr,1fr]">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          {kit.title}
        </h1>
        {kit.subtitle && (
          <p className="mt-3 max-w-2xl text-zinc-300">{kit.subtitle}</p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {cartUrl && (
            <a
              href={cartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-medium text-black hover:bg-emerald-300"
            >
              Buy now
            </a>
          )}
          <Link
            href={`/kits/${kit.slug}/items`}
            className="rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-medium hover:bg-zinc-900"
          >
            View SKUs
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-[10px] uppercase tracking-widest">Weight</div>
            <div className="text-white">{kit.weight_lb ?? "-"}</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-[10px] uppercase tracking-widest">Items</div>
            <div className="text-white">{kit.items?.length ?? 0}</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-[10px] uppercase tracking-widest">SKUs</div>
            <div className="text-white">
              {kit.items?.map((i) => i.sku).filter(Boolean).length ?? 0}
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-semibold">What&apos;s inside</h2>
        <ul className="mt-4 space-y-3">
          {kit.items && kit.items.length > 0 ? (
            kit.items.map((item, idx) => (
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
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
        {kit.image ? (
          <Image
            src={kit.image}
            alt={kit.imageAlt ?? kit.title ?? ""}
            width={900}
            height={600}
            className="aspect-video w-full rounded-2xl object-cover"
            priority
          />
        ) : (
          <div className="aspect-video rounded-2xl border border-zinc-800 bg-zinc-900/40" />
        )}
      </div>
    </section>
  );
}
