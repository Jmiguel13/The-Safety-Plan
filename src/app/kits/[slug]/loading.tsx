// src/app/kits/[slug]/loading.tsx
export default function LoadingKit() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-pulse">
      <div className="h-8 w-72 rounded bg-zinc-800" />
      <div className="h-4 w-96 rounded bg-zinc-900" />
      <div className="rounded-2xl border border-zinc-800 p-5 space-y-3">
        <div className="h-5 w-40 rounded bg-zinc-800" />
        <div className="grid gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 rounded bg-zinc-900" />
          ))}
        </div>
      </div>
    </div>
  );
}

