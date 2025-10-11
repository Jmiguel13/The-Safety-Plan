import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, getCheckoutRedirects } from "@/lib/stripe";

export const runtime = "nodejs";

type Variant = "daily" | "10day" | "30day";

type CheckoutBody = {
  slug?: string;
  variant?: Variant;
  quantity?: number;
  options?: {
    energyFlavorSku?: string;
    proteinSku?: string;
    includeMensPack?: boolean;
    energyCans?: number; // hint for parity with kit page messaging
  };
};

function env(key: string): string | undefined {
  return process.env[key];
}

/** Resolve either a priceId OR productId from env keys. */
function resolveTarget(slug: string, variant: Variant): { priceId?: string; productId?: string } {
  const U = slug.toUpperCase();
  const V = variant.toUpperCase().replace("-", "");

  const priceVar = env(`STRIPE_PRICE_${U}_${V}`);
  const prodVar = env(`STRIPE_PRODUCT_${U}_${V}`);
  if (priceVar) return { priceId: priceVar };
  if (prodVar) return { productId: prodVar };

  const priceKitAfter = env(`STRIPE_PRICE_KIT_${U}`);
  const prodKitAfter = env(`STRIPE_PRODUCT_KIT_${U}`);
  if (priceKitAfter) return { priceId: priceKitAfter };
  if (prodKitAfter) return { productId: prodKitAfter };

  const priceKitBefore = env(`STRIPE_PRICE_${U}_KIT`);
  const prodKitBefore = env(`STRIPE_PRODUCT_${U}_KIT`);
  if (priceKitBefore) return { priceId: priceKitBefore };
  if (prodKitBefore) return { productId: prodKitBefore };

  const priceGeneric = env(`STRIPE_PRICE_${U}`);
  const prodGeneric = env(`STRIPE_PRODUCT_${U}`);
  if (priceGeneric) return { priceId: priceGeneric };
  if (prodGeneric) return { productId: prodGeneric };

  return {};
}

function lc(s?: string | null) {
  return (s || "").toLowerCase();
}
function variantNeedles(v: Variant): string[] {
  if (v === "10day") return ["10day", "10-day", "10 day"];
  if (v === "30day") return ["30day", "30-day", "30 day"];
  return ["daily", "1-day", "1 day"];
}
function hasAny(haystack: string, needles: string[]) {
  return needles.some((n) => haystack.includes(n));
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

async function choosePriceForVariant(stripe: Stripe, productId: string, variant: Variant): Promise<string> {
  const pricesResp = await stripe.prices.list({ product: productId, active: true, limit: 100 });
  const prices = pricesResp.data;
  if (prices.length === 0) throw new Error(`Product ${productId} has no active prices`);

  const metaMatches = prices.filter((p) => lc(metaVariant(p)) === variant);
  if (metaMatches.length === 1) return metaMatches[0].id;
  if (metaMatches.length > 1) return metaMatches.sort((a, b) => (a.created ?? 0) - (b.created ?? 0)).at(-1)!.id;

  const needles = variantNeedles(variant);
  const textMatches = prices.filter((p) => hasAny(textBagForPrice(p), needles));
  if (textMatches.length === 1) return textMatches[0].id;
  if (textMatches.length > 1)
    return textMatches.sort(
      (a, b) =>
        (lc(a.nickname).length - lc(b.nickname).length) ||
        ((a.created ?? 0) - (b.created ?? 0))
    ).at(-1)!.id;

  throw new Error(
    `No explicit ${variant} price found on product ${productId}. ` +
      `Add metadata.variant="${variant}" OR nickname/lookup_key containing "${variant}".`
  );
}

async function getPriceIdFromTarget(
  stripe: Stripe,
  target: { priceId?: string; productId?: string },
  slug: string,
  variant: Variant
): Promise<string> {
  if (target.priceId) {
    if (!target.priceId.startsWith("price_")) {
      throw new Error(`Configured value for ${slug} (${variant}) is not a Stripe price id: ${target.priceId}`);
    }
    return target.priceId;
  }
  if (target.productId) {
    if (!target.productId.startsWith("prod_")) {
      throw new Error(`Configured value for ${slug} (${variant}) is not a Stripe product id: ${target.productId}`);
    }
    return choosePriceForVariant(stripe, target.productId, variant);
  }
  throw new Error(
    `No Stripe price configured for ${slug} (${variant}). ` +
      `Add STRIPE_PRICE_${slug.toUpperCase()}_${variant.toUpperCase().replace("-", "")} ` +
      `or STRIPE_PRODUCT_${slug.toUpperCase()}_${variant.toUpperCase().replace("-", "")}.`
  );
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutBody;
    const slug = String(body.slug ?? "").trim().toLowerCase();
    const variant: Variant = (body.variant ?? "10day") as Variant;
    const quantity = Number.isFinite(body.quantity)
      ? Math.max(1, Math.min(10, Number(body.quantity)))
      : 1;

    if (!slug) return NextResponse.json({ error: "Missing `slug`" }, { status: 400 });

    const stripe = getStripe();

    const target = resolveTarget(slug, variant);
    const priceId = await getPriceIdFromTarget(stripe, target, slug, variant);

    const { success_url, cancel_url } = getCheckoutRedirects(req);

    // carry option selections to the back office via metadata
    const md = {
      kit_slug: slug,
      kit_variant: variant,
      opt_energy_sku: body.options?.energyFlavorSku ?? "",
      opt_protein_sku: body.options?.proteinSku ?? "",
      opt_include_mens_pack: body.options?.includeMensPack ? "1" : "0",
      opt_energy_cans: body.options?.energyCans != null ? String(body.options.energyCans) : "",
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity }],
      success_url,
      cancel_url,
      metadata: md,
    });

    if (!session.url) return NextResponse.json({ error: "Stripe did not return a URL" }, { status: 502 });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
