"use client";
export async function track(event: string, data?: Record<string, unknown>) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data }),
      keepalive: true,
    });
  } catch { /* ignore */ }
}
