// src/lib/stripe.ts
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY ?? "";
if (!key) {
  // Don't throw here: API route will return a friendly 500
  console.warn("[stripe] STRIPE_SECRET_KEY is not set");
}

/**
 * Typings mismatch note:
 * Omit `apiVersion` and use your Stripe account’s default API version.
 */
export const stripe = new Stripe(key, {
  appInfo: { name: "The Safety Plan", version: "0.1.0" },
});
