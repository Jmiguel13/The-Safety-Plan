"use client";

import { useMemo, useState } from "react";

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function WaitlistForm({
  list = "thermal-beanie",
  label = "Get notified when Thermal Beanie is in stock.",
  cta = "Notify me",
  className = "",
}: {
  list?: string;
  label?: string;
  cta?: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState<null | true | string>(null); // true or error string

  const disabled = useMemo(() => busy || !isEmail(email), [busy, email]);

  async function submit() {
    if (disabled) return;
    setBusy(true);
    setOk(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, list }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || json?.ok !== true) {
        throw new Error(json?.error || `Join failed (${res.status})`);
      }
      setOk(true);
      setEmail("");
    } catch (err: unknown) {
      setOk(err instanceof Error ? err.message : "Join failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={[
        "rounded-xl border border-white/10 bg-white/[0.03] p-4",
        className,
      ].join(" ")}
    >
      <p className="mb-2 text-sm text-zinc-300">{label}</p>

      <div className="flex items-stretch gap-2">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/40 px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={ok && ok !== true ? true : undefined}
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled}
          className="btn"
          aria-busy={busy}
        >
          {busy ? "Sending…" : cta}
        </button>
      </div>

      {/* Status */}
      {ok === true ? (
        <p className="mt-2 text-sm text-emerald-400">You’re on the list. We’ll email you when it’s back.</p>
      ) : ok ? (
        <p className="mt-2 text-sm text-red-400">{ok}</p>
      ) : null}

      {/* Fallback mailto (always visible for accessibility) */}
      <p className="mt-2 text-xs text-zinc-500">
        Trouble? Email{" "}
        <a className="underline" href="mailto:contactsafetyplan@yahoo.com?subject=Waitlist%20request&body=Please%20add%20me%20to%20the%20waitlist%20for%3A%20thermal-beanie">
          contactsafetyplan@yahoo.com
        </a>
        .
      </p>
    </div>
  );
}
