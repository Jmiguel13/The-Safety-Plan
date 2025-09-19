export default function HeroArt() {
  // Pure CSS “photo”: gradient + subtle grid + vignette
  return (
    <div
      aria-hidden="true"
      className="relative h-64 w-full overflow-hidden rounded-xl border border-white/10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(0,200,255,.18),transparent),radial-gradient(120%_120%_at_100%_100%,rgba(255,170,0,.18),transparent),radial-gradient(120%_120%_at_30%_70%,rgba(0,255,150,.14),transparent)]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,.13)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.13)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,.35))]" />
    </div>
  );
}
