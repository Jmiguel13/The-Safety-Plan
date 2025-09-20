"use client";

import * as React from "react";

type Props = { enabled?: boolean };

export default function ClientHelpStripIsland({ enabled = false }: Props) {
  if (!enabled) return null; // render nothing when disabled

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white/10 backdrop-blur-md md:hidden">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-white/90">Need help choosing a kit?</span>
          <a href="/faq" className="btn px-3 py-1 text-sm">
            Get help
          </a>
        </div>
      </div>
    </div>
  );
}
