// src/app/api/checkout/kit/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

type Variant = "daily" | "10day" | "30day";

type CheckoutBody = {
  slug?: string;
  variant?: Variant;
  quantity?: number;
};

function env(key: string): string | undefined {
  return process.env[key];
}

function getBaseUrl(req: Request): string {
  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";
  try {
    return new URL(origin).origin;
  } catch {
    return "http://localhost:3000";
  }
}

/** Resolve either a priceId OR productId from env keys (tolerant patterns). */
function resolveTarget(
  slug: string,
  variant: Variant
): { priceId?: string; productId?: string } {
  const U = slug.toUpperCase();
  const V = variant.toUpperCase().replace("-", "");

  // Variant-specific first
  const priceVar = env(`STRIPE_PRICE_${U}_${V}`);
  const prodVar = env(`STRIPE_PRODUCT_${U}_${V}`);
  if (priceVar) return { priceId: priceVar };
  if (prodVar) return { productId: prodVar };

  // Legacy/alias
  const priceKitAfter = env(`STRIPE_PRICE_KIT_${U}`);
  const prodKitAfter = env(`STRIPE_PRODUCT_KIT_${U}`);
  if (priceKitAfter) return { priceId: priceKitAfter };
  if (prodKitAfter) return { productId: prodKitAfter };

  const priceKitBefore = env(`STRIPE_PRICE_${U}_KIT`);
  const prodKitBefore = env(`STRIPE_PRODUCT_${U}_KIT`);
  if (priceKitBefore) return { priceId: priceKitBefore };
  if (prodKitBefore) return { productId: prodKitBefore };

  // Generic
  const priceGeneric = env(`STRIPE_PRICE_${U}`);
  const prodGeneric = env(`STRIPE_PRODUCT_${U}`);
  if (priceGeneric) return { priceId: priceGeneric };
  if (prodGeneric) return { productId: prodGeneric };

  return {};
}

/* ---------------- STRICT variant matching (no amount heuristics) ---------------- */

function lc(s?: string | null) {
  return (s || "").toLowerCase();
}

function variantNeedles(v: Variant): string[] {
  if (v === "10day") return ["10day", "10-day", "10 day"];
  if (v === "30day") return ["30day", "30-day", "30 day"];
  return ["daily", "1-day", "1 day"];
}

function hasAny(haystack: string, needles: string[]) {
  for (const n of needles) if (haystack.includes(n)) return true;
  return false;
}

function textBagForPrice(p: Stripe.Price): string {
  const parts: string[] = [];
  if (p.nickname) parts.push(p.nickname);
  if (p.lookup_key) parts.push(p.lookup_key);
  return lc(parts.join(" "));
}

function metaVariant(p: Stripe.Price): string | undefined {
  return p.metadata?.["variant"];
}

/** Choose a price ID for the requested variant; error if no explicit match. */
async function choosePriceForVariant(
  stripe: Stripe,
  productId: string,
  variant: Variant
): Promise<string> {
  const pricesResp = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 100,
  });
  const prices = pricesResp.data;
  if (prices.length === 0) {
    throw new Error(`Product ${productId} has no active prices`);
  }

  // 1) Authoritative: metadata.variant === variant
  const metaMatches = prices.filter((p) => lc(metaVariant(p)) === variant);
  if (metaMatches.length === 1) return metaMatches[0].id;
  if (metaMatches.length > 1) {
    // pick most recently created among matches
    return metaMatches.sort((a, b) => (a.created ?? 0) - (b.created ?? 0)).at(-1)!.id;
  }

  // 2) Text match: nickname / lookup_key contains 'Daily' / '10-Day' / '30-Day'
  const needles = variantNeedles(variant);
  const textMatches = prices.filter((p) => hasAny(textBagForPrice(p), needles));
  if (textMatches.length === 1) return textMatches[0].id;
  if (textMatches.length > 1) {
    // prefer the longest nickname (usually more specific), then newest
    return textMatches
      .sort((a, b) => (lc(a.nickname).length - lc(b.nickname).length) || ((a.created ?? 0) - (b.created ?? 0)))
      .at(-1)!.id;
  }

  // ❌ No explicit match: do NOT guess — fail clearly
  throw new Error(
    `No explicit ${variant} price found on product ${productId}. ` +
      `Add a Stripe price with metadata.variant="${variant}" OR nickname/lookup_key containing "${variant}".`
  );
}

async function getPriceIdFromTarget(
  stripe: Stripe,
  target: { priceId?: string; productId?: string },
  slug: string,
  variant: Variant
): Promise<string> {
  // If price id is configured, use it
  if (target.priceId) {
    if (!target.priceId.startsWith("price_")) {
      throw new Error(
        `Configured value for ${slug} (${variant}) is not a Stripe price id: ${target.priceId}`
      );
    }
    return target.priceId;
  }

  // If product id, pick a price that explicitly matches the variant
  if (target.productId) {
    if (!target.productId.startsWith("prod_")) {
      throw new Error(
        `Configured value for ${slug} (${variant}) is not a Stripe product id: ${target.productId}`
      );
    }
    return choosePriceForVariant(stripe, target.productId, variant);
  }

  // Nothing configured for this variant
  throw new Error(
    `No Stripe price configured for ${slug} (${variant}). ` +
      `Add STRIPE_PRICE_${slug.toUpperCase()}_${variant.toUpperCase().replace("-", "")} ` +
      `or STRIPE_PRODUCT_${slug.toUpperCase()}_${variant.toUpperCase().replace("-", "")}.`
  );
}

export async function POST(req: Request) {
  try {
    const body: CheckoutBody = await req.json();
    const slug = String(body.slug ?? "").trim().toLowerCase();
    const variant: Variant = (body.variant ?? "10day") as Variant;
    const quantity = Number.isFinite(body.quantity)
      ? Math.max(1, Math.min(10, Number(body.quantity)))
      : 1;

    if (!slug) return NextResponse.json({ error: "Missing `slug`" }, { status: 400 });

    const secretKey = env("STRIPE_SECRET_KEY");
    if (!secretKey)
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });

    const stripe = new Stripe(secretKey, {
      apiVersion: "2024-06-20" as Stripe.LatestApiVersion,
    });

    const target = resolveTarget(slug, variant);
    const priceId = await getPriceIdFromTarget(stripe, target, slug, variant);

    const base = getBaseUrl(req);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity }],
      success_url: `${base}/checkout/success?item=${encodeURIComponent(slug)}&v=${variant}&q=${quantity}`,
      cancel_url: `${base}/checkout/cancelled?item=${encodeURIComponent(slug)}&v=${variant}`,
      metadata: { kit_slug: slug, kit_variant: variant },
    });

    if (!session.url)
      return NextResponse.json({ error: "Stripe did not return a URL" }, { status: 502 });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
