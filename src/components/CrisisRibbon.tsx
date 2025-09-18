// src/components/CrisisRibbon.tsx
export default function CrisisRibbon() {
  return (
    <div
      role="region"
      aria-label="Crisis support"
      className="mx-auto my-3 max-w-6xl px-4"
    >
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-red-300" aria-hidden="true" />
          <strong className="tracking-wide">In crisis?</strong>
          <span className="opacity-80">
            Call{" "}
            <a href="tel:988" className="underline underline-offset-2 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-400/50">
              988
            </a>{" "}
            (Veterans press 1) or text{" "}
            <a href="sms:838255" className="underline underline-offset-2 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-400/50">
              838255
            </a>
            .
          </span>
        </span>
      </div>
    </div>
  );
}

