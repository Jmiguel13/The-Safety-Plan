import Link from "next/link";

export default function DonateCancel() {
  return (
    <section className="max-w-xl space-y-4">
      <h1 className="text-3xl font-bold">Donation canceled</h1>
      <p className="muted">No charge was made. You can try again anytime.</p>
      <Link className="btn" href="/donate">Back to Donate</Link>
    </section>
  );
}
