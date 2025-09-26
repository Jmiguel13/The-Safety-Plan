import Link from "next/link";

export const metadata = {
  title: "Checkout Canceled — The Safety Plan",
};

export default function CheckoutCancel() {
  return (
    <section className="mx-auto max-w-2xl py-16 text-center space-y-6">
      <h1 className="text-3xl font-bold">Checkout canceled</h1>
      <p className="text-zinc-400">
        No worries — your cart is still here if you’d like to complete your purchase.
      </p>
      <div className="flex justify-center gap-3">
        <Link href="/shop" className="btn">Return to Shop</Link>
        <Link href="/kits" className="btn-ghost">Browse Kits</Link>
        <Link href="/" className="btn-ghost">Home</Link>
      </div>
    </section>
  );
}
