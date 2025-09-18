// src/components/QuickDonate.tsx
"use client";

import Link from "next/link";

export default function QuickDonate({ className = "" }: { className?: string }) {
  const amounts = [10, 25, 50];
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {amounts.map((a) => (
        <Link key={a} href={`/checkout/donate?amount=${a}`} className="pill">
          ${a}
        </Link>
      ))}
      <Link href="/donate" className="pill">Other</Link>
    </div>
  );
}
