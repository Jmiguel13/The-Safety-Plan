import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_ROOTS = ["/admin", "/api/admin"];

function needsGuard(path: string) {
  return ADMIN_ROOTS.some((p) => path === p || path.startsWith(p + "/"));
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    // first IP in the list is the client
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!needsGuard(pathname)) return NextResponse.next();

  // Dev bypass (optional)
  if (process.env.NODE_ENV !== "production" && process.env.ADMIN_AUTH_DISABLED === "1") {
    return NextResponse.next();
  }

  // Optional IP allowlist (comma separated)
  const allowlist = (process.env.ADMIN_IP_ALLOWLIST ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const clientIp = getClientIp(req);
  if (allowlist.length && clientIp && allowlist.includes(clientIp)) {
    return NextResponse.next();
  }

  // Basic auth (supports both ADMIN_* and ADMIN_BASIC_* envs)
  const user = (process.env.ADMIN_BASIC_USER ?? process.env.ADMIN_USER ?? "").trim();
  const pass = (process.env.ADMIN_BASIC_PASS ?? process.env.ADMIN_PASS ?? "").trim();

  if (!user || !pass) {
    return new NextResponse("Admin locked: missing credentials.", { status: 500 });
  }

  const header = req.headers.get("authorization") || "";
  if (!header.startsWith("Basic ")) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' },
    });
  }

  const token = header.slice("Basic ".length).trim();
  let decoded = "";
  try {
    decoded = atob(token); // Edge runtime provides atob
  } catch {
    // bad base64
  }
  const [u, p] = decoded.split(":");
  if (u === user && p === pass) return NextResponse.next();

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
