// src/lib/env.ts
import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10),

  // MyShop config: base OR shop id (base wins)
  NEXT_PUBLIC_MYSHOP_BASE: z.string().url().optional().nullable(),
  NEXT_PUBLIC_AMWAY_SHOP_ID: z.string().optional().nullable(),

  NEXT_PUBLIC_UTM_SOURCE: z.string().default("safety-plan"),
  NEXT_PUBLIC_UTM_MEDIUM: z.string().default("web"),

  // Server-side (optional for some features)
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),

  ADMIN_BASIC_USER: z.string().optional(),
  ADMIN_BASIC_PASS: z.string().optional(),
  ADMIN_USER: z.string().optional(),
  ADMIN_PASS: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

/** Parse and cache env at runtime (server-only) */
let _env: Env | null = null;
export function getEnv(): Env {
  if (_env) return _env;
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // In dev, throw with a helpful message; in prod you may want to log and continue.
    const msg = parsed.error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join("; ");
    throw new Error(`Invalid environment configuration: ${msg}`);
  }
  _env = parsed.data;
  return _env;
}

/** Mask secrets for JSON responses/logging */
export function maskSecret(v?: string | null): string | null {
  if (!v) return null;
  if (v.length <= 8) return "••••";
  return v.slice(0, 4) + "•••" + v.slice(-4);
}
