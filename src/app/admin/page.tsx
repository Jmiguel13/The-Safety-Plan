// src/app/admin/page.tsx
import Link from "next/link";

export default function AdminHome() {
  return (
    <section className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <ul className="grid gap-2">
        <li>
          <Link href="/admin/seed" className="btn-ghost">Seed kits & products</Link>
        </li>
        <li>
          <Link href="/admin/health" className="btn-ghost">Health checks</Link>
        </li>
      </ul>
      <p className="muted text-sm">Protected by Basic Auth via <code>middleware.ts</code>.</p>
    </section>
  );
}
