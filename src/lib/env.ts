import { z, type ZodIssue } from "zod";

/**
 * Single source of truth for environment variables.
 * - Validates at runtime with Zod.
 * - Exposes a server-safe ENV and a client-safe ENV_PUBLIC.
 * - Derives NEXT_PUBLIC_AMWAY_MYSHOP_URL for compatibility.
 */
const EnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),

  // Supabase (public + server)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10),

  // MyShop config: base OR shop id (base wins)
  NEXT_PUBLIC_MYSHOP_BASE: z.string().url().optional().nullable(),
  NEXT_PUBLIC_AMWAY_SHOP_ID: z.string().optional().nullable(),

  // Back-compat (optional): if present, we’ll trust/use it as-is
  NEXT_PUBLIC_AMWAY_MYSHOP_URL: z.string().url().optional().nullable(),

  // Cart strategy (optional)
  NEXT_PUBLIC_AMWAY_CART_STRATEGY: z
    .enum(["pairs", "indexed", "items"])
    .optional()
    .nullable(),

  // UTM defaults
  NEXT_PUBLIC_UTM_SOURCE: z.string().default("safety-plan"),
  NEXT_PUBLIC_UTM_MEDIUM: z.string().default("web"),

  // Optional public stage indicator for ribbons/badges
  NEXT_PUBLIC_STAGE: z
    .enum(["production", "development", "staging", "preview", "test"])
    .optional()
    .nullable(),

  // Server-side (optional for some features)
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),

  // Admin (server-only; keep both names for back-compat)
  ADMIN_BASIC_USER: z.string().optional(),
  ADMIN_BASIC_PASS: z.string().optional(),
  ADMIN_USER: z.string().optional(),
  ADMIN_PASS: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

let _env: Env | null = null;

/** Parse and cache env at runtime (server-only) */
export function getEnv(): Env {
  if (_env) return _env;
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const msg = parsed.error.issues
      .map((issue: ZodIssue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${msg}`);
  }
  _env = parsed.data;
  return _env;
}

/** Build a canonical MyShop URL from available inputs */
function resolveMyShopUrl(e: Env): string | null {
  // 1) If explicit URL provided, use it
  if (e.NEXT_PUBLIC_AMWAY_MYSHOP_URL) return e.NEXT_PUBLIC_AMWAY_MYSHOP_URL;

  // 2) Otherwise prefer explicit base
  if (e.NEXT_PUBLIC_MYSHOP_BASE) return e.NEXT_PUBLIC_MYSHOP_BASE;

  // 3) Otherwise derive from shop id
  if (e.NEXT_PUBLIC_AMWAY_SHOP_ID) {
    return `https://www.amway.com/myshop/${e.NEXT_PUBLIC_AMWAY_SHOP_ID}`;
  }
  return null;
}

/** Server-safe full env object (do NOT expose directly to client) */
export const ENV: Env = getEnv();

/**
 * Client-safe subset of env. Import this in client components instead of ENV.
 * NOTE: Includes derived `NEXT_PUBLIC_AMWAY_MYSHOP_URL` for convenience.
 */
export const ENV_PUBLIC = {
  NEXT_PUBLIC_SITE_URL: ENV.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: ENV.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_UTM_SOURCE: ENV.NEXT_PUBLIC_UTM_SOURCE,
  NEXT_PUBLIC_UTM_MEDIUM: ENV.NEXT_PUBLIC_UTM_MEDIUM,
  NEXT_PUBLIC_AMWAY_MYSHOP_URL: resolveMyShopUrl(ENV),
  NEXT_PUBLIC_AMWAY_CART_STRATEGY: ENV.NEXT_PUBLIC_AMWAY_CART_STRATEGY ?? "pairs",
  NEXT_PUBLIC_STAGE: ENV.NEXT_PUBLIC_STAGE ?? null,
} as const;

/** Mask secrets for JSON responses/logging */
export function maskSecret(v?: string | null): string | null {
  if (!v) return null;
  const s = String(v);
  if (s.length <= 8) return "••••";
  return `${s.slice(0, 4)}•••${s.slice(-4)}`;
}

/** Optionally export a helper to get the resolved MyShop URL on the server */
export function getMyShopUrl(): string | null {
  return resolveMyShopUrl(ENV);
}

/** Public app environment type + resolved value for ribbons, etc. */
export type AppEnv = "production" | "development" | "staging" | "preview" | "test";

/** Uses NEXT_PUBLIC_STAGE if set, else falls back to NODE_ENV. */
export const APP_ENV: AppEnv =
  ((ENV.NEXT_PUBLIC_STAGE ?? process.env.NODE_ENV ?? "development") as AppEnv);

