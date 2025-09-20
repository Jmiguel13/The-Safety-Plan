// src/lib/env.server.ts
import "server-only";
import { z, type ZodIssue } from "zod";

/**
 * Server-only environment:
 * - Validates with Zod
 * - Exposes ENV / getEnv for server use
 * - Derives MyShop URL
 */
const EnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),

  // Supabase (public + server)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10),

  // MyShop config (either base URL or explicit final URL)
  NEXT_PUBLIC_MYSHOP_BASE: z.string().url().optional().nullable(),
  NEXT_PUBLIC_AMWAY_SHOP_ID: z.string().optional().nullable(),
  NEXT_PUBLIC_AMWAY_MYSHOP_URL: z.string().url().optional().nullable(),

  // Cart strategy (optional)
  NEXT_PUBLIC_AMWAY_CART_STRATEGY: z
    .enum(["pairs", "indexed", "items"])
    .optional()
    .nullable(),

  // UTM defaults
  NEXT_PUBLIC_UTM_SOURCE: z.string().default("safety-plan"),
  NEXT_PUBLIC_UTM_MEDIUM: z.string().default("web"),

  // Stage + UI toggles
  NEXT_PUBLIC_STAGE: z
    .enum(["production", "development", "staging", "preview", "test"])
    .optional()
    .nullable(),
  NEXT_PUBLIC_ENABLE_HELP_STRIP: z.enum(["0", "1"]).optional().nullable(),
  NEXT_STRICT_CSP: z.enum(["0", "1"]).optional().nullable(),

  // Home/marketing toggles & copy
  NEXT_PUBLIC_HAVE_HERO: z.enum(["0", "1"]).optional().nullable(),
  NEXT_PUBLIC_IMPACT_STAT: z.string().optional().nullable(),

  // Server-only (optional)
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),

  // Admin (server-only)
  ADMIN_BASIC_USER: z.string().optional(),
  ADMIN_BASIC_PASS: z.string().optional(),
  ADMIN_USER: z.string().optional(),
  ADMIN_PASS: z.string().optional(),

  // Client (public)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
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
  if (e.NEXT_PUBLIC_AMWAY_MYSHOP_URL) return e.NEXT_PUBLIC_AMWAY_MYSHOP_URL;
  if (e.NEXT_PUBLIC_MYSHOP_BASE) return e.NEXT_PUBLIC_MYSHOP_BASE;
  if (e.NEXT_PUBLIC_AMWAY_SHOP_ID)
    return `https://www.amway.com/myshop/${e.NEXT_PUBLIC_AMWAY_SHOP_ID}`;
  return null;
}

/** Server-safe full env object (do NOT expose directly to client) */
export const ENV: Env = getEnv();

/** Mask secrets for JSON responses/logging (do not expose in public APIs) */
export function maskSecret(v?: string | null): string | null {
  if (!v) return null;
  const s = String(v);
  if (s.length <= 8) return "••••";
  return `${s.slice(0, 4)}•••${s.slice(-4)}`;
}

/** Public app environment type */
export type AppEnv =
  | "production"
  | "development"
  | "staging"
  | "preview"
  | "test";

/** Uses NEXT_PUBLIC_STAGE if set, else falls back to NODE_ENV. */
export const APP_ENV: AppEnv = ((
  ENV.NEXT_PUBLIC_STAGE ?? process.env.NODE_ENV ?? "development"
) as AppEnv);

/** Resolved MyShop URL on the server */
export function getMyShopUrl(): string | null {
  return resolveMyShopUrl(ENV);
}
