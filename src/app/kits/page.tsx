import BuyLink from "@/components/BuyLink";
export const dynamic = "error";
import Link from "next/link";
import { kits } from "@/lib/kits";
type AnyRec = Record<string, unknown>;

export default function KitsPage() {
  const data = (kits as unknown as AnyRec[]) ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1>Kits</h1>
        <p className="muted">Curated essentials for daily resilience.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((k) => {
          const slug = (k["slug"] as string) ?? "kit";
          const title = (k["title"] as string) ?? (slug[0]?.toUpperCase() + slug.slice(1));
          const items = Array.isArray((k as AnyRec)["contents"]) ? ((k as AnyRec)["contents"] as unknown[]).length : 0;
          return (
            <article key={slug} className="card-tactical">
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="muted text-sm mt-1">{items} items inside. Designed for focus, hydration, recovery, and rest.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={`/kits/${slug}`} className="btn">View kit</Link>
                <BuyLink href={`/r/${slug}`} className="btn-ghost">Buy now</BuyLink>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}











