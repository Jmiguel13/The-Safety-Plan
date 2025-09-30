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

/* -------------------- helpers -------------------- */

/** Keep only digits (for tel/sms hrefs) */
function digitsOnly(n?: string | null): string {
  return (n ?? "").replace(/\D/g, "");
}

/** Human-friendly US formatting (falls back to input if unknown) */
export function formatTelHuman(n: string): string {
  const d = digitsOnly(n);
  if (d.length === 11 && d.startsWith("1")) {
    return `1-${d.slice(1, 4)}-${d.slice(4, 7)}-${d.slice(7)}`;
  }
  if (d.length === 10) {
    return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  }
  return n;
}

export function telHref(n: string): string {
  const d = digitsOnly(n);
  return `tel:${d || n}`;
}

export function smsHref(n: string): string {
  const d = digitsOnly(n);
  return `sms:${d || n}`;
}

/** Optional: external MyShop URL with default UTM if missing */
export function buildMyShopUrlWithUtm(): string {
  const base =
    process.env.NEXT_PUBLIC_AMWAY_MYSHOP_URL ||
    "https://www.amway.com/myshop/TheSafetyPlan";
  const utmSource = process.env.NEXT_PUBLIC_UTM_SOURCE || "safety-plan";
  const utmMedium = process.env.NEXT_PUBLIC_UTM_MEDIUM || "web";
  try {
    const u = new URL(base);
    if (!u.searchParams.has("utm_source")) u.searchParams.set("utm_source", utmSource);
    if (!u.searchParams.has("utm_medium")) u.searchParams.set("utm_medium", utmMedium);
    return u.toString();
  } catch {
    return base;
  }
}

/* -------------------- main config -------------------- */

export function getSiteConfig(): SiteConfig {
  const IMPACT_STAT =
    process.env.NEXT_PUBLIC_IMPACT_STAT &&
    process.env.NEXT_PUBLIC_IMPACT_STAT.trim().length > 0
      ? process.env.NEXT_PUBLIC_IMPACT_STAT.trim()
      : null;

  // Allow env overrides; fall back to defaults.
  const CRISIS_TEL_ENV = digitsOnly(process.env.CRISIS_TEL);
  const CRISIS_SMS_ENV = digitsOnly(process.env.CRISIS_SMS);

  const CRISIS_TEL = CRISIS_TEL_ENV || "988";      // Veterans press 1
  const CRISIS_SMS = CRISIS_SMS_ENV || "838255";   // Text line
  const CRISIS_COPY =
    "If you or someone you know is in immediate danger, call 988 (Veterans press 1) or text 838255.";

  return { IMPACT_STAT, CRISIS_TEL, CRISIS_SMS, CRISIS_COPY };
}
