// src/app/privacy/page.tsx
export const metadata = { title: "Privacy Policy — The Safety Plan" };

export default function PrivacyPage() {
  return (
    <section className="prose prose-invert max-w-3xl">
      <h1>Privacy Policy</h1>
      <p>We respect your privacy and only collect the minimum data needed to run this site.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Anonymous analytics (page views, referrers)</li>
        <li>Outbound click logs for kit redirects (no PII)</li>
        <li>Payment details are handled by Stripe — we never see full card data</li>
      </ul>
      <h2>Contact</h2>
      <p>Email our team if you have questions: <a href="mailto:support@thesafetyplan.example">support@thesafetyplan.example</a></p>
      <p className="text-sm text-zinc-400">Last updated: {new Date().toLocaleDateString()}</p>
    </section>
  );
}
