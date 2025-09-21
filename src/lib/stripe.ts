// src/lib/stripe.ts
import "server-only";
import Stripe from "stripe";

/**
 * Server-only Stripe client.
 * - Throws if used on the client.
 * - Pins apiVersion to Stripe's literal type to satisfy TS.
 */
if (typeof window !== "undefined") {
  throw new Error("Stripe SDK must not be imported on the client.");
}

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY in environment");
}

type SupportedApiVersion = "2025-08-27.basil";
const API_VERSION: SupportedApiVersion =
  (process.env.STRIPE_API_VERSION as SupportedApiVersion) ?? "2025-08-27.basil";

export const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: API_VERSION });

// Helpers
export function isLiveKey(): boolean {
  return STRIPE_SECRET_KEY?.startsWith("sk_live_") ?? false;
}
export function isTestKey(): boolean {
  return STRIPE_SECRET_KEY?.startsWith("sk_test_") ?? false;
}
