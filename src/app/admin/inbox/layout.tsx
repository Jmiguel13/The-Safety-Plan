// src/app/admin/inbox/layout.tsx
import type { ReactNode } from "react";
import EnvRibbon from "@/components/admin/EnvRibbon";

export default function AdminInboxLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Don’t pass ENV object; let the component read NODE_ENV */}
      <EnvRibbon />
      <main>{children}</main>
    </>
  );
}
