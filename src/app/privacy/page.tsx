// src/app/privacy/page.tsx
export const metadata = {
  title: "Privacy Policy",
  description:
    "How The Safety Plan collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <section className="prose prose-invert max-w-3xl">
      <h1>Privacy Policy</h1>

      <p className="lead">
        We respect your privacy. This page explains what we collect and how we
        use it.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Contact info</strong> you submit (e.g., email for waitlists or
          donations).
        </li>
        <li>
          <strong>Basic analytics</strong> (aggregate usage, pages visited).
        </li>
        <li>
          <strong>Purchase links</strong> to Amway MyShop (we don’t see your
          payment info there).
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To provide kit, shop, and donation features.</li>
        <li>To notify you about restocks or launches you asked about.</li>
        <li>To improve the site and prevent abuse.</li>
      </ul>

      <h2>Sharing</h2>
      <p>
        We don’t sell your data. We share only what’s necessary with service
        providers (e.g., Supabase for forms, Amway for storefront). Payment data
        on Amway is handled by Amway.
      </p>

      <h2>Retention</h2>
      <p>
        We keep data only as long as necessary for the stated purpose or as
        required by law. You can request deletion at any time.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>Unsubscribe from emails using the link we include.</li>
        <li>Contact us to access or delete your data.</li>
      </ul>

      <h2>Contact</h2>
      <p>
        Questions? Email{" "}
        <a href="mailto:hello@thesafetyplan.org">hello@thesafetyplan.org</a>.
      </p>

      <p className="text-sm text-zinc-400">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </section>
  );
}
