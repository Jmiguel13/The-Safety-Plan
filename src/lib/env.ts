// Centralized, typed env loader with sensible defaults.
// Throws only for server-side secrets in production; never for client vars.

type Boolish = string | number | boolean | undefined | null;

function b(v: Boolish, def = false): boolean {
  if (v === undefined || v === null || v === "") return def;
  const s = String(v).trim().toLowerCase();
  return ["1", "true", "yes", "on"].includes(s);
}

function req(name: string, v: string | undefined, opts?: { serverOnly?: boolean }) {
  const isProd = process.env.NODE_ENV === "production";
  const serverOnly = opts?.serverOnly ?? true;
  if (isProd && serverOnly && (!v || v.length === 0)) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }
  return v ?? "";
}

export const env = {
  // ---- Site ----
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  // ---- Supabase ----
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  SUPABASE_ANON: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  SUPABASE_SERVICE: req("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY),

  // ---- Amway ----
  AMWAY_MYSHOP_URL: process.env.NEXT_PUBLIC_AMWAY_MYSHOP_URL ?? "",
  AMWAY_CART_STRATEGY: (process.env.NEXT_PUBLIC_AMWAY_CART_STRATEGY ?? "pairs") as
    | "pairs"
    | "single"
    | "bundle",

  // ---- UTM defaults ----
  UTM_SOURCE: process.env.NEXT_PUBLIC_UTM_SOURCE ?? "safety-plan",
  UTM_MEDIUM: process.env.NEXT_PUBLIC_UTM_MEDIUM ?? "web",

  // ---- Stripe ----
  STRIPE_PUBLISHABLE: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  STRIPE_SECRET: req("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY),
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? "",

  // ---- Admin (server-only) ----
  ADMIN_USER: req("ADMIN_USER", process.env.ADMIN_USER),
  ADMIN_PASS: req("ADMIN_PASS", process.env.ADMIN_PASS),
  ADMIN_BASIC_USER: process.env.ADMIN_BASIC_USER ?? "",
  ADMIN_BASIC_PASS: process.env.ADMIN_BASIC_PASS ?? "",

  // ---- Flags / UX ----
  STRICT_CSP: b(process.env.NEXT_STRICT_CSP, false),
  ENABLE_HELP_STRIP: b(process.env.NEXT_PUBLIC_ENABLE_HELP_STRIP, false),
  HAVE_HERO: b(process.env.NEXT_PUBLIC_HAVE_HERO, true),
  IMPACT_STAT: process.env.NEXT_PUBLIC_IMPACT_STAT ?? "",
} as const;

// Convenience booleans for runtime
export const isProd = process.env.NODE_ENV === "production";
export const isDev = !isProd;

// Public subset for client usage (safe to expose)
export const publicEnv = {
  SITE_URL: env.SITE_URL,
  SUPABASE_URL: env.SUPABASE_URL,
  SUPABASE_ANON: env.SUPABASE_ANON,
  AMWAY_MYSHOP_URL: env.AMWAY_MYSHOP_URL,
  AMWAY_CART_STRATEGY: env.AMWAY_CART_STRATEGY,
  UTM_SOURCE: env.UTM_SOURCE,
  UTM_MEDIUM: env.UTM_MEDIUM,
  STRIPE_PUBLISHABLE: env.STRIPE_PUBLISHABLE,
  ENABLE_HELP_STRIP: env.ENABLE_HELP_STRIP,
  HAVE_HERO: env.HAVE_HERO,
  IMPACT_STAT: env.IMPACT_STAT,
} as const;

// Quick invariant you can import in server routes to fail early if misconfigured
export function assertServerConfig() {
  // Accessing properties will throw if we configured req() above for prod.
  void env.STRIPE_SECRET;
  void env.SUPABASE_SERVICE;
  void env.ADMIN_USER;
  void env.ADMIN_PASS;
}
