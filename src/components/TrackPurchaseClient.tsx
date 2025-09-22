"use client";

import { useEffect, useRef } from "react";

type Props = {
  sessionId?: string | null;
  kit?: string | null;
  amountTotal?: number | null; // cents
  currency?: string | null;
  /** Optional override; defaults to /api/track/kit */
  endpoint?: string;
};

/**
 * Fire-and-forget purchase attribution.
 * - De-dupes on mount
 * - Uses sendBeacon when available (survives nav), else fetch(keepalive)
 * - Times out quietly to avoid blocking UX
 */
export default function TrackPurchaseClient({
  sessionId,
  kit,
  amountTotal,
  currency,
  endpoint = "/api/track/kit",
}: Props) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    if (!sessionId) return;
    sent.current = true;

    const payload = {
      session_id: sessionId,
      kit: kit ?? null,
      amount_total: Number.isFinite(amountTotal ?? NaN) ? Math.round(Number(amountTotal)) : null,
      currency: currency ?? null,
      extra: {
        source: "donate/success",
        ua: typeof navigator !== "undefined" ? navigator.userAgent : null,
        ts: Date.now(),
        visibility: typeof document !== "undefined" ? document.visibilityState : null,
      },
    };

    try {
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        if (navigator.sendBeacon(endpoint, blob)) return;
      }
    } catch {
      // fall through to fetch
    }

    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);

    fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
      signal: ctrl.signal,
    })
      .catch(() => {
        /* ignore */
      })
      .finally(() => clearTimeout(t));
  }, [sessionId, kit, amountTotal, currency, endpoint]);

  return null;
}
