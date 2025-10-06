// src/app/partners/page.tsx
export const runtime = "nodejs";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Agency & Bulk Orders",
  description:
    "Partner with The Safety Plan for bulk wellness kits for police, fire/EMS, veteran orgs, and corporate teams.",
  alternates: { canonical: "/partners" },
};

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[color:var(--border)] bg-white/5 p-4">
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="text-sm text-zinc-400">{label}</div>
    </div>
  );
}

export default function PartnersPage() {
  return (
    <section className="mx-auto w-full max-w-5xl space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl">Agency & Bulk Orders</h1>
        <p className="mt-2 text-zinc-400">
          Supply{" "}
          <strong>Resilient</strong> and <strong>Homefront</strong> kits to your
          team. Purpose-built for law enforcement, fire/EMS, veteran nonprofits,
          and frontline operations. Every order supports veteran suicide
          prevention.
        </p>
      </header>

      {/* quick highlights */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Typical lead time" value="5–10 days" />
        <Stat label="Bulk discounts" value="5%–15%" />
        <Stat label="Customization" value="Stickers & patches" />
      </div>

      {/* pricing tiers */}
      <div className="rounded-2xl border border-[color:var(--border)] bg-white/[0.03] p-5">
        <h2 className="text-xl font-semibold">Bulk Pricing (sample)</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Final quotes depend on quantities and add-ons. We’ll confirm in your
          proposal.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-[color:var(--border)] p-4">
            <div className="text-lg font-medium">Resilient Kit</div>
            <div className="text-sm text-zinc-400">
              Mission-ready essentials (focus, hydration, energy).
            </div>
            <ul className="mt-3 text-sm text-zinc-300">
              <li>• 25–49 units: ~5% off</li>
              <li>• 50–99 units: ~10% off</li>
              <li>• 100+ units: ~15% off</li>
            </ul>
          </div>
          <div className="rounded-xl border border-[color:var(--border)] p-4">
            <div className="text-lg font-medium">Homefront Kit</div>
            <div className="text-sm text-zinc-400">
              Recovery-forward set (rest, hydration, wellness).
            </div>
            <ul className="mt-3 text-sm text-zinc-300">
              <li>• 25–49 units: ~5% off</li>
              <li>• 50–99 units: ~10% off</li>
              <li>• 100+ units: ~15% off</li>
            </ul>
          </div>
        </div>
      </div>

      {/* inquiry form */}
      <div className="rounded-2xl border border-[color:var(--border)] bg-white/[0.03] p-5">
        <h2 className="text-xl font-semibold">Request a Bulk Quote</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Tell us about your organization and needs. We’ll respond with a quote
          and lead time.
        </p>

        <form
          className="mt-4 grid gap-4 md:grid-cols-2"
          action="/api/partners/lead"
          method="POST"
        >
          <div className="md:col-span-1">
            <label className="block text-sm text-zinc-300">Contact name</label>
            <input
              name="name"
              required
              className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2"
              placeholder="Full name"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm text-zinc-300">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2"
              placeholder="you@agency.gov"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm text-zinc-300">
              Organization / Department
            </label>
            <input
              name="organization"
              required
              className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2"
              placeholder="City Police Dept / VSO / Company"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm text-zinc-300">
              Phone (optional)
            </label>
            <input
              name="phone"
              className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2"
              placeholder="(###) ###-####"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm text-zinc-300">
              Interested in
            </label>
            <select
              name="interest"
              className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2"
              defaultValue="resilient"
            >
              <option value="resilient">Resilient Kits</option>
              <option value="homefront">Homefront Kits</option>
              <option value="both">Both Kits</option>
              <option value="custom">Custom mix / with patches & stickers</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm text-zinc-300">
              Estimated quantity
            </label>
            <input
              name="quantity"
              inputMode="numeric"
              className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2"
              placeholder="e.g. 25, 50, 100+"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-zinc-300">
              Notes / requirements
            </label>
            <textarea
              name="notes"
              rows={4}
              className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2"
              placeholder="Timeline, delivery location, customization (stickers/patches), etc."
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <button className="btn" type="submit">Request quote</button>
            <span className="text-sm text-zinc-400">
              By submitting, you agree to our{" "}
              <Link href="/privacy" className="underline underline-offset-4">
                Privacy Policy
              </Link>
              .
            </span>
          </div>
        </form>
      </div>

      <p className="text-sm text-zinc-500">
        Prefer email? Reach us at{" "}
        <a className="underline underline-offset-4" href="mailto:contactsafetyplan@yahoo.com">
          contactsafetyplan@yahoo.com
        </a>
        .
      </p>
    </section>
  );
}
