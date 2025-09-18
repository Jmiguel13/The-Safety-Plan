// src/components/track-link.tsx
"use client";

import * as React from "react";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;                  // required: the final destination
  kitId?: string | null;         // optional: for tying to a kit
  pathFrom?: string | null;      // optional: e.g., "/"
  variant?: "solid" | "outline" | "link";
};

type TrackPayload = {
  target_url: string;
  kit_id: string | null;
  path_from: string | null;
};

function sendClick(payload: TrackPayload): void {
  try {
    const json = JSON.stringify(payload);
    const blob = new Blob([json], { type: "application/json" });
    if (navigator.sendBeacon && navigator.sendBeacon("/api/track-outbound", blob)) {
      return;
    }
  } catch {
    // fall through to fetch
  }

  // Fallback if sendBeacon unavailable or fails
  void fetch("/api/track-outbound", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

export default function TrackLinkButton({
  href,
  kitId,
  pathFrom,
  variant = "solid",
  className = "",
  children,
  ...rest
}: Props) {
  const classes =
    variant === "outline"
      ? "inline-flex items-center justify-center rounded-lg px-5 py-3 border border-zinc-700 hover:bg-zinc-900"
      : variant === "link"
      ? "inline-flex items-center underline underline-offset-4"
      : "inline-flex items-center justify-center rounded-lg px-5 py-3 bg-white text-black hover:bg-zinc-200";

  return (
    <a
      {...rest}
      href={href}
      className={`${classes} ${className}`}
      onClick={(e) => {
        // let the navigation happen normally, just fire-and-forget tracking
        const payload: TrackPayload = {
          target_url: href,
          kit_id: kitId ?? null,
          path_from:
            pathFrom ??
            (typeof window !== "undefined" ? window.location.pathname : null),
        };
        sendClick(payload);
        rest.onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}


