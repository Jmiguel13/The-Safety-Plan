// scripts/check-env.ts
// Loads env vars from a selected file (default: .env.production) and validates required keys.
// Usage:
//   pnpm run env:check
//   pnpm run env:check -- --file .env.local
//   pnpm run env:check -- --file .env.production

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { config as loadDotenv } from "dotenv";

// ---- CLI args ----
const args = new Map<string, string>();
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a === "--file" || a === "-f") {
    const v = process.argv[i + 1];
    if (v && !v.startsWith("-")) {
      args.set("file", v);
      i++;
    }
  }
}

const envFile = args.get("file") ?? ".env.production";
const envPath = path.resolve(process.cwd(), envFile);

if (!fs.existsSync(envPath)) {
  console.error(`❌ Env file not found: ${envFile}`);
  console.error(`   Pass a file with: pnpm run env:check -- --file .env.local`);
  process.exit(1);
}

// Load env
const result = loadDotenv({ path: envPath });
if (result.error) {
  console.error(`❌ Failed to parse ${envFile}:`, result.error.message);
  process.exit(1);
}
console.log(`🧩 Loaded environment from ${envFile}`);

// ---- Required keys ----
const requiredPublic = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_AMWAY_MYSHOP_URL",
  "NEXT_PUBLIC_AMWAY_CART_STRATEGY",
  "NEXT_PUBLIC_UTM_SOURCE",
  "NEXT_PUBLIC_UTM_MEDIUM",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
] as const;

const requiredServer = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  // choose whichever your code actually uses; we check all 4
  "ADMIN_USER",
  "ADMIN_PASS",
  "ADMIN_BASIC_USER",
  "ADMIN_BASIC_PASS",
] as const;

function has(name: string) {
  return process.env[name] && String(process.env[name]).trim() !== "";
}

let ok = true;

for (const key of requiredPublic) {
  if (!has(key)) {
    console.error(`❌ Missing public var: ${key}`);
    ok = false;
  }
}
for (const key of requiredServer) {
  if (!has(key)) {
    console.error(`❌ Missing server var: ${key}`);
    ok = false;
  }
}

// Security: prevent obvious secrets in public vars
for (const [k, v] of Object.entries(process.env)) {
  if (!k.startsWith("NEXT_PUBLIC_")) continue;
  const val = String(v ?? "");
  if (/sk_live_|sk_test_|whsec_|service_role|-----BEGIN/i.test(val)) {
    console.error(`🚫 SECURITY: ${k} appears to contain a secret. Move it to a server-only var.`);
    ok = false;
  }
}

if (ok) {
  console.log("✅ Env looks good.");
  if (!String(process.env.NEXT_PUBLIC_SITE_URL || "").startsWith("https://")) {
    console.warn("⚠️ NEXT_PUBLIC_SITE_URL should be an https:// production URL.");
  }
  process.exit(0);
} else {
  process.exit(1);
}
