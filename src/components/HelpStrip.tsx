// src/components/HelpStrip.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  className?: string;
  /** LocalStorage key (change if you want different audiences) */
  storageKey?: string;
  /** Days to keep it hidden after the user closes it */
  hideForDays?: number;
  /** Crisis numbers (override if needed) */
  telNumber?: string;         // default: 988
  telNote?: string;           // default: "Veterans press 1"
  smsNumber?: string;         // default: 838255 (Veterans Crisis Line)
};

const DEFAULT_KEY = "tsp_helpstrip_closed_until";
const DEFAULT_DAYS = 7;

export default function HelpStrip({
  className = "",
  storageKey = DEFAULT_KEY,
  hideForDays = DEFAULT_DAYS,
  telNumber = "988",
  telNote = "Veterans press 1",
  smsNumber = "838255",
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const regionRef = useRef<HTMLDivElement | null>(null);

  // Decide whether to show once we’re on the client
  useEffect(() => {
    setMounted(true);
    try {
      const until = localStorage.getItem(storageKey);
      if (!until || Date.now() > Number(until)) setOpen(true);
    } catch {
      setOpen(true); // storage blocked? still show
    }
  }, [storageKey]);

  // Close + persist for N days
  const close = useCallback(() => {
    setOpen(false);
    try {
      const ms = Math.max(0, hideForDays) * 24 * 60 * 60 * 1000;
      localStorage.setItem(storageKey, String(Date.now() + ms));
    } catch {
      /* best-effort only */
    }
  }, [storageKey, hideForDays]);

  // ESC to dismiss (only while visible)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!mounted || !open) return null;

  const classes = [
    "md:hidden fixed inset-x-0 bottom-0 z-40 px-3 pb-3",
    prefersReducedMotion ? "" : "animate-in fade-in slide-in-from-bottom-2 duration-200",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role="region"
      aria-label="Crisis support"
      aria-live="polite"
      ref={regionRef}
      className={classes}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100 shadow-lg backdrop-blur">
          <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-300" aria-hidden="true" />
          <p id="helpstrip-msg" className="m-0 leading-snug">
            <strong className="tracking-wide">In crisis?</strong>{" "}
            Call{" "}
            <a
              href={`tel:${telNumber}`}
              className="underline underline-offset-2 hover:opacity-100 focus:outline-none focus-visible:ring"
            >
              {telNumber}
            </a>{" "}
            <span className="opacity-90">({telNote})</span> or text{" "}
            <a
              href={`sms:${smsNumber}`}
              className="underline underline-offset-2 hover:opacity-100 focus:outline-none focus-visible:ring"
            >
              {smsNumber}
            </a>
            .
          </p>

          <button
            type="button"
            aria-label="Dismiss crisis support message"
            aria-describedby="helpstrip-msg"
            onClick={close}
            className="ml-auto rounded-md border border-red-500/30 px-2 py-1 text-xs hover:bg-red-500/20 focus:outline-none focus-visible:ring"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/** Hook: prefers-reduced-motion (SSR-safe with legacy Safari fallback) */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(!!mq.matches);
    update();

    if ("addEventListener" in mq) {
      // Modern browsers
      mq.addEventListener("change", update as EventListener);
      return () => mq.removeEventListener("change", update as EventListener);
    } else if ("addListener" in mq) {
      // Legacy Safari
      (mq as unknown as { addListener: (fn: () => void) => void }).addListener(update);
      return () =>
        (mq as unknown as { removeListener: (fn: () => void) => void }).removeListener(update);
    }
  }, []);

  return reduced;
}
