// src/app/contact/page.tsx
import React from "react";

type SearchParams = { sent?: string; error?: string };

export default async function ContactPage({
  searchParams,
}: {
  /** Next 15: searchParams may be a Promise */
  searchParams?: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const sent = sp.sent === "1";
  const error = sp.error;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
        <p className="text-zinc-300 text-center mb-8">
          Have more questions? Reach out and our team will respond as soon as possible.
        </p>

        {sent && (
          <div
            className="mb-6 rounded-xl border border-green-700 bg-green-900/30 px-4 py-3 text-sm"
            role="status"
            aria-live="polite"
          >
            ✅ Message received. We’ll get back to you shortly.
          </div>
        )}
        {error && (
          <div
            className="mb-6 rounded-xl border border-red-700 bg-red-900/30 px-4 py-3 text-sm"
            role="alert"
            aria-live="assertive"
          >
            ❌ Something went wrong ({error}). Please try again.
          </div>
        )}

        {/* Contact Form */}
        <form
          id="form"
          action="/api/contact"
          method="POST"
          className="space-y-6 bg-zinc-900 border border-zinc-700 rounded-2xl p-8"
        >
          {/* Honeypot (hidden from humans) */}
          <input
            type="text"
            name="hp_field"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              className="w-full rounded-lg px-4 py-3 bg-zinc-950 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className="w-full rounded-lg px-4 py-3 bg-zinc-950 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message..."
              rows={5}
              className="w-full rounded-lg px-4 py-3 bg-zinc-950 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-white text-black hover:bg-zinc-200 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}
