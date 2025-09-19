// src/app/donate/cancel/page.tsx
import Link from "next/link";

export const revalidate = 0;

export default function DonateCancel() {
  return (
    <section className="mx-auto max-w-xl space-y-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Donation canceled</h1>
      <p className="muted">No charge was made. You can try again anytime.</p>
      <Link className="btn" href="/donate">Back to Donate</Link>
    </section>
  );
}
