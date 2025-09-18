// app/api/admin/linkcheck/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckResult = {
  kind: "kit" | "product";
  id: string;
  key: string; // slug or SKU/title
  url: string;
  ok: boolean;
  status: number | null;
  finalUrl: string | null;
  redirects: number;
  error?: string | null;
};

type Summary = {
  ok: boolean;
  totals: { checked: number; failures: number };
  results: CheckResult[];
};

type KitRow = {
  id: string;
  slug: string | null;
  buy_url: string | null;
  is_published: boolean | null;
};

type ProductRow = {
  id: string;
  title: string | null;
  amway_sku: string | null;
  amway_url: string | null;
  is_published: boolean | null;
};

// ---- helpers ----
function hostEndsWith(host: string, suffix: string): boolean {
  const h = host.toLowerCase();
  const s = suffix.toLowerCase();
  return h === s || h.endsWith(`.${s}`);
}

async function headOrGet(url: string, init?: RequestInit): Promise<Response> {
  const base: RequestInit = {
    ...init,
    redirect: "manual",
    headers: {
      ...(init?.headers ?? {}),
      "user-agent": "safety-plan-linkcheck/1.0 (+admin)",
    },
  };
  try {
    const r = await fetch(url, { ...base, method: "HEAD" });
    if (r.status !== 405 && r.status !== 501) return r;
  } catch {
    // fall through to GET
  }
  return fetch(url, { ...base, method: "GET" });
}

async function follow(
  url: string,
  maxRedirects = 5
): Promise<{ res: Response; finalUrl: string; redirects: number }> {
  let current = url;
  let redirects = 0;
  let res = await headOrGet(current);

  while (res.status >= 300 && res.status < 400 && redirects < maxRedirects) {
    const loc = res.headers.get("location");
    if (!loc) break;
    try {
      current = new URL(loc, current).toString();
    } catch {
      break;
    }
    redirects += 1;
    res = await headOrGet(current);
  }

  return { res, finalUrl: current, redirects };
}

export async function GET(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { ok: false, error: "Missing Supabase env" },
      { status: 500 }
    );
  }

  const sb = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "safety-plan-admin" } },
  });

  const url = new URL(req.url);
  const scope = (url.searchParams.get("scope") || "all").toLowerCase() as
    | "all"
    | "kits"
    | "products";
  const onlyPublished = url.searchParams.get("published") !== "false"; // default true
  const hostHint = (url.searchParams.get("host") || "").trim(); // e.g., "amway.com"

  const results: CheckResult[] = [];

  // ---- load kits
  if (scope === "all" || scope === "kits") {
    let q = sb.from("kits").select("id, slug, buy_url, is_published");
    if (onlyPublished) q = q.eq("is_published", true);
    const { data: kits, error } = await q;

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const toCheck =
      (kits as KitRow[] | null)?.filter((k) => !!k.buy_url) ?? [];

    for (const k of toCheck) {
      const item = {
        kind: "kit" as const,
        id: k.id,
        key: (k.slug ?? k.id),
        url: k.buy_url as string,
      };
      try {
        const { res, finalUrl, redirects } = await follow(item.url);
        const ok = res.status >= 200 && res.status < 400;
        if (hostHint && ok) {
          try {
            const h = new URL(finalUrl).host;
            if (!hostEndsWith(h, hostHint)) {
              results.push({
                ...item,
                ok: false,
                status: res.status,
                finalUrl,
                redirects,
                error: `Host mismatch: ${h}`,
              });
              continue;
            }
          } catch {
            // ignore parse error, fall through
          }
        }
        results.push({
          ...item,
          ok,
          status: res.status,
          finalUrl,
          redirects,
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "fetch failed";
        results.push({
          ...item,
          ok: false,
          status: null,
          finalUrl: null,
          redirects: 0,
          error: msg,
        });
      }
    }
  }

  // ---- load products
  if (scope === "all" || scope === "products") {
    let q = sb
      .from("products")
      .select("id, title, amway_sku, amway_url, is_published");
    if (onlyPublished) q = q.eq("is_published", true);
    const { data: products, error } = await q;

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const toCheck =
      (products as ProductRow[] | null)?.filter((p) => !!p.amway_url) ?? [];

    for (const p of toCheck) {
      const item = {
        kind: "product" as const,
        id: p.id,
        key: (p.amway_sku ?? p.title ?? "untitled"),
        url: p.amway_url as string,
      };
      try {
        const { res, finalUrl, redirects } = await follow(item.url);
        const ok = res.status >= 200 && res.status < 400;
        if (hostHint && ok) {
          try {
            const h = new URL(finalUrl).host;
            if (!hostEndsWith(h, hostHint)) {
              results.push({
                ...item,
                ok: false,
                status: res.status,
                finalUrl,
                redirects,
                error: `Host mismatch: ${h}`,
              });
              continue;
            }
          } catch {
            // ignore parse error
          }
        }
        results.push({
          ...item,
          ok,
          status: res.status,
          finalUrl,
          redirects,
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "fetch failed";
        results.push({
          ...item,
          ok: false,
          status: null,
          finalUrl: null,
          redirects: 0,
          error: msg,
        });
      }
    }
  }

  const summary: Summary = {
    ok: true,
    totals: {
      checked: results.length,
      failures: results.filter((r) => !r.ok).length,
    },
    results,
  };

  return NextResponse.json(summary, { headers: { "cache-control": "no-store" } });
}

