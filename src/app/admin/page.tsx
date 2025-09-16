// src/app/admin/page.tsx
import EnvRibbon from "@/components/admin/EnvRibbon";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <>
      <EnvRibbon /> {/* ← no props */}
      <main className="space-y-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        <ul className="list-disc pl-6 space-y-1">
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
