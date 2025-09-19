// src/app/api/checkout/donate/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import crypto from "node:crypto";

export const runtime = "nodejs";

type Body = {
  amount_cents?: unknown;   // preferred
  amount?: unknown;         // legacy fallback
  currency?: string;        // default "usd"
  success_url?: string;     // optional override (same-origin only)
  cancel_url?: string;      // optional override (same-origin only)
  customer_email?: string;  // optional
  note?: string;            // optional description
};

const MIN_CENTS = 100;      // $1.00
const MAX_CENTS = 500_000;  // $5,000.00

function siteUrlFromRequest(req: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, "");
  const u = new URL(req.url);
  return `${u.protocol}//${u.host}`;
}

function toCents(raw: unknown): number | null {
  // Accept number or numeric string (including "25.00")
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.round(raw);
  }
  if (typeof raw === "string") {
    const cleaned = raw.trim().replace(/[^\d.]/g, "");
    if (!cleaned) return null;
    const n = Number(cleaned);
    if (!Number.isFinite(n)) return null;
    return Math.round(n * 100);
  }
  return null;
}

function normalizeCurrency(input?: string): string {
  const c = (input || "usd").toLowerCase().trim();
  // Keep a simple, safe whitelist. Expand later if needed.
  return /^[a-z]{3}$/.test(c) ? c : "usd";
}

// Ensure any provided URL stays on our own origin.
function sameOriginUrlOrFallback(
  candidate: string | undefined,
  fallbackBase: string
): string {
  if (!candidate) return fallbackBase;
  try {
    const u = new URL(candidate, fallbackBase); // resolves relative paths
    const base = new URL(fallbackBase);
    return u.origin === base.origin ? u.toString().replace(/\/+$/, "") : fallbackBase;
  } catch {
    return fallbackBase;
  }
}

// Guarantee the success URL contains the {CHECKOUT_SESSION_ID} token.
function ensureSessionIdParam(url: string): string {
  if (url.includes("{CHECKOUT_SESSION_ID}")) return url;
  return `${url}${url.includes("?") ? "&" : "?"}session_id={CHECKOUT_SESSION_ID}`;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { ok: false, error: "Stripe is not configured on the server." },
        { status: 500, headers: { "Cache-Control": "no-store" } }
      );
    }

    const body = (await req.json().catch(() => ({}))) as Body;

    // Accept either `amount_cents` (preferred) or `amount` (legacy)
    const raw = body.amount_cents ?? body.amount;
    const cents = toCents(raw);

    if (!Number.isFinite(cents!) || cents! < MIN_CENTS || cents! > MAX_CENTS) {
      return NextResponse.json(
        { ok: false, error: "Amount must be between $1 and $5,000." },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const site = siteUrlFromRequest(req);
    const baseSuccess = sameOriginUrlOrFallback(body.success_url, `${site}/donate/success`);
    const baseCancel  = sameOriginUrlOrFallback(body.cancel_url,  `${site}/donate?canceled=1`);

    const successUrl = ensureSessionIdParam(baseSuccess);
    const cancelUrl  = baseCancel;

    const currency = normalizeCurrency(body.currency);

    // Reuse a caller-provided idempotency key if present, else generate one.
    // (Allows safe retries without creating multiple sessions.)
    const idempotencyKey =
      req.headers.get("idempotency-key") ||
      req.headers.get("x-idempotency-key") ||
      crypto.randomUUID();

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        submit_type: "donate",
        allow_promotion_codes: true,
        success_url: successUrl,
        cancel_url: cancelUrl,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency,
              unit_amount: cents!,
              product_data: {
                name: "Donation to The Safety Plan",
                description: body.note || undefined,
              },
            },
          },
        ],
        customer_email: body.customer_email || undefined,
        metadata: { source: "website" },
      },
      { idempotencyKey }
    );

    return NextResponse.json(
      { ok: true, url: session.url, id: session.id },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error creating checkout session.";
    return NextResponse.json(
      { ok: false, error: msg },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

// Optional: friendly response for accidental GETs
export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Use POST." },
    { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } }
  );
}
