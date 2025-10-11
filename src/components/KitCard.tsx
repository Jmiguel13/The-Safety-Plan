// src/components/KitsCTA.tsx
import Link from "next/link";
import { MYSHOP_BASE } from "@/lib/amway";

export default function KitsCTA() {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 md:p-10">
      <h2 className="text-center text-4xl font-bold tracking-tight">Shop Our Kits</h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-300">
        Every purchase helps us send care packages to frontline fighters and their families.
        These are more than products — they’re lifelines.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <a
          href={MYSHOP_BASE}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-white px-4 py-2 text-black hover:bg-zinc-100"
        >
          Visit MyShop →
        </a>

        <Link
          href="/kits"
          className="rounded-full border border-zinc-700 px-4 py-2 hover:bg-zinc-900"
        >
          View Kit Details →
        </Link>
      </div>
    </section>
  );
}
