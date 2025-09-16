// src/app/admin/page.tsx
import EnvRibbon from "@/components/admin/EnvRibbon";

export default function AdminPage() {
  return (
    <>
      <EnvRibbon />
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Admin</h1>
        {/* …your admin content… */}
      </main>
    </>
  );
}
