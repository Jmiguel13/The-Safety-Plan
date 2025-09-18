// middleware.ts
import { NextRequest, NextResponse } from "next/server";

function unauthorized(realm = "Restricted") {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${realm}"` },
  });
}

function fromEnv(...keys: string[]) {
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = process.env[k];
    if (v && String(v).trim() !== "") out[k] = v;
  }
  return out;
}

function checkBasicAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return false;

  const b64 = auth.slice("Basic ".length).trim();
  let decoded = "";
  try {
    decoded = Buffer.from(b64, "base64").toString("utf8");
  } catch {
    return false;
  }
  const [user, pass] = decoded.split(":");

  const {
    ADMIN_USER,
    ADMIN_PASS,
    ADMIN_BASIC_USER,
    ADMIN_BASIC_PASS,
  } = fromEnv("ADMIN_USER", "ADMIN_PASS", "ADMIN_BASIC_USER", "ADMIN_BASIC_PASS");

  const pairs: Array<[string, string]> = [];
  if (ADMIN_USER && ADMIN_PASS) pairs.push([ADMIN_USER, ADMIN_PASS]);
  if (ADMIN_BASIC_USER && ADMIN_BASIC_PASS) pairs.push([ADMIN_BASIC_USER, ADMIN_BASIC_PASS]);

  // If no pairs set, deny for safety
  if (pairs.length === 0) return false;

  return pairs.some(([u, p]) => u === user && p === pass);
}

export function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url);

  // Only guard these paths
  const needsAuth =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/api/admin/");

  if (!needsAuth) return NextResponse.next();

  if (!checkBasicAuth(req)) {
    return unauthorized("The Safety Plan Admin");
  }
  return NextResponse.next();
}

// Run only on admin and admin API
export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
