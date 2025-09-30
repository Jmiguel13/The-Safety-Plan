// src/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string };

function myShopHref() {
  const env = process.env.NEXT_PUBLIC_AMWAY_MYSHOP_URL;
  return env && /^https?:\/\//i.test(env)
    ? env
    : "https://www.amway.com/myshop/TheSafetyPlan";
}

export default function Header() {
  const pathname = usePathname() ?? "/";
  const MYSHOP = myShopHref();

  // Gallery removed; FAQ -> Resources
  const links: NavLink[] = [
    { href: "/shop", label: "Shop" },
    { href: "/kits", label: "Kits" },
    { href: "/resources", label: "Resources" },
  ];

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 border-b border-zinc-900/80 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/50"
    >
      {/* Skip link for a11y */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:rounded-md focus:bg-white focus:px-3 focus:py-1 focus:text-black"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        {/* brand a little bigger */}
        <Link href="/" className="text-lg md:text-xl font-semibold tracking-tight">
          <span className="sr-only">The Safety Plan — Home</span>
          The Safety Plan
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden sm:block">
          <ul className="flex items-center gap-2 text-sm">
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "inline-flex items-center rounded-full border px-3 py-1 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60",
                      active
                        ? "border-white/30 bg-white/10"
                        : "border-white/10 hover:border-white/20 hover:bg-white/5",
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
            {/* External MyShop (no brand word in label) */}
            <li>
              <a
                href={MYSHOP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-sm transition hover:border-white/20 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
              >
                MyShop
              </a>
            </li>
            <li>
              <Link
                href="/donate"
                className="inline-flex items-center rounded-full bg-white px-3 py-1 font-medium text-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
              >
                Donate
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile menu (native <details>) */}
        <details className="group sm:hidden">
          <summary
            aria-label="Open main menu"
            className="list-none cursor-pointer rounded-md border border-white/10 px-3 py-1 text-sm/6 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          >
            Menu
          </summary>
          <ul className="mt-2 grid gap-1 rounded-md border border-white/10 bg-black/70 p-1">
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "block rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/60",
                      active ? "bg-white/10" : "hover:bg-white/5",
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <a
                href={MYSHOP}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md px-2 py-1 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
              >
                MyShop
              </a>
            </li>
            <li>
              <Link
                href="/donate"
                className="block rounded-md bg-white px-2 py-1 text-black focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
              >
                Donate
              </Link>
            </li>
          </ul>
        </details>
      </div>
    </header>
  );
}
