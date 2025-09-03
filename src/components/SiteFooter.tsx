export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-[var(--border)]">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-sm muted">Copyright &copy; {new Date().getFullYear()} The Safety Plan</div>
          <div className="text-xs muted">Built for focus, recovery, hydration, rest.</div>
        </div>
      </div>
    </footer>
  );
}
