import React from "react";
import { ENV } from "@/lib/env";
import type { AppEnv } from "@/lib/env";

type Props = {
  /** Optional override. Defaults to ENV from lib/env. */
  env?: AppEnv | string;
};

// Use a generic string-keyed map so extra keys (e.g. "staging") don't break types.
const LABELS: Record<string, string> = {
  production: "PROD",
  development: "DEV",
  staging: "STAGING",
  preview: "PREVIEW",
  test: "TEST",
};

export default function EnvRibbon({ env = ENV }: Props) {
  const current = String(env);

  // Hide the ribbon for true production
  if (current === "production" || process.env.NODE_ENV === "production") return null;

  const label = LABELS[current] ?? current.toUpperCase();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
      <span className="m-2 rounded-md border border-yellow-500/40 bg-yellow-500/10 px-3 py-1 text-xs tracking-wider text-yellow-300">
        {label} ENV
      </span>
    </div>
  );
}
