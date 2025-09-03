import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/ssr-supabase";
import { DbKit, DbKitItem } from "@/lib/db/schemas";

export const revalidate = 300;

function str(v: unknown, fallback: string | null = null): string | null {
  if (typeof v === "string") return v;
  if (v == null) return fallback;
  try { return String(v); } catch { return fallback; }
}
function bool(v: unknown, fallback = false): boolean {
  if (typeof v === "boolean") return v;
  if (v == null) return fallback;
  return Boolean(v);
}

function mapKit(row: Record<string, unknown>) {
  return {
    id: str(row["id"]) ?? "",
    slug: str(row["slug"]) ?? "",
    title: str(row["title"]) ?? str(row["name"]) ?? str(row["slug"]) ?? "Untitled Kit",
    description: str(row["description"]) ?? str(row["summary"]) ?? null,
    is_published: bool(row["is_published"] ?? row["published"], false),
    buy_url: str(row["buy_url"]) ?? str(row["url"]) ?? null,
  };
}

async function loadKit(slug: string) {
  const sb = getSupabase();
  const q = await sb.from("kits").select("*").eq("slug", slug).limit(1);
  if (q.error) throw q.error;
  const row = (q.data ?? [])[0] as Record<string, unknown> | undefined;
  return row ? DbKit.parse(mapKit(row)) : null;
}

async function loadItems(kitId: string) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("kit_items")
    .select("quantity, sort_order, product:products(id, sku, title, url)")
    .eq("kit_id", kitId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return DbKitItem.array().parse(data ?? []);
}

export default async function KitPage({ params }: { params: { slug: string } }) {
  const kit = await loadKit(params.slug);
  if (!kit || !kit.is_published) notFound();
  const items = await loadItems(kit.id);

  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2">
        <h1 className="font-antonio text-4xl tracking-tight">{kit.title}</h1>
        {kit.description ? <p className="text-zinc-400">{kit.description}</p> : null}
      </header>

      <div className="rounded-2xl border bg-zinc-950/40 p-5">
        <h3 className="mb-3 text-lg font-semibold">Whatâ€™s inside</h3>
        <ul className="grid gap-2">
          {items.map((it, i) => (
            <li key={i} className="flex items-start justify-between gap-3">
              <div className="text-sm">
                <div className="font-medium">{it.product.title}</div>
                <div className="text-zinc-400">
                  SKU: {it.product.sku} {it.quantity > 1 ? ("Ã—" + it.quantity) : ""}
                </div>
              </div>
              {it.product.url ? (
                <Link href={it.product.url} target="_blank" rel="noopener noreferrer" className="text-xs underline-offset-2 hover:underline">
                  View
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        <Link href={`/r/${kit.slug}`} className="inline-flex items-center rounded-2xl border px-5 py-3 text-sm font-medium hover:bg-zinc-900">
          Buy the {kit.title}
        </Link>
        <Link href={`/kits/${kit.slug}/items`} className="inline-flex items-center rounded-2xl border px-5 py-3 text-sm font-medium hover:bg-zinc-900">
          Copy SKUs
        </Link>
      </div>
    </section>
  );
}