"use client";

import Link from "next/link";

const PUB = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  stripeKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  myshopUrl: process.env.NEXT_PUBLIC_AMWAY_MYSHOP_URL ?? "",
};

function Chip({
  children,
  href,
  title,
}: {
  children: React.ReactNode;
  href?: string;
  title?: string;
}) {
  const cls =
    "inline-flex items-center rounded-full border border-white/10 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-zinc-100";
  return href ? (
    <Link className={cls} href={href} target="_blank" rel="noopener noreferrer" title={title}>
      {children}
    </Link>
  ) : (
    <span className={cls} title={title}>
      {children}
    </span>
  );
}

export default function EnvRibbon() {
  const mode =
    process.env.NODE_ENV === "production" ? "production" : "development";
  const stripeMode = PUB.stripeKey
    ? PUB.stripeKey.startsWith("pk_live")
      ? "LIVE"
      : "TEST"
    : "—";
  const supabaseHost = (() => {
    try {
      return new URL(PUB.supabaseUrl).host;
    } catch {
      return "—";
    }
  })();

  return (
    <div className="w-full border-b border-amber-400/20 bg-amber-500/10">
      <div className="container flex flex-wrap items-center gap-2 py-2 text-amber-100">
        <Chip title="Build/runtime mode">Env: {mode}</Chip>
        <Chip href={PUB.siteUrl || undefined} title={PUB.siteUrl || undefined}>
          Site: {PUB.siteUrl || "—"}
        </Chip>
        <Chip href={PUB.myshopUrl || undefined} title={PUB.myshopUrl || undefined}>
          MyShop: {PUB.myshopUrl ? "configured" : "—"}
        </Chip>
        <Chip title="Stripe publishable key mode">Stripe: {stripeMode}</Chip>
        <Chip title={PUB.supabaseUrl || undefined}>Supabase: {supabaseHost}</Chip>
      </div>
    </div>
  );
}
