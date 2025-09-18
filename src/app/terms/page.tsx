// src/app/terms/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description:
    "The Safety Plan website terms of service, including purchases fulfilled by third parties, donations, waitlists, and acceptable use.",
};

export default function TermsPage() {
  return (
    <section className="prose prose-invert max-w-3xl">
      <h1>Terms of Service</h1>
      <p className="lead">
        Welcome to The Safety Plan (the “Site”). By accessing or using the Site,
        you agree to these Terms of Service (“Terms”). If you do not agree, do
        not use the Site.
      </p>

      <h2>1) Who we are</h2>
      <p>
        The Safety Plan provides mission-first wellness kits and related
        information. Some products are sold or fulfilled by third parties (e.g.,
        Amway MyShop and payment processors). Your use of those services is
        governed by their own terms and privacy policies.
      </p>

      <h2>2) Eligibility & accounts</h2>
      <ul>
        <li>You must be at least 13 years old to use the Site.</li>
        <li>
          If you create any account or submit information, you agree to provide
          accurate details and to keep them up to date.
        </li>
      </ul>

      <h2>3) Purchases, donations, and waitlists</h2>
      <ul>
        <li>
          <strong>Third-party checkout.</strong> Some purchases are completed
          off-site (e.g., Amway). Prices, availability, shipping, returns, and
          customer service are handled by those providers.
        </li>
        <li>
          <strong>Donations.</strong> Donations are processed by payment
          partners (e.g., Stripe). We do not store full card numbers on our
          servers.
        </li>
        <li>
          <strong>Waitlists.</strong> When you join a waitlist, you authorize us
          to contact you about the product. Joining a waitlist does not
          guarantee availability or pricing.
        </li>
      </ul>

      <h2>4) Health & safety disclaimer</h2>
      <p>
        Content on the Site is for general informational purposes only and is
        not medical advice. Always follow product labels and consult a qualified
        professional as needed. You are responsible for determining whether any
        product is appropriate for you.
      </p>

      <h2>5) Acceptable use</h2>
      <p>
        You agree not to misuse the Site, including by attempting to interfere
        with its normal operation, reversing engineering, scraping, or using it
        for unlawful purposes.
      </p>

      <h2>6) Intellectual property</h2>
      <p>
        The Site, its content, and trademarks are owned by The Safety Plan or
        our licensors. Third-party names and marks (e.g., Amway, XS™, Nutrilite™)
        are the property of their respective owners and used for identification
        only.
      </p>

      <h2>7) Feedback</h2>
      <p>
        If you send ideas or suggestions, you grant us a non-exclusive,
        worldwide, royalty-free license to use them without restriction or
        obligation to you.
      </p>

      <h2>8) Disclaimers</h2>
      <p>
        THE SITE IS PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE FULLEST EXTENT
        PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED,
        INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
        NON-INFRINGEMENT.
      </p>

      <h2>9) Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SAFETY PLAN AND ITS
        AFFILIATES SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL,
        CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS,
        DATA, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SITE.
      </p>

      <h2>10) Indemnification</h2>
      <p>
        You agree to defend, indemnify, and hold harmless The Safety Plan from
        any claims, losses, liabilities, and expenses (including reasonable
        attorneys’ fees) arising from your use of the Site or violation of these
        Terms.
      </p>

      <h2>11) Third-party links</h2>
      <p>
        The Site may link to third-party websites. We are not responsible for
        their content, policies, or practices.
      </p>

      <h2>12) Changes to the Site and Terms</h2>
      <p>
        We may modify or discontinue the Site (in whole or part) at any time.
        We may update these Terms from time to time. Continued use of the Site
        after changes take effect constitutes acceptance of the updated Terms.
      </p>

      <h2>13) Governing law</h2>
      <p>
        These Terms are governed by the laws of the United States and the laws
        of the state in which The Safety Plan is organized and operates (without
        regard to conflict-of-law rules). <em>Note:</em> update this section to
        specify your state/jurisdiction before launch.
      </p>

      <h2>14) Contact</h2>
      <p>
        Questions about these Terms? Email{" "}
        <a href="mailto:hello@thesafetyplan.org">hello@thesafetyplan.org</a>. See
        also our <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <p className="text-sm text-zinc-400">
        Effective date: {new Date().toLocaleDateString()}
      </p>
    </section>
  );
}

