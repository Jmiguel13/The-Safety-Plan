// src/app/faq/page.tsx
export const revalidate = 86400; // rebuild daily

export default function FAQPage() {
  const faqs = [
    {
      q: "What is The Safety Plan?",
      a: "A mission-first wellness project. We build clean, effective kits for hydration, energy, recovery, and rest — and direct profits toward veteran suicide prevention.",
    },
    {
      q: "Where do I buy?",
      a: "Use the Shop link in the header to open our official Amway storefront, or browse kits here and click through to purchase the bundled items.",
    },
    {
      q: "Do you ship internationally?",
      a: "Right now we focus on the U.S. Some individual products on the Amway storefront may have different availability.",
    },
    {
      q: "How do donations work?",
      a: "Donations help fund outreach, peer support, and crisis response partners. We’ll publish a transparency report on the Version page as we scale.",
    },
    {
      q: "I’m in crisis — what should I do?",
      a: 'Call 988 (Veterans press 1) or text 838255. If you or someone else is in immediate danger, call 911.',
    },
  ];

  return (
    <section className="container py-10 space-y-8">
      <header className="space-y-2">
        <h1>Frequently Asked Questions</h1>
        <p className="muted">
          Quick answers about kits, buying, availability, and our mission impact.
        </p>
      </header>

      <ul className="grid gap-4 md:grid-cols-2">
        {faqs.map(({ q, a }) => (
          <li key={q} className="faq-card">
            <h2 className="text-lg font-semibold">{q}</h2>
            <p className="muted">{a}</p>
          </li>
        ))}
      </ul>

      <div className="panel-elevated p-5 space-y-2">
        <h2 className="font-semibold">Need help now?</h2>
        <p className="muted">
          Call <a className="link-chip tel" href="tel:988">988</a> (Veterans press 1) or text{" "}
          <a className="link-chip sms" href="sms:838255">838255</a>. If there’s immediate danger, call 911.
        </p>
      </div>
    </section>
  );
}
