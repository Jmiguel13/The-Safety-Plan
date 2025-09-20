// src/components/ImpactStats.tsx
"use client";

type Props = {
  kitsPlaced?: number;
  volunteerHours?: number;
  fundsDirectedUsd?: number;
  className?: string;
};

function nOrU(v: unknown): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

const ENV_DEFAULTS = {
  kitsPlaced: nOrU(process.env.NEXT_PUBLIC_IMPACT_KITS),
  volunteerHours: nOrU(process.env.NEXT_PUBLIC_IMPACT_VOLUNTEERS),
  fundsDirectedUsd: nOrU(process.env.NEXT_PUBLIC_IMPACT_FUNDS),
};

const fmtInt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const fmtUsd = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function ImpactStats({
  kitsPlaced = ENV_DEFAULTS.kitsPlaced ?? 0,
  volunteerHours = ENV_DEFAULTS.volunteerHours ?? 0,
  fundsDirectedUsd = ENV_DEFAULTS.fundsDirectedUsd ?? 0,
  className = "",
}: Props) {
  return (
    <section aria-label="Impact" className={className}>
      <ul className="grid gap-3 sm:grid-cols-3">
        <li className="panel-inset p-4">
          <div className="text-xs uppercase tracking-wide text-zinc-400">Kits in hands</div>
          <div className="text-2xl tabular-nums">{fmtInt.format(kitsPlaced)}</div>
        </li>
        <li className="panel-inset p-4">
          <div className="text-xs uppercase tracking-wide text-zinc-400">Volunteer hours</div>
          <div className="text-2xl tabular-nums">{fmtInt.format(volunteerHours)}</div>
        </li>
        <li className="panel-inset p-4">
          <div className="text-xs uppercase tracking-wide text-zinc-400">Funds to prevention</div>
          <div className="text-2xl tabular-nums">{fmtUsd.format(fundsDirectedUsd)}</div>
        </li>
      </ul>
    </section>
  );
}
