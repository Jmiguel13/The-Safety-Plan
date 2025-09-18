"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminKitsPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function runSeed() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            btoa(
              `${process.env.NEXT_PUBLIC_ADMIN_USER ?? "admin"}:${
                process.env.NEXT_PUBLIC_ADMIN_PASS ?? "supersecret"
              }`
            ),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unknown error");
      setMsg(`✅ Seeded: ${data.products.length} products, ${data.kits.length} kits`);
    } catch (err) {
      setMsg("❌ " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Admin Kits</h1>
        <p className="muted">Create, edit, and manage wellness kits.</p>
      </header>

      {/* Dev-only seed button */}
      {process.env.NODE_ENV !== "production" && (
        <div className="panel-elevated p-4 space-y-3">
          <h2 className="font-semibold">Developer Tools</h2>
          <button
            onClick={runSeed}
            disabled={loading}
            className="btn"
          >
            {loading ? "Seeding..." : "Seed sample data"}
          </button>
          {msg && <p className="text-sm">{msg}</p>}
        </div>
      )}

      <div className="panel p-4">
        <Link href="/admin/kits/new" className="btn">+ New Kit</Link>
      </div>
    </div>
  );
}

