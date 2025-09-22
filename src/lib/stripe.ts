// src/lib/stripe.ts
import Stripe from "stripe";

export const runtime = "nodejs";

function required(name: string, v?: string): string {
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

export function getStripe(): Stripe {
  const key = required("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY);
  return new Stripe(key, {
    apiVersion: "2024-06-20" as Stripe.LatestApiVersion,
  });
}

export function getSiteUrl(): string {
  const vercelUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;

  const base =
    process.env.NEXT_PUBLIC_SITE_URL || vercelUrl || "http://localhost:3000";

  try {
    return new URL(base).toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}
