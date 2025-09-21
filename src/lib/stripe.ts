// src/lib/stripe.ts
import "server-only";
import Stripe from "stripe";

/**
 * Server-only Stripe client (singleton in dev).
 * - Throws if imported on the client.
 * - Accepts STRIPE_API_VERSION from env and passes it through with Stripe's own type.
 * - Helpers: isLiveKey / isTestKey
 */
if (typeof window !== "undefined") {
  throw new Error("Stripe SDK must not be imported on the client.");
}

// Validate env and coerce to string for TS
const maybeSecret = process.env.STRIPE_SECRET_KEY;
if (!maybeSecret) {
  // Fail fast so we don't get confusing 401s later
  throw new Error("Missing STRIPE_SECRET_KEY in environment");
}
const SECRET: string = maybeSecret;

/** Optional API version override (must match Stripe's allowed literal union). */
const API_VERSION = process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion | undefined;

declare global {
  var __stripe__: Stripe | undefined;
}

/** Singleton (important in Next dev / Fast Refresh). */
export const stripe: Stripe =
  globalThis.__stripe__ ??
  new Stripe(SECRET, {
    apiVersion: API_VERSION,
  });

if (!globalThis.__stripe__) {
  globalThis.__stripe__ = stripe;
}

/** Helpers */
export function isLiveKey(): boolean {
  return SECRET.startsWith("sk_live_");
}
export function isTestKey(): boolean {
  return SECRET.startsWith("sk_test_");
}
