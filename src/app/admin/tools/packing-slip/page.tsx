"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PackingSlipLauncher() {
  const [orderId, setOrderId] = useState("");
  const router = useRouter();

  function go(e: React.FormEvent) {
    e.preventDefault();
    if (orderId.trim()) router.push(`/admin/packing-slip/${encodeURIComponent(orderId.trim())}`);
  }

  return (
    <main className="container max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Packing Slip</h1>
      <form onSubmit={go} className="grid gap-3 rounded-xl border border-white/10 p-4">
        <label className="grid gap-1">
          <span className="text-sm">Order ID</span>
          <input
            className="rounded border bg-transparent px-3 py-2"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g., ORD-2024-0001"
          />
        </label>
        <div>
          <button className="btn">Open</button>
        </div>
      </form>
    </main>
  );
}
