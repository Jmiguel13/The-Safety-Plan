// src/app/subscribe/page.tsx
import type { Metadata } from "next";
import SubscribeInline from "@/components/SubscribeInline";

export const metadata: Metadata = {
  title: "Subscribe",
  description: "Join The Safety Plan email list for mission updates, kit releases, and impact stories.",
  alternates: { canonical: "/subscribe" },
};

export default function SubscribePage() {
  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl">Join the mission</h1>
        <p className="text-zinc-400">
          Get updates on kit drops, Texas outreach, and how your support fuels prevention, outreach, and response.
        </p>
      </header>

      <div className="rounded-2xl border border-[color:var(--border)] bg-white/[0.03] p-5">
        <SubscribeInline source="subscribe_page" />
      </div>

      <p className="text-sm text-zinc-500">
        We email sparingly. Unsubscribe anytime.
      </p>
    </section>
  );
}
