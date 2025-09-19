// src/components/ClientHelpStripIsland.tsx
"use client";

import dynamic from "next/dynamic";

type Props = {
  enabled?: boolean;
  className?: string;
};

// Load the actual strip only on the client
const HelpStrip = dynamic(
  () => import("./HelpStrip").then((m) => m.default ?? m),
  { ssr: false }
);

export default function ClientHelpStripIsland({ enabled = true, className }: Props) {
  if (!enabled) return null;
  return <HelpStrip className={className} />;
}
