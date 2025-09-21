"use client";

import { useEffect } from "react";

type Props = {
  sessionId?: string | null;
  kit?: string | null;
  amountTotal?: number | null;
  currency?: string | null;
};

export default function TrackPurchaseClient(props: Props) {
  useEffect(() => {
    // best-effort client event (optional)
    fetch("/api/track/kit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: props.sessionId,
        kit: props.kit,
        amount_total: props.amountTotal,
        currency: props.currency,
        extra: { source: "donate/success" },
      }),
    }).catch(() => {});
  }, [props.sessionId, props.kit, props.amountTotal, props.currency]);

  return null;
}
