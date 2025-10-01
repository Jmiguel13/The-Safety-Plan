import Link from "next/link";

export default function SiteFooter({
  impactText = "Every purchase supports prevention resources.",
}: {
  impactText?: string;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[color:var(--border)]">
      <div className="container grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <p className="text-sm text-zinc-400">{impactText}</p>
        </div>

        <nav className="flex flex-col gap-2 text-sm" aria-label="Footer">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/about/founder" className="hover:underline">Founder</Link>
          <Link href="/faq" className="hover:underline">FAQ</Link>
          <Link href="/disclosures" className="hover:underline">Disclosures</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/sitemap.xml" className="hover:underline">Sitemap</Link>
          <Link href="/robots.txt" className="hover:underline">Robots</Link>
        </nav>

        <div className="text-sm text-zinc-400">© {year} The Safety Plan</div>
      </div>
    </footer>
  );
}
