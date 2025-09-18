// app/api/admin/myshop/verify/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

type CheckResult = {
  inputUrl: string;
  ok: boolean;
  status: number | null;
  finalUrl: string | null;
  redirects: number;
  error?: string | null;
};

type VerifyPayload = {
  ok: boolean;
  totals: { checked: number; failures: number };
  results: CheckResult[];
};

// ---------- Auth (Basic) ----------
function unauthorized(message = "Unauthorized") {
  return NextResponse.json(
    { ok: false, error: message },
    { status: 401, headers: { "WWW-Authenticate": 'Basic realm="admin"' } }
  );
}

function b64decode(input: string): string {
  if (typeof globalThis.atob === "function") {
    return globalThis.atob(input);
  }
  return Buffer.from(input, "base64").toString("utf8");
}

function requireBasicAuth(req: Request) {
  const hdr = req.headers.get("authorization") ?? "";
  if (!hdr.startsWith("Basic ")) return null;
  const decoded = b64decode(hdr.slice(6));
  const idx = decoded.indexOf(":");
  const user = idx >= 0 ? decoded.slice(0, idx) : decoded;
  const pass = idx >= 0 ? decoded.slice(idx + 1) : "";

  const envUser = process.env.ADMIN_USER ?? "";
  const envPass = process.env.ADMIN_PASS ?? "";

  return user === envUser && pass === envPass ? { user } : null;
}

// ---------- Validation ----------
const BodySchema = z.object({
  urls: z.array(z.string().url({ message: "urls must be valid URL strings" })).min(1, "urls required"),
  host: z.string().trim().min(1).optional(),
  timeoutMs: z.number().int().positive().max(30000).optional(),
  maxRedirects: z.number().int().positive().max(20).optional(),
});

// ---------- Helpers ----------
function jsonErr(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function endsWithHost(final: URL, suffix: string): boolean {
  const h = final.hostname.toLowerCase();
  const s = suffix.toLowerCase();
  return h === s || h.endsWith(`.${s}`);
}

async function headOrGet(url: string, signal: AbortSignal) {
  const commonInit: RequestInit = {
    redirect: "manual",
    signal,
    headers: { "user-agent": "safety-plan-linkcheck/1.0 (+admin)" },
  };
  const head = await fetch(url, { ...commonInit, method: "HEAD" });
  if (head.status === 405 || head.status === 501) {
    return fetch(url, { ...commonInit, method: "GET" });
  }
  return head;
}

async function checkSingle(
  inputUrl: string,
  opts: { host?: string; timeoutMs: number; maxRedirects: number }
): Promise<CheckResult> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), opts.timeoutMs);
  let redirects = 0;
  let current = inputUrl;
  let lastStatus: number | null = null;
  let finalUrl: string | null = null;

  try {
    while (true) {
      const res = await headOrGet(current, controller.signal);
      lastStatus = res.status;

      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        if (!location) break;
        redirects += 1;
        if (redirects > opts.maxRedirects) {
          return {
            inputUrl,
            ok: false,
            status: lastStatus,
            finalUrl: current,
            redirects,
            error: "Too many redirects",
          };
        }
        const next = new URL(location, current).toString();
        current = next;
        continue;
      }

      finalUrl = res.url || current;
      break;
    }

    const final = finalUrl ? new URL(finalUrl) : new URL(current);
    const okStatus = typeof lastStatus === "number" && lastStatus >= 200 && lastStatus < 300;
    const hostOk = opts.host ? endsWithHost(final, opts.host) : true;
    const ok = Boolean(okStatus && hostOk);

    return {
      inputUrl,
      ok,
      status: lastStatus,
      finalUrl: final.toString(),
      redirects,
      error: ok ? undefined : hostOk ? undefined : `Final host ${final.hostname} does not end with ${opts.host}`,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return {
      inputUrl,
      ok: false,
      status: lastStatus,
      finalUrl,
      redirects,
      error: msg,
    };
  } finally {
    clearTimeout(t);
  }
}

// ---------- Handler ----------
export async function POST(req: Request) {
  if (!requireBasicAuth(req)) return unauthorized();

  let bodyUnknown: unknown;
  try {
    bodyUnknown = await req.json();
  } catch {
    return jsonErr("Invalid JSON", 400);
  }

  const parsed = BodySchema.safeParse(bodyUnknown);
  if (!parsed.success) {
    return jsonErr(parsed.error.message, 400);
  }

  const { urls, host, timeoutMs = 10_000, maxRedirects = 10 } = parsed.data;

  const checks = await Promise.all(
    urls.map((u) => checkSingle(u, { host, timeoutMs, maxRedirects }))
  );

  const failures = checks.filter((c) => !c.ok).length;

  const payload: VerifyPayload = {
    ok: failures === 0,
    totals: { checked: checks.length, failures },
    results: checks,
  };

  return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
}

