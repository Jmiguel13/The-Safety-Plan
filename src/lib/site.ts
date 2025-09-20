// src/lib/site.ts
import "server-only";

/**
 * Central place for site copy/config that may come from env.
 * Safe to import in server components.
 */

export type SiteConfig = {
  /** Short impact line for the homepage strip */
  IMPACT_STAT?: string | null;
  /** Crisis helpers (used in ribbons/footers) */
  CRISIS_TEL: string;
  CRISIS_SMS: string;
  CRISIS_COPY: string;
};

export function getSiteConfig(): SiteConfig {
  const IMPACT_STAT =
    process.env.NEXT_PUBLIC_IMPACT_STAT && process.env.NEXT_PUBLIC_IMPACT_STAT.trim().length > 0
      ? process.env.NEXT_PUBLIC_IMPACT_STAT.trim()
      : null;

  // You can override these with env later if desired.
  const CRISIS_TEL = "988";      // Veterans press 1
  const CRISIS_SMS = "838255";   // Text line
  const CRISIS_COPY =
    "If you or someone you know is in immediate danger, call 988 (Veterans press 1) or text 838255.";

  return { IMPACT_STAT, CRISIS_TEL, CRISIS_SMS, CRISIS_COPY };
}
