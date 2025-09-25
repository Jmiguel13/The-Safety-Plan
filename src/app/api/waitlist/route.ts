// src/app/api/waitlist/route.ts
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

function isEmail(s: unknown): s is string {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export async function POST(req: Request) {
  let email = "";
  try {
    const body = await req.json().catch(() => ({}));
    email = String(body?.email ?? "").trim().toLowerCase();
  } catch {
    // ignore
  }

  if (!isEmail(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    // Don’t crash build if env is missing — return 503 at runtime instead.
    return NextResponse.json(
      { error: "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE)." },
      { status: 503 }
    );
  }

  const { error } = await supabase.from("waitlist").insert({ email });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  // simple health endpoint
  const ok = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  return NextResponse.json({ ok });
}
