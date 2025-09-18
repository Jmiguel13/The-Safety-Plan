"use client";

import { useState } from "react";

export default function WaitlistForm({
  productId,
  productTitle,
}: {
  productId: string;
  productTitle?: string;
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, productId }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setMsg(data?.error || "Could not save. Try again.");
      } else {
        setMsg("You’re on the list — we’ll email when it’s ready.");
        setEmail("");
      }
    } catch {
      setMsg("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="panel p-4 space-y-3">
      <div>
        <div className="label">Waitlist</div>
        <p className="muted text-sm">
          Get notified when {productTitle ?? "this item"} is in stock.
        </p>
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-md border bg-transparent px-3 py-2 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn" disabled={busy} aria-disabled={busy}>
          {busy ? "Sending…" : "Notify me"}
        </button>
      </div>
      {msg ? <p className="text-sm">{msg}</p> : null}
    </form>
  );
}

