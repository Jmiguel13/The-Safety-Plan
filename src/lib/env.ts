// src/lib/env.ts
export type AppEnv = "production" | "preview" | "development";

export const ENV: AppEnv =
  (process.env.VERCEL_ENV as AppEnv) ||
  (process.env.NODE_ENV === "production" ? "production" : "development");

export const IS_PROD = ENV === "production";
export const IS_PREVIEW = ENV === "preview";
export const IS_DEV = ENV === "development";
