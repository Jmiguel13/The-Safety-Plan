// src/lib/stripe.ts
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY ?? "";
if (!key) {
  // Don't throw here: API route will return a friendly 500
  console.warn("[stripe] STRIPE_SECRET_KEY is not set");
}

/**
 * Fix for TS error:
 *   Type '"2024-06-20"' is not assignable to type '"2025-08-27.basil"'
 * Your installed `stripe` typings expect a different exact API version string.
 * The simplest, safest approach is to omit `apiVersion` and use your
 * Stripe account’s default API version (recommended by Stripe).
 */
export const stripe = new Stripe(key, {
  appInfo: { name: "The Safety Plan", version: "0.1.0" },
});
