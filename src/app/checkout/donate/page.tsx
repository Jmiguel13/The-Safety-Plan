"use client";

import React from "react";

const PRESETS = [10, 25, 50, 100, 250];

type ApiResponse =
  | { ok: true; url: string }
  | { ok: false; error?: string };

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export default function DonatePage() {
  const [amount, setAmount] = React.useState<number | "">("");
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  function pickPreset(v: number) {
    setAmount(v);
    setMsg(null);
  }

  async function donate() {
    try {
      setBusy(true);
      setMsg(null);
      const val = typeof amount === "number" ? amount : Number(amount);
      if (!Number.isFinite(val) || val <= 0) {
        setMsg("Enter a valid amount.");
        setBusy(false);
        return;
      }

      const res = await fetch("/api/checkout/donate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: val }),
      });

      const json = (await res.json()) as ApiResponse;

      if (!res.ok || !json.ok || !("url" in json)) {
        throw new Error(("error" in json && json.error) || "Could not create checkout session.");
      }

      window.location.href = json.url;
    } catch (error: unknown) {
      setMsg(getErrorMessage(error));
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Donate</h1>
        <p className="text-zinc-400">Your support funds veteran crisis resources.</p>
      </header>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => pickPreset(p)}
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-900"
          >
            ${p}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="flex items-center gap-2">
        <span className="rounded-md border border-zinc-700 px-2 py-2">$</span>
        <input
          inputMode="decimal"
          value={amount}
          onChange={(e) => {
            const v = e.target.value.trim();
            if (v === "") setAmount("");
            else setAmount(Number(v.replace(/[^\d.]/g, "")));
          }}
          placeholder="Enter amount"
          className="flex-1 rounded-md border border-zinc-700 bg-transparent px-3 py-2 outline-none"
        />
        <button
          onClick={donate}
          disabled={busy}
          className="rounded-md bg-white/90 px-4 py-2 font-medium text-black hover:bg-white disabled:opacity-50"
        >
          {busy ? "Redirecting…" : "Donate"}
        </button>
      </div>

      {msg && <p className="text-sm text-red-400">{msg}</p>}

      <StatusNote />
    </div>
  );
}

function StatusNote() {
  const [status, setStatus] = React.useState<string | null>(null);
  React.useEffect(() => {
    const usp = new URLSearchParams(window.location.search);
    const s = usp.get("status");
    if (s) setStatus(s);
  }, []);
  if (!status) return null;
  return (
    <div
      className={`rounded-md border px-3 py-2 text-sm ${
        status === "success" ? "border-emerald-600 text-emerald-400" : "border-yellow-600 text-yellow-400"
      }`}
    >
      {status === "success" ? "Thank you for your donation!" : "Donation cancelled."}
    </div>
  );
}

