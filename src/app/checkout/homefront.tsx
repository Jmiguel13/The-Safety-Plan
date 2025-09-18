import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-zinc-800 text-white p-6">
      <section className="max-w-5xl mx-auto py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          THE SAFETY PLAN
        </h1>
        <p className="text-xl max-w-2xl mx-auto mb-6">
          Mission-driven wellness kits for frontline fighters and the families who hold the line at home.
          Every purchase fuels suicide prevention and crisis response for our veterans.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/checkout/homefront">
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200">
              Shop Homefront Kit
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/checkout/resilient">
            <Button variant="outline" size="lg">
              Sponsor a Resilient Kit
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto py-12">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Resilient Kit</h2>
            <p className="text-sm text-zinc-300 mb-4">
              Built for soldiers and first responders. Field-tested, morale-boosting essentials: energy, recovery, and emotional support in one drop-ready pack.
            </p>
            <Link href="/kits">
              <Button variant="link" className="text-white px-0">
                View Kit Details
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Homefront Kit</h2>
            <p className="text-sm text-zinc-300 mb-4">
              For spouses, parents, and caregivers. Daily wellness support, calm, and comfort — with a personal note inside.
            </p>
            <Link href="/kits">
              <Button variant="link" className="text-white px-0">
                Shop Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

