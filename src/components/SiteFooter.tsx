// src/components/SiteFooter.tsx
import Link from "next/link";

export default function SiteFooter({ impactText }: { impactText?: string }) {
  const supportEmail = "contactsafetyplan@yahoo.com"; // ✅ updated

  return (
    <footer className="mt-12 border-t border-[color:var(--border)]">
      <div className="container py-8">
        {/* top line */}
        <p className="mb-6 text-sm text-zinc-300">
          {impactText ?? "Your support helps fund prevention, outreach, and response."}{" "}
          Questions?{" "}
          <a className="underline underline-offset-4" href={`mailto:${supportEmail}`}>
            {supportEmail}
          </a>.
        </p>

        {/* link columns */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:underline">About</Link></li>
            <li><Link href="/founder" className="hover:underline">Founder</Link></li>
            <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
            <li><Link href="/partners" className="hover:underline">Partners</Link></li>
          </ul>

          <ul className="space-y-2 text-sm">
            <li><Link href="/disclosures" className="hover:underline">Disclosures</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms</Link></li>
          </ul>

          <ul className="space-y-2 text-sm md:justify-self-end">
            <li><Link href="/sitemap.xml" className="hover:underline">Sitemap</Link></li>
            <li><Link href="/robots.txt" className="hover:underline">Robots</Link></li>
            <li className="mt-2 text-zinc-500">© {new Date().getFullYear()} The Safety Plan</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
