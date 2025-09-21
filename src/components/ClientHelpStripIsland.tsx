// src/components/ClientHelpStripIsland.tsx
"use client";

import { useEffect, useState } from "react";

export default function ClientHelpStripIsland({ enabled = false }: { enabled?: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const key = "help-strip-dismissed";
    if (sessionStorage.getItem(key) === "1") return;
    setShow(true);
  }, [enabled]);

  if (!enabled || !show) return null;

  return (
    <div
      role="dialog"
      aria-label="Need help?"
      className="fixed inset-x-0 bottom-3 z-40 mx-auto w-[min(680px,92vw)] rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Questions during checkout or setup? I’m here.
        </p>
        <div className="flex items-center gap-2">
          <a
            href="/contact"
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700"
          >
            Contact
          </a>
          <button
            onClick={() => {
              sessionStorage.setItem("help-strip-dismissed", "1");
              setShow(false);
            }}
            className="rounded-md border px-2 py-1 text-sm"
            aria-label="Dismiss"
            title="Dismiss"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
