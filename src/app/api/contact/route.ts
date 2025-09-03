// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // keep the service key on the server

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  company?: string; // honeypot
};

export async function POST(req: Request) {
  let body: ContactPayload = {};
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Simple honeypot: if bots fill this hidden field, ignore the submission.
  if (body.company && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = (body.email || "").trim();
  const message = (body.message || "").trim();
  const name = (body.name || "").trim();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Valid email required." }, { status: 400 });
  }
  if (!message || message.length < 3) {
    return NextResponse.json({ ok: false, error: "Message is required." }, { status: 400 });
  }

  // Server-side Supabase client (service role bypasses RLS for inserts)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const ip =
    (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || null;
  const user_agent = req.headers.get("user-agent");
  const path_from = req.headers.get("referer");

  const { error } = await supabase.from("contact_messages").insert({
    name: name ? name.slice(0, 200) : null,
    email: email.slice(0, 320),
    message: message.slice(0, 4000),
    path_from,
    ip,
    user_agent,
  });

  if (error) {
    console.error("contact_messages insert error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
