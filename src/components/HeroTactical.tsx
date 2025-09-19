export default function HeroTactical({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "relative w-full h-56 md:h-72 overflow-hidden rounded-xl border border-white/10",
        "bg-[#0b1113]",
        className,
      ].join(" ")}
    >
      {/* vignette + mood glows */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             backgroundImage: [
               "radial-gradient(800px 400px at 80% 0%, rgba(16,185,129,.22), transparent 60%)",
               "radial-gradient(700px 350px at 10% 100%, rgba(56,189,248,.18), transparent 60%)",
               "radial-gradient(closest-side, rgba(0,0,0,.35), transparent 70%)"
             ].join(", ")
           }} />

      {/* soft surface */}
      <div className="absolute inset-[10%] rounded-xl"
           style={{
             background:
               "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.015))",
             boxShadow:
               "inset 0 1px 0 rgba(255,255,255,.06), 0 20px 60px rgba(0,0,0,.35)"
           }} />

      {/* subtle grid */}
      <div className="absolute inset-[10%] rounded-xl opacity-25"
           style={{
             backgroundImage: [
               "repeating-linear-gradient(0deg, rgba(255,255,255,.08) 0 1px, transparent 1px 24px)",
               "repeating-linear-gradient(90deg, rgba(255,255,255,.08) 0 1px, transparent 1px 24px)"
             ].join(", ")
           }} />

      {/* “kit items” — abstract blocks */}
      <div className="absolute inset-[10%] p-4 grid grid-cols-4 gap-3">
        <div className="h-16 rounded-lg bg-white/[.06] border border-white/10" />
        <div className="h-16 rounded-lg bg-white/[.06] border border-white/10" />
        <div className="h-16 rounded-lg bg-white/[.06] border border-white/10" />
        <div className="h-16 rounded-lg bg-white/[.06] border border-white/10" />

        <div className="h-10 rounded-md bg-white/[.05] border border-white/10 col-span-2" />
        <div className="h-10 rounded-md bg-white/[.05] border border-white/10 col-span-2" />

        <div className="h-14 rounded-md bg-white/[.05] border border-white/10 col-span-1" />
        <div className="h-14 rounded-md bg-white/[.05] border border-white/10 col-span-3" />
      </div>

      {/* top reflection line */}
      <div className="absolute inset-x-[10%] top-[10%] h-px bg-white/20 opacity-30" />
    </div>
  );
}
