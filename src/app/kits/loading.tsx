// app/kits/[slug]/loading.tsx
export default function LoadingKit() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-4 w-28 bg-zinc-800 rounded" />
        <div className="h-8 w-64 bg-zinc-800 rounded mt-4" />
        <div className="h-4 w-80 bg-zinc-800 rounded mt-2" />
        <div className="h-5 w-40 bg-zinc-800 rounded mt-8" />
        <div className="space-y-3 mt-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 bg-zinc-900 border border-zinc-800 rounded-lg" />
          ))}
        </div>
      </div>
    </main>
  );
}
