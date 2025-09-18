import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResilientKitPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <section className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Resilient Kit</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Designed for our soldiers, first responders, and frontline fighters. Packed with energy, recovery, and emotional support essentials — and just enough dark humor to make it through the mission.
        </p>
        <div className="mt-6">
          <Link href="https://www.amway.com/myshop/safetyplan" target="_blank">
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200">
              Order on Amway
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="rounded-xl overflow-hidden shadow-lg border border-zinc-800">
          <Image
            src="/gallery/ChatGPT_Image_Aug_30_2025_10_31_02_AM.png"
            alt="Resilient Kit"
            width={800}
            height={600}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col justify-center">
          <ul className="text-left text-zinc-300 text-sm space-y-2">
            <li>✔ XS Energy Drink (caffeine + B12)</li>
            <li>✔ Nutrilite™ Daily Multivitamin</li>
            <li>✔ BodyKey™ Plant Protein Powder</li>
            <li>✔ G&H™ Protect+ Bar Soap</li>
            <li>✔ Included: crude joke + morale boost card</li>
          </ul>
        </div>
      </section>

      <footer className="text-center text-sm text-zinc-500 mt-16 border-t border-zinc-800 pt-6">
        <Link href="/gallery" className="hover:text-white transition-colors">Back to Gallery</Link>
        <div className="mt-2">Built for those who don’t back down.</div>
      </footer>
    </main>
  );
}

