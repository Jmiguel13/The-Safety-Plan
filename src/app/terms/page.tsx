// src/app/terms/page.tsx
export const metadata = { title: "Terms of Service — The Safety Plan" };

export default function TermsPage() {
  return (
    <section className="prose prose-invert max-w-3xl">
      <h1>Terms of Service</h1>
      <p>By using this site, you agree to these terms.</p>
      <h2>Use of the site</h2>
      <ul>
        <li>No automated scraping or abuse</li>
        <li>Content provided “as is” without warranties</li>
        <li>We may modify features without notice</li>
      </ul>
      <h2>Returns &amp; refunds</h2>
      <p>Handled by the retailer (Amway) per their policies.</p>
      <p className="text-sm text-zinc-400">Last updated: {new Date().toLocaleDateString()}</p>
    </section>
  );
}
