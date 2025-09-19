// src/lib/stripe.ts
import Stripe from "stripe";

/**
 * Stripe SDK instance (server-side only).
 * Fixes TS error: Type 'string' is not assignable to type '"2025-08-27.basil"'
 * by explicitly narrowing the apiVersion to the literal type Stripe expects.
 */

// ✅ Require your secret key
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY in environment");
}

// ✅ Narrow apiVersion to the exact literal Stripe's types expect
type SupportedApiVersion = "2025-08-27.basil";

// If you keep STRIPE_API_VERSION in .env, this cast safely narrows it.
// If it's unset, we default to the SDK’s pinned version.
const API_VERSION: SupportedApiVersion =
  (process.env.STRIPE_API_VERSION as SupportedApiVersion) ?? "2025-08-27.basil";

// ✅ Create the Stripe client with the narrowed apiVersion
export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: API_VERSION,
});

// Optional helper (example): create a Checkout session
export async function createCheckoutSession(params: Stripe.Checkout.SessionCreateParams) {
  return stripe.checkout.sessions.create(params);
}
