// src/components/admin/EnvRibbon.tsx
import React from "react";

/** Optional label you can pass, otherwise we read NODE_ENV. */
type AppEnv = "development" | "production" | "staging" | "preview" | "test";

type Props = {
  /** Optional override; pass "staging", "preview", etc. */
  env?: AppEnv | string;
};

// Use a string-keyed map so unknown values degrade gracefully.
const LABELS: Record<string, string> = {
  production: "PROD",
  development: "DEV",
  staging: "STAGING",
  preview: "PREVIEW",
  test: "TEST",
};

export default function EnvRibbon({ env }: Props) {
  // Prefer an explicit prop; otherwise rely on the build-time NODE_ENV
  const current = (env ?? process.env.NODE_ENV ?? "development") as string;

  // Hide the ribbon for true production
  if (current === "production") return null;

  const label = LABELS[current] ?? current.toUpperCase();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
      <span className="m-2 rounded-md border border-yellow-500/40 bg-yellow-500/10 px-3 py-1 text-xs tracking-wider text-yellow-300">
        {label} ENV
      </span>
    </div>
  );
}
