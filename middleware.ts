// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Constant-time string compare (Edge-safe)
function safeEqual(a: string, b: string) {
  const te = new TextEncoder();
  const ua = te.encode(a);
  const ub = te.encode(b);
  if (ua.length !== ub.length) return false;
  let diff = 0;
  for (let i = 0; i < ua.length; i++) diff |= ua[i] ^ ub[i];
  return diff === 0;
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Guard only admin UI + admin APIs
  const guarded = path.startsWith("/admin") || path.startsWith("/api/admin");
  if (!guarded) return NextResponse.next();

  const USER = process.env.ADMIN_USER ?? "";
  const PASS = process.env.ADMIN_PASS ?? "";
  if (!USER || !PASS) {
    // Fail closed if creds aren’t configured
    return new NextResponse("Admin auth not configured", { status: 503 });
  }

  // Expect: Authorization: Basic base64(user:pass)
  const header = req.headers.get("authorization") || "";
  if (header.toLowerCase().startsWith("basic ")) {
    const provided = header.slice(6).trim();
    // Compare token to expected in constant time (no decode needed)
    const expected = btoa(`${USER}:${PASS}`);
    if (safeEqual(provided, expected)) {
      return NextResponse.next();
    }
  }

  const res = new NextResponse("Authentication required", { status: 401 });
  res.headers.set('WWW-Authenticate', 'Basic realm="Admin", charset="UTF-8"');
  return res;
}

// Only run on these paths
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
