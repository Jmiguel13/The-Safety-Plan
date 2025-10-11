// src/components/KitCheckoutForm.tsx
"use client";

import { useMemo, useState } from "react";
import { kitsBySlug } from "@/lib/kits";
import { buildCartLink, myShopLink } from "@/lib/amway";
import type { Variant } from "@/lib/kit-pricing";

// how many cans are included per variant
const VARIANT_CANS: Record<Variant, number> = {
  daily: 1,
  "10day": 10,
  "30day": 30,
};

export type Prices = Partial<Record<Variant, { unitAmount: number; currency: string }>>;

type Props = {
  kit: { slug: string; title?: string };
  prices?: Prices | null;
  className?: string;
};

function fmt(p?: { unitAmount: number; currency: string }) {
  if (!p) return undefined;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: p.currency ?? "USD",
      maximumFractionDigits: 0,
    }).format((p.unitAmount ?? 0) / 100);
  } catch {
    return `$${(p.unitAmount ?? 0) / 100}`;
  }
}

/** Variant-aware label for the XS Energy flavor select.
 *  Daily  -> "Single Can — {flavor}"
 *  10-Day -> "10 Cans — {flavor}"
 *  30-Day -> "Full Case — {flavor}"
 */
function energyLabelFor(baseLabel: string, variant: Variant) {
  if (variant === "daily") return `Single Can — ${baseLabel}`;
  if (variant === "10day") return `10 Cans — ${baseLabel}`;
  return `Full Case — ${baseLabel}`; // 30-day
}

// Convert can-count to # of 12-packs for cart
function packsForCans(cans: number) {
  return Math.ceil(cans / 12);
}

export default function KitCheckoutForm({ kit, prices, className }: Props) {
  const data = kitsBySlug[kit.slug];
  const [variant, setVariant] = useState<Variant>("daily");

  // Options state (enabled only if the kit defines them)
  const energyFlavorOpt = data?.options?.find((o) => o.type === "select" && o.key === "energyFlavor");
  const proteinOpt = data?.options?.find((o) => o.type === "select" && o.key === "proteinChoice");
  const mensPackOpt = data?.options?.find((o) => o.type === "checkbox" && o.key === "includeMensPack");

  const [energySku, setEnergySku] = useState<string>(
    (energyFlavorOpt && "defaultSku" in energyFlavorOpt ? energyFlavorOpt.defaultSku : "") || ""
  );
  const [proteinSku, setProteinSku] = useState<string>(
    (proteinOpt && "defaultSku" in proteinOpt ? proteinOpt.defaultSku : "") || ""
  );
  const [includeMensPack, setIncludeMensPack] = useState<boolean>(
    !!(mensPackOpt && mensPackOpt.defaultChecked)
  );

  const priceStr = useMemo(() => fmt(prices?.[variant]), [prices, variant]);

  // Build cart with base items + chosen options
  const cartMeta = useMemo(() => {
    if (!data) {
      return { url: myShopLink(), dailyEnergyInHouse: false };
    }

    // Base items
    const entries: Array<{ sku: string; qty: number }> = (data.items ?? []).map((i) => ({
      sku: i.sku,
      qty: Math.max(1, i.qty ?? 1),
    }));

    // ENERGY (XS): only add packs for 10/30 day; Daily can is fulfilled in-kit
    let dailyEnergyInHouse = false;
    if (energySku) {
      const cans = VARIANT_CANS[variant];
      if (cans >= 12) {
        const packs = packsForCans(cans);
        entries.push({ sku: energySku, qty: packs });
      } else {
        dailyEnergyInHouse = true;
      }
    }

    // PROTEIN (replace any base protein SKUs with chosen one)
    if (proteinSku) {
      const PROTEIN_SKUS = new Set(["128154", "128156", "128155", "125923"]);
      const filtered = entries.filter((e) => !PROTEIN_SKUS.has(e.sku));
      filtered.push({ sku: proteinSku, qty: 1 });
      entries.length = 0;
      entries.push(...filtered);
    }

    // Men’s Pack (optional)
    if (includeMensPack && mensPackOpt?.sku) {
      entries.push({ sku: mensPackOpt.sku, qty: 1 });
    }

    const url = buildCartLink(entries, {
      utm_source: "tsp",
      utm_medium: "kit",
      utm_campaign: data.slug,
      utm_content: variant,
    });

    return { url, dailyEnergyInHouse };
  }, [data, energySku, proteinSku, includeMensPack, mensPackOpt, variant]);

  return (
    <form
      className={["rounded-2xl border border-white/10 bg-white/[0.04] p-4", className].join(" ")}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* Variant selection */}
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Duration
          </legend>
          <div className="flex flex-wrap gap-2">
            {(["daily", "10day", "30day"] as const).map((v) => (
              <button
                key={v}
                type="button"
                className="pill"
                data-active={variant === v}
                onClick={() => setVariant(v)}
              >
                {v === "daily" ? "Daily" : v === "10day" ? "10-Day" : "30-Day"}
                {prices?.[v] ? ` — ${fmt(prices[v])}` : ""}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Price hint */}
        <div className="self-end">
          {priceStr ? (
            <div className="text-sm text-zinc-300">
              <span className="font-medium">Est. total:</span> {priceStr}{" "}
              <span className="text-zinc-500">(before tax/shipping)</span>
            </div>
          ) : (
            <div className="text-sm text-zinc-500">Pricing updates at checkout.</div>
          )}
        </div>
      </div>

      {/* Options */}
      {(energyFlavorOpt || proteinOpt || mensPackOpt) && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {energyFlavorOpt ? (
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                XS Energy Flavor
              </span>
              <select
                className="rounded-md border border-white/10 bg-black/40 px-3 py-2"
                value={energySku}
                onChange={(e) => setEnergySku(e.target.value)}
              >
                {energyFlavorOpt.choices.map((c) => (
                  <option key={c.sku} value={c.sku}>
                    {energyLabelFor(c.label, variant)}
                  </option>
                ))}
              </select>
              {/* Small helper for Daily variant */}
              {variant === "daily" ? (
                <span className="mt-1 text-xs text-zinc-500">
                  Includes one can in your kit. Energy drink isn’t added to your MyShop cart for Daily.
                </span>
              ) : null}
            </label>
          ) : null}

          {proteinOpt ? (
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {proteinOpt.label}
              </span>
              <select
                className="rounded-md border border-white/10 bg-black/40 px-3 py-2"
                value={proteinSku}
                onChange={(e) => setProteinSku(e.target.value)}
              >
                {proteinOpt.choices.map((c) => (
                  <option key={c.sku} value={c.sku}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {mensPackOpt ? (
            <label className="mt-1 flex items-center gap-2">
              <input
                type="checkbox"
                className="size-4 rounded border-white/20 bg-black/50"
                checked={includeMensPack}
                onChange={(e) => setIncludeMensPack(e.target.checked)}
              />
              <span className="text-sm">{mensPackOpt.label}</span>
            </label>
          ) : null}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {/* Primary CTA → Buy now */}
        <a href={cartMeta.url} target="_blank" rel="noopener noreferrer" className="btn">
          Buy now
        </a>
        {/* (Removed) Copy Selection button */}
      </div>
    </form>
  );
}
