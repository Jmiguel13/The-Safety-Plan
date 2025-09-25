// src/lib/stripe.ts
import Stripe from "stripe";

/** Singleton Stripe client using the server secret key. */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const key =
    process.env.STRIPE_SECRET_KEY ||
    process.env.STRIPE_SK ||
    process.env.STRIPE_API_KEY;

  if (!key) {
    throw new Error("Stripe secret key missing. Set STRIPE_SECRET_KEY.");
  }

  // Use package default apiVersion to match installed types.
  _stripe = new Stripe(key);
  return _stripe;
}

/**
 * Resolve the absolute site origin for building callback URLs.
 * Priority:
 * 1) NEXT_PUBLIC_SITE_URL or SITE_URL (e.g., https://thesafetyplan.org)
 * 2) Vercel-provided URL (VERCEL_URL)
 * 3) The request's origin (req.url)
 * 4) http://localhost:PORT (default 3000)
 */
export function getSiteUrl(req?: Request | { url: string } | null): string {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "";

  if (explicit) return explicit.replace(/\/$/, "");

  const vercelUrl =
    process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "";

  if (vercelUrl) {
    // Vercel preview/prod are always https
    return `https://${vercelUrl}`.replace(/\/$/, "");
  }

  if (req && typeof req.url === "string") {
    try {
      return new URL(req.url).origin.replace(/\/$/, "");
    } catch {
      // fall through
    }
  }

  const port = process.env.PORT || "3000";
  return `http://localhost:${port}`;
}
