// src/lib/env.ts
/**
 * Client-safe env shim:
 * - No `server-only`
 * - Safe to import from client components
 * - Only exposes NEXT_PUBLIC_* values
 */

export const ENV_PUBLIC = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  NEXT_PUBLIC_AMWAY_MYSHOP_URL: process.env.NEXT_PUBLIC_AMWAY_MYSHOP_URL ?? null,
  NEXT_PUBLIC_AMWAY_CART_STRATEGY: process.env.NEXT_PUBLIC_AMWAY_CART_STRATEGY ?? "pairs",
  NEXT_PUBLIC_UTM_SOURCE: process.env.NEXT_PUBLIC_UTM_SOURCE ?? "safety-plan",
  NEXT_PUBLIC_UTM_MEDIUM: process.env.NEXT_PUBLIC_UTM_MEDIUM ?? "web",
  NEXT_PUBLIC_STAGE: process.env.NEXT_PUBLIC_STAGE ?? null,
  NEXT_PUBLIC_ENABLE_HELP_STRIP: process.env.NEXT_PUBLIC_ENABLE_HELP_STRIP ?? "1",
  NEXT_STRICT_CSP: process.env.NEXT_STRICT_CSP ?? "0",
  NEXT_PUBLIC_HAVE_HERO: process.env.NEXT_PUBLIC_HAVE_HERO ?? "1",
  NEXT_PUBLIC_IMPACT_STAT: process.env.NEXT_PUBLIC_IMPACT_STAT ?? null,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
} as const;

export const envFlags = {
  helpStripEnabled(): boolean {
    return (ENV_PUBLIC.NEXT_PUBLIC_ENABLE_HELP_STRIP ?? "1") !== "0";
  },
  strictCspEnabled(): boolean {
    return (ENV_PUBLIC.NEXT_STRICT_CSP ?? "0") === "1";
  },
};

/** Resolved MyShop URL on the client (null if not configured) */
export function getMyShopUrl(): string | null {
  return ENV_PUBLIC.NEXT_PUBLIC_AMWAY_MYSHOP_URL ?? null;
}
