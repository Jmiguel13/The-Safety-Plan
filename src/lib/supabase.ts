// src/lib/supabase.ts

// Cache the client on globalThis (typed) so we don't recreate it on hot reloads.
type GlobalWithSupabase = typeof globalThis & {
  __supabaseClient?: unknown;
};
const g = globalThis as GlobalWithSupabase;

// Minimal shape we need from @supabase/supabase-js
type CreateClientFn = (
  url: string,
  key: string,
  opts?: Record<string, unknown>
) => unknown;
type SupabaseJsModule = { createClient: CreateClientFn };

function isSupabaseModule(x: unknown): x is SupabaseJsModule {
  return (
    typeof x === "object" &&
    x !== null &&
    typeof (x as Record<string, unknown>).createClient === "function"
  );
}

/** Returns a Supabase client on the server, or null if env is missing.
 *  - Dynamic import so your build doesn’t hard-require the package
 *  - Memoized on the process to avoid re-creating the client
 *  - Returns null on Edge runtime (supabase-js targets Node)
 *
 * If you install `@supabase/supabase-js`, you can tighten the return type:
 *   export async function getSupabaseServerClient(): Promise<
 *     import("@supabase/supabase-js").SupabaseClient | null
 *   > { ... }
 */
export async function getSupabaseServerClient(): Promise<unknown | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  // Guard against Edge runtime
  if (process.env.NEXT_RUNTIME === "edge") return null;

  // Reuse a single instance per process
  if (g.__supabaseClient) return g.__supabaseClient;

  let createClient: CreateClientFn | undefined;

  try {
    const mod: unknown = await import("@supabase/supabase-js");
    if (isSupabaseModule(mod)) {
      createClient = mod.createClient;
    }
  } catch {
    // Package not installed or failed to load
    return null;
  }

  if (!createClient) return null;

  const client = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false }, // server-safe
  });

  g.__supabaseClient = client;
  return client;
}
