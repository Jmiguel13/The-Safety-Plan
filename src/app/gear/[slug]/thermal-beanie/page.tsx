// src/app/gear/thermal-beanie/page.tsx (snippet)
import WaitlistForm from "@/components/WaitlistForm";

export default function ThermalBeaniePage() {
  return (
    <main className="container py-10">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Thermal Beanie</h1>
      <p className="muted mt-2">Cold-weather beanie to keep the mission going in low temps.</p>

      <section className="mt-6 max-w-xl">
        <h2 className="text-xl font-semibold mb-2">Waitlist</h2>
        <WaitlistForm list="thermal-beanie" />
      </section>

      <div className="mt-6">
        <a className="btn-ghost" href="/shop">Back to Shop</a>
      </div>
    </main>
  );
}
