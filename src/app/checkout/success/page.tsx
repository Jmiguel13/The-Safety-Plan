import Link from "next/link";

export const metadata = {
  title: "Order Complete — The Safety Plan",
};

export default function CheckoutSuccess() {
  return (
    <section className="mx-auto max-w-2xl py-16 text-center space-y-6">
      <h1 className="text-3xl font-bold">Thank you for your order!</h1>
      <p className="text-zinc-400">
        Your purchase helps fund prevention and support for veterans in crisis.
      </p>
      <div className="flex justify-center gap-3">
        <Link href="/kits" className="btn">Browse More Kits</Link>
        <Link href="/shop" className="btn-ghost">Shop</Link>
        <Link href="/" className="btn-ghost">Home</Link>
      </div>
    </section>
  );
}
