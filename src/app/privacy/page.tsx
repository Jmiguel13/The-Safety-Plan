// src/app/privacy/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — The Safety Plan",
  description:
    "How The Safety Plan collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  const year = new Date().getFullYear();

  return (
    <section className="space-y-8 max-w-3xl">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="muted text-sm">Effective {year}</p>
      </header>

      <div className="space-y-6">
        <section className="panel p-5 space-y-3">
          <h2 className="text-xl font-semibold">Overview</h2>
          <p className="muted">
            We collect the minimum information needed to operate our site,
            fulfill purchases via Amway, and communicate about new products or
            restocks (like our waitlist).
          </p>
        </section>

        <section className="panel p-5 space-y-3">
          <h2 className="text-xl font-semibold">What we collect</h2>
          <ul className="list-disc pl-6 space-y-1 text-sm text-zinc-400">
            <li>Email and product of interest when you join a waitlist.</li>
            <li>Basic analytics (aggregate, non-identifying).</li>
            <li>
              Order details are processed by Amway on their systems; we don’t
              receive your payment data.
            </li>
          </ul>
        </section>

        <section className="panel p-5 space-y-3">
          <h2 className="text-xl font-semibold">How we use it</h2>
          <ul className="list-disc pl-6 space-y-1 text-sm text-zinc-400">
            <li>To notify you about availability and updates.</li>
            <li>To improve site performance and product fit.</li>
            <li>To prevent abuse and secure our services.</li>
          </ul>
        </section>

        <section className="panel p-5 space-y-3">
          <h2 className="text-xl font-semibold">Data sharing</h2>
          <p className="muted">
            We don’t sell your data. We share data with service providers that
            help us run the site (e.g., hosting, analytics) under
            confidentiality terms. Purchases happen on{" "}
            <a
              href="https://www.amway.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Amway
            </a>
            ; their privacy policy applies to checkout.
          </p>
        </section>

        <section className="panel p-5 space-y-3">
          <h2 className="text-xl font-semibold">Your choices</h2>
          <ul className="list-disc pl-6 space-y-1 text-sm text-zinc-400">
            <li>Unsubscribe links are included in our emails.</li>
            <li>
              To request deletion of waitlist info, contact{" "}
              <a
                href="mailto:privacy@thesafetyplan.org"
                className="underline underline-offset-2"
              >
                privacy@thesafetyplan.org
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="panel p-5 space-y-3">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="muted">
            Questions?{" "}
            <a
              href="mailto:privacy@thesafetyplan.org"
              className="underline underline-offset-2"
            >
              Email us
            </a>{" "}
            or see our{" "}
            <Link href="/terms" className="underline underline-offset-2">
              Terms
            </Link>
            .
          </p>
        </section>
      </div>
    </section>
  );
}
