// src/lib/kitStripe.ts
// Map Safety Plan kit slugs -> Stripe Price IDs (1 price per full kit).
// Set these in your environment (.env.local / .env.production):
//   STRIPE_PRICE_RESILIENT=price_...
//   STRIPE_PRICE_HOMEFRONT=price_...
//
// If you later add more kits, extend this mapping.

export function getKitPriceId(slug: string): string | null {
  switch (slug) {
    case "resilient":
      return process.env.STRIPE_PRICE_RESILIENT ?? null;
    case "homefront":
      return process.env.STRIPE_PRICE_HOMEFRONT ?? null;
    default:
      return null;
  }
}
