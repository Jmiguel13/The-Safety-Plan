// src/lib/kits-helpers.ts
import { buildCartLink } from "@/lib/amway";
import type { Kit, KitItem } from "@/lib/kits";

export type NormalizedItem = {
  sku: string;
  qty: number;
  title?: string;
  note?: string;
  buy_url?: string;
};

const isNonEmpty = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

/** Normalize to a consistent, safe display shape */
export function normalizeItems(kit: Kit): NormalizedItem[] {
  const items: KitItem[] = kit.items ?? [];
  return items
    .map((it) => {
      const rawSku = String(it.sku ?? "").trim(); // keep original case (SKUs like A8992/E0001)
      const qty = Number(it.qty ?? 1) || 1;

      return {
        sku: rawSku,
        qty,
        title: isNonEmpty(it.title) ? it.title.trim() : undefined,
        note: isNonEmpty(it.note) ? it.note : undefined,
        buy_url: isNonEmpty(it.buy_url) ? it.buy_url : undefined,
      };
    })
    // drop any accidental blanks to avoid broken links/carts
    .filter((it) => it.sku.length > 0);
}

/** { itemCount, skuCount } for stat chips (line items vs unique SKUs) */
export function statsForKit(kit: Kit) {
  const items = normalizeItems(kit);
  const unique = new Set(items.map((i) => i.sku));
  return { itemCount: items.length, skuCount: unique.size };
}

/** "3 lb" or null (hidden) */
export function weightLabel(kit: Kit) {
  if (kit.weight_lb === undefined || kit.weight_lb === null) return null;
  if (typeof kit.weight_lb === "string") return kit.weight_lb;
  const n = Number(kit.weight_lb);
  if (!Number.isFinite(n) || n <= 0) return null;
  return `${n} lb`;
}

/** Title with clean fallback from slug */
export function titleForKit(slug: string, kit: Pick<Kit, "title">) {
  if (isNonEmpty(kit.title)) return kit.title.trim();
  return (
    slug
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ") + " Kit"
  );
}

/** Subtitle with a simple, nice fallback */
export function subtitleForKit(slug: string, kit: Pick<Kit, "subtitle">) {
  if (isNonEmpty(kit.subtitle)) return kit.subtitle.trim();
  const nice = slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
  return `${nice} essentials for everyday readiness`;
}

/** Hero image with sensible fallbacks (always a local asset) */
export function heroForKit(
  slug: string,
  kit: Pick<Kit, "image" | "imageAlt" | "title">
) {
  // Prefer explicit image; otherwise use your generic placeholder that exists in /public/kits
  const src = isNonEmpty(kit.image) ? kit.image : "/kits/placeholder.svg";
  const alt = isNonEmpty(kit.imageAlt)
    ? kit.imageAlt
    : `${titleForKit(slug, kit)} hero image`;
  return { src, alt };
}

/** Multi-add cart link for entire kit */
export function fullKitCartUrl(kit: Kit): string | null {
  const items = normalizeItems(kit);
  if (items.length === 0) return null;
  return buildCartLink(items.map(({ sku, qty }) => ({ sku, qty })));
}
