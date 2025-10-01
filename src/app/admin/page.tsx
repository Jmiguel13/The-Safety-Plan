// src/app/admin/page.tsx
export const dynamic = "force-dynamic";

import EnvRibbon from "@/components/admin/EnvRibbon";
import Link from "next/link";

export default function AdminPage() {
  return (
    <>
      <EnvRibbon />
      <main className="container space-y-6">
        <h1 className="text-2xl font-bold">Admin</h1>

        <ul className="list-disc space-y-1 pl-6">
          <li><Link href="/admin/inbox">Inbox</Link></li>
          <li><Link href="/admin/kits">Kits</Link></li>
          <li><Link href="/admin/outbound">Outbound</Link></li>
          <li><Link href="/admin/myshop">MyShop</Link></li>
          <li><Link href="/admin/seed">Seed</Link></li>
        </ul>
      </main>
    </>
  );
}
