"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/kits", label: "Kits" },
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40 border-b border-zinc-900/80 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/50"
      role="banner"
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">
          The Safety Plan
        </Link>

        <nav aria-label="Primary" className="hidden sm:block">
          <ul className="flex items-center gap-2 text-sm">
            {links.map((l) => {
              const active =
                pathname === l.href || pathname?.startsWith(l.href + "/");
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={[
                      "inline-flex items-center rounded-full border px-3 py-1 transition",
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
            <li>
              <Link
                href="/donate"
                className="inline-flex items-center rounded-full bg-white text-black px-3 py-1 font-medium hover:opacity-90"
              >
                Donate
              </Link>
            </li>
          </ul>
        </nav>

        {/* simple mobile menu (can upgrade later) */}
        <details className="group sm:hidden">
          <summary className="list-none cursor-pointer rounded-md border border-white/10 px-3 py-1 text-sm/6">
            Menu
          </summary>
          <ul className="mt-2 grid gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block rounded-md px-2 py-1 hover:bg-white/5">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/donate" className="block rounded-md bg-white px-2 py-1 text-black">
                Donate
              </Link>
            </li>
          </ul>
        </details>
      </div>

      {/* Crisis ribbon (desktop) */}
      <div
        role="region"
        aria-label="Crisis support"
        className="mx-auto mt-2 hidden w-full max-w-6xl px-4 pb-2 md:block"
      >
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-red-300" aria-hidden="true" />
            <strong className="tracking-wide">In crisis?</strong>
            <span className="opacity-90">
              {" "}
              Call <a href="tel:988" className="underline underline-offset-2 hover:opacity-100">988</a> (Veterans press 1) or text{" "}
              <a href="sms:838255" className="underline underline-offset-2 hover:opacity-100">838255</a>.
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
