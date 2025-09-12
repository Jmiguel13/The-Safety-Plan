import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY ?? "";
if (!key) {
  console.warn("[stripe] STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(key, {
  appInfo: { name: "The Safety Plan", version: "0.1.0" },
});
