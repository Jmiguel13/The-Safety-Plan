// src/app/api/partners/lead/route.ts
import { NextResponse } from "next/server";

// Use your existing admin client helper if available
// (README shows: src/lib/supabaseAdmin.ts)
import { createClient } from "@supabase/supabase-js";

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

// Basic guard so the route still responds if keys aren’t set yet
const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const payload = {
      name: (form.get("name") || "").toString().slice(0, 200),
      email: (form.get("email") || "").toString().slice(0, 200),
      organization: (form.get("organization") || "").toString().slice(0, 200),
      phone: (form.get("phone") || "").toString().slice(0, 50),
      interest: (form.get("interest") || "").toString().slice(0, 50),
      quantity: (form.get("quantity") || "").toString().slice(0, 50),
      notes: (form.get("notes") || "").toString().slice(0, 4000),
      created_at: new Date().toISOString(),
      source: "partners_page",
    };

    // minimal validation
    if (!payload.name || !payload.email || !payload.organization) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (SUPABASE_READY) {
      const supabase = admin();
      const { error } = await supabase
        .from("partner_inquiries")
        .insert(payload);

      if (error) {
        console.error("[partners/lead] supabase insert error:", error);
      }
    } else {
      console.warn(
        "[partners/lead] Supabase not configured yet — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
      );
    }

    // Redirect to thank-you page for a nice UX
    const url = new URL(req.url);
    url.pathname = "/partners/thank-you";
    return NextResponse.redirect(url.toString(), { status: 303 });
  } catch (err) {
    console.error("[partners/lead] unexpected error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
