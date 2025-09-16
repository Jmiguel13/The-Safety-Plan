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

/** Normalize to a consistent, safe display shape */
export function normalizeItems(kit: Kit): NormalizedItem[] {
  const items: KitItem[] = kit.items ?? [];
  return items.map((it) => {
    const sku = String(it.sku || "").trim();
    const qty = Number(it.qty ?? 1) || 1;

    return {
      sku,
      qty,
      title: it.title?.trim(),
      note: it.note ?? undefined,
      buy_url: it.buy_url ?? undefined,
    };
  });
}

/** { itemCount, skuCount } for stat chips */
export function statsForKit(kit: Kit) {
  const items = normalizeItems(kit);
  const unique = new Set(items.map((i) => i.sku).filter(Boolean));
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
  if (kit.title && kit.title.trim()) return kit.title.trim();
  return (
    slug
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ") + " Kit"
  );
}

/** Subtitle with a simple, nice fallback */
export function subtitleForKit(slug: string, kit: Pick<Kit, "subtitle">) {
  if (kit.subtitle && kit.subtitle.trim()) return kit.subtitle.trim();
  const nice = slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
  return `${nice} essentials for everyday readiness`;
}

/** Hero image with sensible fallbacks */
export function heroForKit(
  slug: string,
  kit: Pick<Kit, "image" | "imageAlt" | "title">
) {
  const src = kit.image ?? `/images/kits/${slug}.jpg`;
  const alt = kit.imageAlt ?? `${titleForKit(slug, kit)} hero image`;
  return { src, alt };
}

/** Multi-add cart link for entire kit */
export function fullKitCartUrl(kit: Kit): string | null {
  const items = normalizeItems(kit);
  if (items.length === 0) return null;
  return buildCartLink(items.map(({ sku, qty }) => ({ sku, qty })));
}
