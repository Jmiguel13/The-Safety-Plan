// src/app/admin/seed/page.tsx
"use client";

import { useState } from "react";

type SeedResult = {
  ok: boolean;
  user?: string;
  kits_upserted?: number;
  products_upserted?: number;
  items_upserted?: number;
  step?: string;
  error?: string;
};

const defaultUser = process.env.NEXT_PUBLIC_ADMIN_USER || "";
const defaultPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "";

function errorToMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

export default function AdminSeedPage() {
  const [user, setUser] = useState(defaultUser);
  const [pass, setPass] = useState(defaultPass);
  const [out, setOut] = useState<string>("");

  async function runSeed() {
    setOut("Seeding...");
    try {
      // Basic auth header (ASCII-safe)
      let auth = "";
      try {
        auth = btoa(`${user}:${pass}`);
      } catch {
        // Non-ASCII fallback
        auth = btoa(unescape(encodeURIComponent(`${user}:${pass}`)));
      }

      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: { Authorization: `Basic ${auth}` },
      });

      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const json = (await res.json()) as unknown as SeedResult | Record<string, unknown>;
        setOut(JSON.stringify(json, null, 2));
      } else {
        const text = await res.text();
        setOut(text);
      }
    } catch (e: unknown) {
      setOut(`Error: ${errorToMessage(e)}`);
    }
  }

  return (
    <section className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">Admin · Seed Kits & Products</h1>
      <p className="muted text-sm">
        Uses your code-side <code>src/lib/kits.ts</code> to upsert <em>kits</em>, <em>products</em>, and{" "}
        <em>kit_items</em> into Supabase. Dev-only.
      </p>

      <div className="grid gap-2">
        <label className="text-sm" htmlFor="seed-user">Username</label>
        <input
          id="seed-user"
          className="rounded-md border border-zinc-800 bg-zinc-950 p-2"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="admin user"
          autoComplete="username"
        />
        <label className="text-sm mt-2" htmlFor="seed-pass">Password</label>
        <input
          id="seed-pass"
          className="rounded-md border border-zinc-800 bg-zinc-950 p-2"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="admin pass"
          type="password"
          autoComplete="current-password"
        />
      </div>

      <div className="flex gap-3">
        <button onClick={runSeed} className="btn">
          Run Seed
        </button>
        <button onClick={() => setOut("")} className="btn-ghost">
          Clear
        </button>
      </div>

      <pre className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs whitespace-pre-wrap break-words">
        {out || "No output yet."}
      </pre>
    </section>
  );
}

