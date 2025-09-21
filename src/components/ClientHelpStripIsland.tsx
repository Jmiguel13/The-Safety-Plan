// src/components/ClientHelpStripIsland.tsx
"use client";

import * as React from "react";
import Link from "next/link";

export default function ClientHelpStripIsland(props: { enabled?: boolean }) {
  if (!props?.enabled) return null;

  return (
    <div
      role="region"
      aria-label="Quick Help"
      className="fixed bottom-3 left-0 right-0 z-40 mx-auto w-full max-w-[560px] px-3"
    >
      <div className="rounded-xl border border-white/10 bg-black/70 backdrop-blur text-white shadow-lg">
        <div className="flex items-center justify-between gap-3 p-3">
          <div className="text-sm leading-tight">
            <div className="font-medium">Need help or in crisis?</div>
            <div className="opacity-80">
              Call <a href="tel:988" className="underline">988</a> or text{" "}
              <a href="sms:988" className="underline">988</a>. Immediate support.
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href="tel:988"
              className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
            >
              Call
            </a>
            <a
              href="sms:988"
              className="rounded-lg bg-white/90 px-3 py-2 text-sm text-black hover:bg-white"
            >
              Text
            </a>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 px-3 py-2 text-xs opacity-80">
          <div>The Safety Plan</div>
          <Link href="/faq" className="underline">
            More resources
          </Link>
        </div>
      </div>
    </div>
  );
}
