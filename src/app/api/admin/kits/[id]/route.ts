// src/app/api/admin/kits/[id]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** In Next 15, context.params may be a plain object or a Promise. */
type Params = { id: string };
type CtxLike = { params: Params | Promise<Params> } | unknown;

function hasParams(x: unknown): x is { params: Params | Promise<Params> } {
  return typeof x === "object" && x !== null && "params" in (x as Record<string, unknown>);
}
async function resolveParams(ctx: CtxLike): Promise<Params> {
  if (hasParams(ctx)) {
    const p = ctx.params;
    return p instanceof Promise ? await p : p;
  }
  // Will fail Zod validation downstream if id is empty
  return { id: "" };
}

// -------- Auth (Basic) --------
function unauthorized(message = "Unauthorized") {
  return NextResponse.json(
    { ok: false, error: message },
    { status: 401, headers: { "WWW-Authenticate": 'Basic realm="admin"' } }
  );
}
function b64decode(input: string): string {
  // Node runtime is guaranteed; Buffer is safe here.
  return Buffer.from(input, "base64").toString("utf8");
}
function requireBasicAuth(req: Request) {
  const hdr = req.headers.get("authorization") ?? "";
  if (!hdr.startsWith("Basic ")) return null;
  const decoded = b64decode(hdr.slice(6));
  const idx = decoded.indexOf(":");
  const user = idx >= 0 ? decoded.slice(0, idx) : decoded;
  const pass = idx >= 0 ? decoded.slice(idx + 1) : "";

  // Prefer ADMIN_BASIC_*; fall back to legacy names if present.
  const envUser = process.env.ADMIN_BASIC_USER ?? process.env.ADMIN_USER ?? "";
  const envPass = process.env.ADMIN_BASIC_PASS ?? process.env.ADMIN_PASS ?? "";
  return user === envUser && pass === envPass ? { user } : null;
}

// -------- Schemas --------
const KitIdSchema = z.object({ id: z.string().min(1, "Missing kit id") });

const KitRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  subtitle: z.string().nullable(),
  description: z.string().nullable(),
  buyUrl: z.string().url().nullable(),
  published: z.boolean(),
});
type KitRow = z.infer<typeof KitRowSchema>;

const KitUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  subtitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  buyUrl: z.string().url().nullable().optional(),
  published: z.boolean().optional(),
});
type KitUpdate = z.infer<typeof KitUpdateSchema>;

/** Shape returned by Supabase from the `kits` table (snake_case). */
const DbKitRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  subtitle: z.string().nullable(),
  description: z.string().nullable(),
  buy_url: z.string().nullable(),
  is_published: z.boolean(), // change if your column is named differently
});
type DbKitRow = z.infer<typeof DbKitRowSchema>;

// -------- Helpers --------
function jsonOK<T>(data: T, init?: number | ResponseInit) {
  const initObj: ResponseInit = typeof init === "number" ? { status: init } : init ?? {};
  return NextResponse.json(
    { ok: true, result: data },
    { ...initObj, headers: { "Cache-Control": "no-store", ...(initObj?.headers ?? {}) } }
  );
}
function jsonErr(message: string, status = 400) {
  return NextResponse.json(
    { ok: false, error: message },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

// -------- Supabase (Service role) --------
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase env missing: URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "safety-plan-admin" } },
  });
}

// snake_case <-> camelCase mappers
function toCamel(row: DbKitRow): KitRow {
  return {
    id: row.id,
    name: row.name,
    subtitle: row.subtitle,
    description: row.description,
    buyUrl: row.buy_url,
    published: row.is_published,
  };
}
function toSnake(patch: KitUpdate): {
  name?: string;
  subtitle?: string | null;
  description?: string | null;
  buy_url?: string | null;
  is_published?: boolean;
} {
  const out: Record<string, unknown> = {};
  if ("name" in patch) out.name = patch.name;
  if ("subtitle" in patch) out.subtitle = patch.subtitle ?? null;
  if ("description" in patch) out.description = patch.description ?? null;
  if ("buyUrl" in patch) out.buy_url = patch.buyUrl ?? null;
  if ("published" in patch) out.is_published = patch.published;
  return out as {
    name?: string;
    subtitle?: string | null;
    description?: string | null;
    buy_url?: string | null;
    is_published?: boolean;
  };
}

// -------- DB operations (Supabase) --------
async function dbGetKit(id: string): Promise<KitRow | null> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("kits")
    .select("id,name,subtitle,description,buy_url,is_published")
    .eq("id", id)
    .limit(1)
    .single();

  if (error || !data) return null;
  const parsedDb = DbKitRowSchema.parse(data);
  return KitRowSchema.parse(toCamel(parsedDb));
}

async function dbUpdateKit(id: string, patch: KitUpdate): Promise<KitRow> {
  const supabase = getAdminClient();
  const dbPatch = toSnake(patch);

  const { data, error } = await supabase
    .from("kits")
    .update(dbPatch)
    .eq("id", id)
    .select("id,name,subtitle,description,buy_url,is_published")
    .limit(1)
    .single();

  if (error || !data) throw new Error(error?.message ?? "Update failed");
  const parsedDb = DbKitRowSchema.parse(data);
  return KitRowSchema.parse(toCamel(parsedDb));
}

async function dbDeleteKit(id: string): Promise<void> {
  const supabase = getAdminClient();
  const { error } = await supabase.from("kits").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// -------- Handlers --------
export async function GET(req: Request, ctx: CtxLike) {
  if (!requireBasicAuth(req)) return unauthorized();

  const params = await resolveParams(ctx);
  const idParse = KitIdSchema.safeParse(params);
  if (!idParse.success) return jsonErr(idParse.error.message, 400);

  const row = await dbGetKit(idParse.data.id);
  if (!row) return jsonErr("Not found", 404);

  return jsonOK(row);
}

export async function PATCH(req: Request, ctx: CtxLike) {
  if (!requireBasicAuth(req)) return unauthorized();

  const params = await resolveParams(ctx);
  const idParse = KitIdSchema.safeParse(params);
  if (!idParse.success) return jsonErr(idParse.error.message, 400);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonErr("Invalid JSON", 400);
  }

  const patchParse = KitUpdateSchema.safeParse(body);
  if (!patchParse.success) return jsonErr(patchParse.error.message, 400);

  try {
    const updated = await dbUpdateKit(idParse.data.id, patchParse.data);
    return jsonOK(updated);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Update failed";
    return jsonErr(msg, 400);
  }
}

export async function DELETE(req: Request, ctx: CtxLike) {
  if (!requireBasicAuth(req)) return unauthorized();

  const params = await resolveParams(ctx);
  const idParse = KitIdSchema.safeParse(params);
  if (!idParse.success) return jsonErr(idParse.error.message, 400);

  try {
    await dbDeleteKit(idParse.data.id);
    return jsonOK({ id: idParse.data.id }, 200);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    return jsonErr(msg, 400);
  }
}

