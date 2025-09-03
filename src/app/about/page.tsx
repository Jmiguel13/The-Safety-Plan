export const dynamic = "error";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About â€” The Safety Plan",
  description: "Mission-first. Designed to support those who serve and those who love them.",
};

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1>About The Safety Plan</h1>
        <p className="muted max-w-2xl">
          We build practical kits that help people feel better, focus better, and stay connected. A portion of every sale fuels veteran
          suicide prevention and crisis resources.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="panel-inset p-4">
          <div className="stat"><div className="label">Founded</div><div className="value">2025</div></div>
        </div>
        <div className="panel-inset p-4">
          <div className="stat"><div className="label">Impact Model</div><div className="value">Giveback + Kits</div></div>
        </div>
        <div className="panel-inset p-4">
          <div className="stat"><div className="label">Support</div><div className="value">24/7 Resources</div></div>
        </div>
      </section>

      <section className="space-y-3">
        <h2>Milestones</h2>
        <ol className="cv grid gap-2">
          <li className="card"><div className="text-sm">Q3 2025 â€” Storefront beta goes live with Resilient & Homefront kits.</div></li>
          <li className="card"><div className="text-sm">Q4 2025 â€” Community pilots and expanded gallery of real-world use.</div></li>
          <li className="card"><div className="text-sm">2026 â€” Broader kit lineup and deeper partnerships.</div></li>
        </ol>
      </section>
    </div>
  );
}
