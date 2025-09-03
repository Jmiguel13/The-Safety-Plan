// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white grid place-items-center px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Page not found</h1>
        <p className="text-zinc-400">Let’s get you back to safety.</p>
        <Link href="/" className="inline-block mt-6 underline">Go home</Link>
      </div>
    </main>
  );
}
