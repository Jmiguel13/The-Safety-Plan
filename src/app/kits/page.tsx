// src/app/kits/page.tsx
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { kits } from "@/lib/kits";

export const dynamic = "force-static";
export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Kits",
  description:
    "Mission-ready wellness kits — focus, hydration, recovery, rest. Buy direct via Stripe.",
};

export default function KitsIndex() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-5xl font-extrabold tracking-tight">Kits</h1>
        <p className="text-zinc-300">
          Built to be carried. Designed to make a difference. Choose a kit and check out securely
          with Stripe.
        </p>
      </header>

      <ul className="grid gap-5 sm:grid-cols-2">
        {kits.map((k) => (
          <li key={k.slug} className="overflow-hidden rounded-3xl border border-zinc-800">
            <div className="p-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-2">
                {k.image ? (
                  <Image
                    src={k.image}
                    alt={k.imageAlt ?? k.title ?? ""}
                    width={1200}
                    height={800}
                    className="aspect-video w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="aspect-video rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-800" />
                )}
              </div>

              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-semibold">{k.title ?? "Kit"}</h2>
                  {k.subtitle && (
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{k.subtitle}</p>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  <Link href={`/kits/${k.slug}`} className="btn-ghost">
                    View
                  </Link>
                  <Link href={`/checkout/kit/${k.slug}`} className="btn">
                    Buy
                  </Link>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500">Weight</div>
                  <div className="text-white">{k.weight_lb ?? "—"}</div>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500">Items</div>
                  <div className="text-white">{k.items?.length ?? 0}</div>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500">SKUs</div>
                  <div className="text-white">
                    {k.items?.map((i) => i.sku).filter(Boolean).length ?? 0}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
