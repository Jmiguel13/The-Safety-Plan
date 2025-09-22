// src/app/api/checkout/donate/route.ts
// Accepts either { amount_cents: number } OR { amount: number } (USD dollars).
// Always returns JSON: { ok: boolean, url?: string, error?: string }

import { NextRequest } from "next/server";
import { getStripe, getSiteUrl } from "@/lib/stripe";

export const runtime = "nodejs";

type UnknownRecord = Record<string, unknown>;

const CENT_KEYS_INT = ["amount_cents", "cents"];
const DOLLAR_KEYS_NUM = ["amount", "usd", "value", "donation", "total", "amountUSD", "dollars"];

function asInt(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isInteger(v) && v > 0) return v;
  if (typeof v === "string") {
    const n = Number.parseInt(v.replace(/[^\d]/g, ""), 10);
    if (Number.isInteger(n) && n > 0) return n;
  }
  return undefined;
}
function asFloat(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v) && v > 0) return v;
  if (typeof v === "string") {
    const s = v.replace(/[^\d.]/g, "");
    if (!s) return undefined;
    const n = Number.parseFloat(s);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return undefined;
}
function fromObjectKeysInt(obj: UnknownRecord | null, keys: string[]): number | undefined {
  if (!obj) return undefined;
  for (const k of keys) {
    const n = asInt(obj[k]);
    if (n !== undefined) return n;
  }
  return undefined;
}
function fromObjectKeysFloat(obj: UnknownRecord | null, keys: string[]): number | undefined {
  if (!obj) return undefined;
  for (const k of keys) {
    const n = asFloat(obj[k]);
    if (n !== undefined) return n;
  }
  return undefined;
}
function fromFormKeysInt(fd: FormData | null, keys: string[]): number | undefined {
  if (!fd) return undefined;
  for (const k of keys) {
    const n = asInt(fd.get(k) ?? undefined);
    if (n !== undefined) return n;
  }
  return undefined;
}
function fromFormKeysFloat(fd: FormData | null, keys: string[]): number | undefined {
  if (!fd) return undefined;
  for (const k of keys) {
    const n = asFloat(fd.get(k) ?? undefined);
    if (n !== undefined) return n;
  }
  return undefined;
}
function fromQueryInt(url: URL, keys: string[]): number | undefined {
  for (const k of keys) {
    const n = asInt(url.searchParams.get(k));
    if (n !== undefined) return n;
  }
  return undefined;
}
function fromQueryFloat(url: URL, keys: string[]): number | undefined {
  for (const k of keys) {
    const n = asFloat(url.searchParams.get(k));
    if (n !== undefined) return n;
  }
  return undefined;
}

async function readBodies(req: NextRequest): Promise<{
  jsonBody: UnknownRecord | null;
  formBody: FormData | null;
}> {
  const ct = req.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    const jsonBody = (await req.json().catch(() => null)) as UnknownRecord | null;
    return { jsonBody, formBody: null };
  }
  if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
    const formBody = await req.formData().catch(() => null);
    return { jsonBody: null, formBody };
  }
  // Unknown: try JSON once, otherwise FormData
  const jsonTry = (await req.json().catch(() => null)) as UnknownRecord | null;
  if (jsonTry) return { jsonBody: jsonTry, formBody: null };
  const formTry = await req.formData().catch(() => null);
  return { jsonBody: null, formBody: formTry };
}

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const { jsonBody, formBody } = await readBodies(req);

    // 1) Prefer cents if provided
    const centsExplicit =
      fromObjectKeysInt(jsonBody, CENT_KEYS_INT) ??
      fromFormKeysInt(formBody, CENT_KEYS_INT) ??
      fromQueryInt(url, CENT_KEYS_INT);

    // 2) Otherwise interpret dollars and convert to cents
    const dollarsExplicit =
      fromObjectKeysFloat(jsonBody, DOLLAR_KEYS_NUM) ??
      fromFormKeysFloat(formBody, DOLLAR_KEYS_NUM) ??
      fromQueryFloat(url, DOLLAR_KEYS_NUM);

    const unitAmount =
      centsExplicit ??
      (dollarsExplicit !== undefined ? Math.round(dollarsExplicit * 100) : undefined);

    if (unitAmount === undefined || unitAmount <= 0) {
      return Response.json(
        { ok: false, error: "Invalid amount; supply amount_cents or amount (USD)." },
        { status: 400 }
      );
    }

    // Optional guardrails to match your client-side limits
    if (unitAmount < 100) {
      return Response.json({ ok: false, error: "Minimum donation is $1.00." }, { status: 400 });
    }
    if (unitAmount > 500_000) {
      return Response.json(
        { ok: false, error: "Maximum donation for this form is $5,000.00." },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const site = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      allow_promotion_codes: true,
      billing_address_collection: "required",
      success_url: `${site}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/donate?canceled=1`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: unitAmount, // already in cents
            product_data: {
              name: "Donation to The Safety Plan",
              description:
                "Your donation funds resources for veterans and first responders in crisis.",
            },
          },
          quantity: 1,
        },
      ],
      metadata: { source: "donate_checkout" },
    });

    return Response.json({ ok: true, url: session.url }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Donate session error";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Quick test: /api/checkout/donate?amount_cents=2500 or ?amount=25
  try {
    const url = new URL(req.url);

    const unitAmount =
      fromQueryInt(url, CENT_KEYS_INT) ??
      ((): number | undefined => {
        const d = fromQueryFloat(url, DOLLAR_KEYS_NUM);
        return d !== undefined ? Math.round(d * 100) : undefined;
      })();

    if (unitAmount === undefined || unitAmount <= 0) {
      return Response.json({ ok: true, hint: "Pass ?amount_cents=2500 or ?amount=25" });
    }

    const stripe = getStripe();
    const site = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      success_url: `${site}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/donate?canceled=1`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: unitAmount,
            product_data: { name: "Donation to The Safety Plan" },
          },
          quantity: 1,
        },
      ],
      metadata: { source: "donate_checkout_get" },
    });

    return Response.json({ ok: true, url: session.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "error";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
