// src/components/SiteHeader.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string; isActive: (p: string) => boolean };

export default function SiteHeader() {
  const pathname = usePathname() || "/";

  const links: NavLink[] = [
    { href: "/kits", label: "Kits", isActive: (p) => p === "/kits" || p.startsWith("/kits/") },
    { href: "/faq", label: "FQA", isActive: (p) => p.startsWith("/faq") },           // label per your request
    { href: "/partners", label: "Partners", isActive: (p) => p.startsWith("/partners") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[#0b1113]/75 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-white">✚</span>
          <span className="text-sm font-semibold tracking-wide">The Safety Plan</span>
        </Link>

        {/* Nav: Kits · FQA · Partners */}
        <nav className="hidden items-center gap-2 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="pill"
              data-active={l.isActive(pathname)}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right side intentionally empty (Buy Kits removed) */}
        <div className="flex items-center gap-2" />
      </div>
    </header>
  );
}
