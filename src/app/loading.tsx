export default function Loading() {
  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="panel h-48 animate-pulse" />
        <div className="panel h-48 animate-pulse" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="panel h-40 animate-pulse" />
        <div className="panel h-40 animate-pulse" />
        <div className="panel h-40 animate-pulse" />
      </div>
    </div>
  );
}

