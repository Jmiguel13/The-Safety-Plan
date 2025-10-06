// src/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string; isActive: (p: string) => boolean };

export default function Header() {
  const pathname = usePathname() || "/";

  const links: NavLink[] = [
    { href: "/kits", label: "Kits", isActive: (p) => p === "/kits" || p.startsWith("/kits/") },
    { href: "/faq", label: "FAQ", isActive: (p) => p.startsWith("/faq") },
    { href: "/partners", label: "Partners", isActive: (p) => p.startsWith("/partners") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[#0b1113]/75 backdrop-blur">
      <div className="container flex h-16 items-center">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-white">✚</span>
          <span className="text-sm font-semibold tracking-wide">The Safety Plan</span>
        </Link>

        {/* Spacer between brand and nav */}
        <div className="w-5 sm:w-8" />

        {/* Nav */}
        <nav className="flex items-center gap-3 sm:gap-4">
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

        {/* Push everything else (currently nothing) to the far right */}
        <div className="ml-auto" />
      </div>
    </header>
  );
}
