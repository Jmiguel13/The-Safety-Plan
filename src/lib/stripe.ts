import "server-only";
import Stripe from "stripe";
import { env } from "./env";

/**
 * Server-only Stripe client (singleton in dev).
 * - Throws if imported on the client.
 * - Pulls keys from env.ts for consistency
 * - Supports optional STRIPE_API_VERSION override
 */
if (typeof window !== "undefined") {
  throw new Error("❌ Stripe SDK must not be imported on the client.");
}

declare global {
  var __stripe__: Stripe | undefined; // singleton cache
}

// API version override (must match Stripe's allowed literal union)
const API_VERSION = process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion | undefined;

/** Singleton (important in Next dev / Fast Refresh). */
export const stripe: Stripe =
  globalThis.__stripe__ ??
  new Stripe(env.STRIPE_SECRET, {
    apiVersion: API_VERSION,
    typescript: true,
  });

if (!globalThis.__stripe__) {
  globalThis.__stripe__ = stripe;
}

/** Helpers */
export function isLiveKey(): boolean {
  return env.STRIPE_SECRET.startsWith("sk_live_");
}
export function isTestKey(): boolean {
  return env.STRIPE_SECRET.startsWith("sk_test_");
}
