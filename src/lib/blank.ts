// src/lib/blank.ts
/**
 * Minimal BLANK integration stub for TSP.
 * Configure with NEXT_PUBLIC_BLANK_URL (public link) and BLANK_API_KEY (server).
 */
export function blankPublicUrl(): string {
  const u = process.env.NEXT_PUBLIC_BLANK_URL?.trim();
  if (!u) return "";
  try {
    return new URL(u).toString();
  } catch {
    return u;
  }
}

// Server-only example for later:
// export async function blankServerThing() {
//   const key = process.env.BLANK_API_KEY;
//   if (!key) throw new Error("BLANK_API_KEY missing");
//   // await fetch("https://api.blank.example/…", { headers: { Authorization: `Bearer ${key}` }});
// }
