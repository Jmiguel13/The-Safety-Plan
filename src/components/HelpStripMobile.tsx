"use client";

import { useState } from "react";

type Props = { className?: string };

/** Small mobile-only crisis strip that can be dismissed */
export default function HelpStripMobile({ className = "" }: Props) {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div
      role="region"
      aria-label="Crisis support"
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-3 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          <div className="mt-1 h-2 w-2 rounded-full bg-red-300 shrink-0" aria-hidden="true" />
          <p className="m-0">
            <strong className="tracking-wide">In crisis?</strong>{" "}
            Call{" "}
            <a href="tel:988" className="underline underline-offset-2 hover:opacity-100">
              988
            </a>{" "}
            (Veterans press 1) or text{" "}
            <a href="sms:838255" className="underline underline-offset-2 hover:opacity-100">
              838255
            </a>
            .
          </p>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setOpen(false)}
            className="ml-auto rounded-md border border-red-500/30 px-2 py-1 text-xs hover:bg-red-500/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
