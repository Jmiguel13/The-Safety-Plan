// src/lib/kit-pricing.ts
import Stripe from "stripe";

export type Variant = "daily" | "10day" | "30day";
export type KitPriceEntry = { unitAmount: number; currency: string };
export type KitPrices = Record<Variant, KitPriceEntry | null>;
export type KitPricesMap = Record<string, KitPrices>; // key: kit slug

const priceEnv: Record<string, Record<Variant, string | undefined>> = {
  resilient: {
    daily: process.env.STRIPE_PRICE_RESILIENT_DAILY,
    "10day": process.env.STRIPE_PRICE_RESILIENT_10DAY,
    "30day": process.env.STRIPE_PRICE_RESILIENT_30DAY,
  },
  homefront: {
    daily: process.env.STRIPE_PRICE_HOMEFRONT_DAILY,
    "10day": process.env.STRIPE_PRICE_HOMEFRONT_10DAY,
    "30day": process.env.STRIPE_PRICE_HOMEFRONT_30DAY,
  },
};

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || "";
// ⬇️ no apiVersion override (prevents TS conflicts across SDK versions)
const stripe: Stripe | null = STRIPE_KEY ? new Stripe(STRIPE_KEY) : null;

async function fetchPrice(id?: string | null): Promise<KitPriceEntry | null> {
  if (!id || !stripe) return null;
  const p = await stripe.prices.retrieve(id);
  return {
    unitAmount: p.unit_amount ?? 0,
    currency: (p.currency ?? "usd").toUpperCase(),
  };
}

export async function getKitPrices(): Promise<KitPricesMap> {
  const out: KitPricesMap = {
    resilient: { daily: null, "10day": null, "30day": null },
    homefront: { daily: null, "10day": null, "30day": null },
  };

  await Promise.all(
    Object.entries(priceEnv).flatMap(([slug, table]) =>
      (Object.keys(table) as Variant[]).map(async (v) => {
        out[slug][v] = await fetchPrice(table[v]);
      })
    )
  );

  return out;
}

export function formatUsd(cents?: number, currency = "USD") {
  if (!Number.isFinite(cents)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format((cents as number) / 100);
}
