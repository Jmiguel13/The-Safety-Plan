// src/components/SubscribeInline.tsx
"use client";

import { useState } from "react";

type Props = {
  source?: string;        // e.g. "site_footer"
  compact?: boolean;      // tighter layout for footers/sidebars
  className?: string;
};

export default function SubscribeInline({ source = "site_footer", compact, className }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | "ok" | "err">(null);
  const [msg, setMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setDone(null);
    setMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, name, source, consent: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setDone("ok");
        setMsg("You're in. Check your inbox for updates.");
        setEmail("");
        setName("");
      } else {
        setDone("err");
        setMsg(data?.error || "Something went wrong.");
      }
    } catch {
      setDone("err");
      setMsg("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={["w-full", className].filter(Boolean).join(" ")}>
      <div className={compact ? "flex gap-2" : "grid gap-3 sm:grid-cols-[1fr_1fr_auto]"}>
        {!compact && (
          <input
            aria-label="Name"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2"
          />
        )}
        <input
          aria-label="Email address"
          required
          type="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2"
        />
        <button
          type="submit"
          disabled={submitting}
          className="btn"
          aria-label="Subscribe"
        >
          {submitting ? "Subscribing…" : "Subscribe"}
        </button>
      </div>

      <p className="mt-2 text-xs text-zinc-400">
        By subscribing, you agree to receive updates from The Safety Plan.{" "}
        <a className="underline underline-offset-4" href="/privacy">Privacy</a>.
      </p>

      {done && (
        <div
          role="status"
          className={[
            "mt-2 rounded-md border px-3 py-2 text-sm",
            done === "ok" ? "border-emerald-500/50 text-emerald-300" : "border-red-500/50 text-red-300",
          ].join(" ")}
        >
          {msg}
        </div>
      )}
    </form>
  );
}
