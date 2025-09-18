// components/VeteranAwareness.tsx
export default function VeteranAwareness() {
  return (
    <section className="mb-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 md:p-6">
      <div className="flex items-start gap-3">
        <div className="h-3 w-3 shrink-0 rounded-full bg-emerald-400 mt-1.5" />
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Veteran Suicide Awareness</h2>
          <p className="mt-2 text-sm/6 text-zinc-300">
            Too many veterans struggle in silence. The Safety Plan exists to keep our fighters here—seen, supported, and equipped. 
            If you or someone you know is in crisis, help is available 24/7.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <a
              href="tel:988"
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm hover:bg-zinc-800"
            >
              <div className="font-medium">Veterans Crisis Line</div>
              <div className="text-zinc-400">
                Dial <span className="font-semibold">988</span> then press <span className="font-semibold">1</span>
              </div>
            </a>
            <a
              href="sms:838255"
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm hover:bg-zinc-800"
            >
              <div className="font-medium">Text Support</div>
              <div className="text-zinc-400">Text <span className="font-semibold">838255</span></div>
            </a>
            <a
              href="https://www.veteranscrisisline.net/chat/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm hover:bg-zinc-800"
            >
              <div className="font-medium">Confidential Chat</div>
              <div className="text-zinc-400">Open secure chat</div>
            </a>
          </div>

          <p className="mt-4 text-xs text-zinc-400">
            If you’re outside the U.S., contact your local emergency number or nearest crisis service.
          </p>
        </div>
      </div>
    </section>
  );
}

