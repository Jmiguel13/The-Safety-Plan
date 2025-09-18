// app/admin/page.tsx
import Link from "next/link";

function CardLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link href={href}>
      <div className="block rounded-xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-700 hover:bg-zinc-900/80 transition">
        <div className="text-lg font-semibold">{title}</div>
        <p className="mt-1 text-sm text-zinc-400">{desc}</p>
      </div>
    </Link>
  );
}

export default function AdminHome() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardLink
            href="/admin/kits"
            title="Kits editor"
            desc="Edit names, subtitles, descriptions, buy links, and publish status."
          />
          <CardLink
            href="/admin/outbound"
            title="Outbound report"
            desc="See click-throughs to MyShop by date range and download CSV."
          />
          <CardLink
            href="/admin/myshop"
            title="MyShop link checker"
            desc="Verify kit/product URLs resolve under your MyShop storefront."
          />
        </div>

        <p className="mt-6 text-xs text-zinc-500">
          Protected by Basic Auth. Configure with <code>ADMIN_USER</code> and{" "}
          <code>ADMIN_PASS</code> environment variables.
        </p>
      </div>
    </main>
  );
}

