// src/lib/stripe.ts
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  throw new Error("Missing STRIPE_SECRET_KEY. Add it to your .env.local");
}

export const stripe = new Stripe(key, {
  apiVersion: "2024-06-20",
});
