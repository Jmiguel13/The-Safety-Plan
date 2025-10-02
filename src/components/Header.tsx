"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string; isActive: (p: string) => boolean };

export default function Header() {
  const pathname = usePathname() || "/";

  const links: NavLink[] = [
    { href: "/kits", label: "Kits", isActive: (p) => p === "/kits" || p.startsWith("/kits/") },
    { href: "/kits/resilient", label: "Resilient", isActive: (p) => p.startsWith("/kits/resilient") },
    { href: "/kits/homefront", label: "Homefront", isActive: (p) => p.startsWith("/kits/homefront") },
    { href: "/faq", label: "FAQ", isActive: (p) => p.startsWith("/faq") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[#0b1113]/75 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-white">✚</span>
          <span className="text-sm font-semibold tracking-wide">The Safety Plan</span>
        </Link>

        <nav className="hidden items-center gap-2 sm:flex">
          {links.map(({ href, label, isActive }) => {
            const active = isActive(pathname);
            return (
              <Link
                key={href}
                href={href}
                data-active={active ? "true" : "false"}
                className="pill"
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/shop" className="btn">Buy Kits</Link>
        </div>
      </div>
    </header>
  );
}
