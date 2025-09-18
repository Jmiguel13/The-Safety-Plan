export function Divider() {
  return <div className="separator my-8" />;
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="panel border-[color:var(--accent)]/20 bg-[color:var(--bg-soft)]/80 p-4">
      <div className="mb-1 text-xs uppercase tracking-[.12em] text-[color:var(--accent-soft)]">Intel</div>
      <div className="text-[color:var(--fg)]">{children}</div>
    </div>
  );
}

