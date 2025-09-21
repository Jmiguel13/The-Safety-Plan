import Link from "next/link";
import { stripe } from "@/lib/stripe";
import TrackPurchaseClient from "@/components/TrackPurchaseClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Next 15 expects searchParams as a Promise in RSC.
// Canonical shape: record of string -> string|string[]|undefined
type SP = Record<string, string | string[] | undefined>;

export default async function DonateSuccessPage({
  searchParams,
}: {
  searchParams?: Promise<SP>;
}) {
  // Always await the promise shape (or fall back to an empty object)
  const sp = (await (searchParams ?? Promise.resolve({}))) as SP;

  const session_id =
    typeof sp.session_id === "string"
      ? sp.session_id
      : Array.isArray(sp.session_id)
      ? sp.session_id[0] ?? ""
      : "";

  const kit =
    typeof sp.kit === "string"
      ? sp.kit
      : Array.isArray(sp.kit)
      ? sp.kit[0] ?? ""
      : "";

  let amount_total: number | null = null;
  let currency: string | null = null;
  let email: string | null = null;
  let isDonation = !kit;

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["customer", "payment_intent"],
      });
      amount_total = session.amount_total ?? null;
      currency = session.currency ?? null;
      email = session.customer_details?.email ?? null;

      if (session.metadata?.tsp_kit_slug || session.client_reference_id?.startsWith("kit:")) {
        isDonation = false;
      }
    } catch {
      // Non-blocking: still render the success UI
    }
  }

  const title = isDonation ? "Thank you for your donation" : "Thank you for your purchase";
  const mission =
    "On average, 22 veterans die by suicide every 24 hours in the U.S. Your support helps us fight that number.";

  return (
    <section className="mx-auto max-w-2xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
        <p className="text-zinc-300">
          Your order was received{kit ? ` for the ${kit} kit` : ""}. A confirmation has been sent
          {email ? ` to ${email}` : ""}.
        </p>
        <p className="text-sm text-zinc-400">{mission}</p>
      </header>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-zinc-400">Order</dt>
            <dd className="font-medium break-all">{session_id || "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-400">Amount</dt>
            <dd className="font-medium">
              {amount_total != null && currency
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: currency.toUpperCase(),
                  }).format(amount_total / 100)
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-400">Kit</dt>
            <dd className="font-medium">{kit || (isDonation ? "Donation" : "—")}</dd>
          </div>
          <div>
            <dt className="text-zinc-400">Status</dt>
            <dd className="font-medium">Completed</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/kits" className="btn">
          Browse more kits
        </Link>
        <Link href="/donate" className="btn-ghost">
          Make another donation
        </Link>
      </div>

      <p className="text-xs text-zinc-500">
        If you have questions, reply to your receipt email and we&apos;ll get right back to you.
      </p>

      {/* Client attribution ping */}
      <TrackPurchaseClient
        sessionId={session_id || null}
        kit={kit || null}
        amountTotal={amount_total}
        currency={currency}
      />
    </section>
  );
}
