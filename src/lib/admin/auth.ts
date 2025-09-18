// Basic Auth helpers for admin APIs/routes. Edge-safe.

export type BasicAuthCreds = { user: string; pass: string };

function b64decode(token: string): string {
  const g = globalThis as { atob?: (s: string) => string };
  if (typeof g.atob === "function") return g.atob(token);
  return Buffer.from(token, "base64").toString("utf8");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export function decodeBasicAuth(header?: string | null): BasicAuthCreds | null {
  if (!header) return null;
  const parts = header.trim().split(/\s+/);
  if (parts.length !== 2) return null;
  const [scheme, token] = parts;
  if (!/^Basic$/i.test(scheme) || !token) return null;
  try {
    const decoded = b64decode(token);
    const idx = decoded.indexOf(":");
    if (idx === -1) return null;
    return { user: decoded.slice(0, idx), pass: decoded.slice(idx + 1) };
  } catch {
    return null;
  }
}

export function getExpectedCreds(): BasicAuthCreds {
  return {
    user: process.env.ADMIN_BASIC_USER || process.env.ADMIN_USER || "",
    pass: process.env.ADMIN_BASIC_PASS || process.env.ADMIN_PASS || "",
  };
}

export function isAuthorized(header?: string | null): boolean {
  const got = decodeBasicAuth(header);
  const need = getExpectedCreds();
  if (!got?.user || !got?.pass || !need.user || !need.pass) return false;
  return safeEqual(got.user, need.user) && safeEqual(got.pass, need.pass);
}

export function unauthorizedHeaders(realm = "The Safety Plan Admin"): Record<string, string> {
  return { "WWW-Authenticate": `Basic realm="${realm}", charset="UTF-8"` };
}

export function unauthorizedResponse(realm = "The Safety Plan Admin"): Response {
  return new Response("Unauthorized", { status: 401, headers: unauthorizedHeaders(realm) });
}

export function isRequestAuthorized(req: import("next/server").NextRequest) {
  return isAuthorized(req.headers.get("authorization"));
}

export function requireRequestAuthorized(
  req: import("next/server").NextRequest,
  realm = "The Safety Plan Admin"
): void | never {
  if (!isRequestAuthorized(req)) throw unauthorizedResponse(realm);
}
