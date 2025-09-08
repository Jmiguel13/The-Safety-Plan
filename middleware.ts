// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protect these paths with Basic Auth
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_BASIC_USER || process.env.ADMIN_USER;
  const pass = process.env.ADMIN_BASIC_PASS || process.env.ADMIN_PASS;

  // If creds aren’t configured, fail-open (dev convenience)
  if (!user || !pass) return NextResponse.next();

  const hdr = req.headers.get("authorization") || "";
  if (!hdr.startsWith("Basic ")) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="admin", charset="UTF-8"' },
    });
  }

  // Decode `Basic base64(user:pass)`
  let decoded = "";
  try {
    decoded = atob(hdr.slice(6));
  } catch {
    return new NextResponse("Invalid auth header", { status: 400 });
  }

  const idx = decoded.indexOf(":");
  const u = idx >= 0 ? decoded.slice(0, idx) : decoded;
  const p = idx >= 0 ? decoded.slice(idx + 1) : "";

  if (u === user && p === pass) return NextResponse.next();

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="admin", charset="UTF-8"' },
  });
}
