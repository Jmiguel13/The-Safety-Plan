"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/kits", label: "Kits" },
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  return (
    <nav aria-label="Primary" className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
      <Link href="/" className="font-semibold tracking-wide">THE SAFETY PLAN</Link>
      <ul className="flex items-center gap-2">
        {links.map((l) => {
          const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className="pill"
                data-active={active ? "true" : "false"}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
