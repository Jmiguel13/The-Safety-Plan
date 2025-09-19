import Link from "next/link";

const amounts = [10, 25, 50] as const;

export default function HeroDonateRow() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {amounts.map((a) => (
        <Link
          key={a}
          href={`/donate?amount=${a}`}
          className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-sm hover:border-white/20 hover:bg-white/5"
        >
          ${a}
        </Link>
      ))}
      <Link
        href="/donate"
        className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-sm hover:border-white/20 hover:bg-white/5"
      >
        Other
      </Link>
    </div>
  );
}
