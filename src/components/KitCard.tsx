// src/components/KitCard.tsx
import Link from "next/link";

export default function KitCard(props: {
  href: string;
  title: string;
  blurb: string;
  weight?: string;
}) {
  return (
    <article className="group rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-emerald-500/40">
      <header className="flex items-start justify-between gap-4">
        <h3 className="text-2xl font-semibold">{props.title}</h3>
        {props.weight ? (
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-300">
            {props.weight}
          </span>
        ) : null}
      </header>
      <p className="mt-2 text-zinc-300">{props.blurb}</p>

      <div className="mt-5">
        <Link
          href={props.href}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-black transition hover:bg-emerald-300"
        >
          View Details <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
