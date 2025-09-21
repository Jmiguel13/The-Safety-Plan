// src/app/checkout/kit/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getKit } from "@/lib/kits";
import KitCheckoutForm from "@/components/KitCheckoutForm";

export default async function KitCheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kit = getKit(slug);
  if (!kit) return notFound();

  return (
    <section className="grid gap-10 md:grid-cols-[1.1fr,1fr]">
      <div>
        <nav className="mb-2 text-xs text-zinc-500">
          <Link href="/kits" className="underline-offset-2 hover:underline">
            Kits
          </Link>{" "}
          / <span className="text-zinc-300">{kit.title}</span>
        </nav>

        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{kit.title}</h1>
        {kit.subtitle && <p className="mt-2 max-w-2xl text-zinc-300">{kit.subtitle}</p>}

        <KitCheckoutForm kit={kit} />

        <h2 className="mt-10 text-2xl font-semibold">What&apos;s inside</h2>
        <ul className="mt-4 space-y-3">
          {kit.items?.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3"
            >
              <div>
                <div className="font-medium text-white">{item.title}</div>
                {item.note && <div className="text-xs text-zinc-400">{item.note}</div>}
              </div>
              <div className="text-xs text-zinc-500">
                SKU {item.sku} × {item.qty ?? 1}
              </div>
            </li>
          ))}
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
