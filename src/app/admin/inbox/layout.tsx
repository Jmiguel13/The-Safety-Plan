// src/app/admin/inbox/layout.tsx
import type { Metadata } from "next";
import EnvRibbon from "@/components/admin/EnvRibbon";
import { ENV } from "@/lib/env";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Option A: rely on default */}
      {/* <EnvRibbon /> */}

      {/* Option B: pass explicitly */}
      <EnvRibbon env={ENV} />

      <main>{children}</main>
    </>
  );
}
