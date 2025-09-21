"use client";

import * as React from "react";
import Link from "next/link";
import KitCheckoutForm from "@/components/KitCheckoutForm";
import BuyPriceButton from "@/components/BuyPriceButton";

type KitEntry = {
  slug: string;
  title: string;
  stats: { itemCount: number; skuCount: number };
};

type SoloItem = { sku: string; title: string; url: string };

type TspProduct = {
  id: string;
  title: string;
  blurb?: string;
  url?: string;
  inStock?: boolean;
};

type Props = {
  kitsList: KitEntry[];
  solos: SoloItem[];
  tspProducts: TspProduct[];
  storeHref: string;
  stickerPrice?: string;
  patchPrice?: string;
};

export default function ShopClient({
  kitsList,
  solos,
  tspProducts,
  storeHref,
  stickerPrice = "",
  patchPrice = "",
}: Props) {
  return (
    <>
      {/* Kits */}
      <section id="kits" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-semibold">The Kits</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {kitsList.map((k) => {
            const supportsStripeBundle = k.slug === "resilient" || k.slug === "homefront";
            return (
              <li key={k.slug} className="panel space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{k.title}</div>
                    <div className="muted text-sm">
                      {k.stats.itemCount} items • {k.stats.skuCount} SKUs
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/kits/${k.slug}`}
                      className="btn-ghost"
                      aria-label={`View ${k.title}`}
                    >
                      View kit
                    </Link>
                  </div>
                </div>

                {supportsStripeBundle ? (
                  <KitCheckoutForm
                    kit={{
                      slug: k.slug as "resilient" | "homefront",
                      title: k.title,
                    }}
                    className="pt-1"
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Solo Amway products */}
      <section id="solo" className="scroll-mt-24 space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Solo Amway Products</h2>
          <a
            href={storeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-sm"
          >
            Open MyShop
          </a>
        </div>

        {solos.length === 0 ? (
          <div className="panel p-4">
            <p className="muted text-sm">Curated picks coming soon.</p>
          </div>
        ) : (
          <ul className="grid gap-2">
            {solos.map((p) => (
              <li key={p.sku} className="glow-row">
                <div className="min-w-0">
                  <div className="truncate font-medium">{p.title}</div>
                  <div className="muted text-sm">Quick-buy single item · SKU {p.sku}</div>
                </div>
                <div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                    aria-label={`Buy ${p.title}`}
                  >
                    Buy
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* The Safety Plan gear */}
      <section id="tsp" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-semibold">The Safety Plan Products</h2>

        {(!tspProducts || tspProducts.length === 0) ? (
          <div className="panel p-4">
            <p className="muted text-sm">Our custom gear is in progress. Check back soon.</p>
          </div>
        ) : (
          <ul className="grid gap-2">
            {tspProducts.map((p) => {
              const slug = p.id.replace(/_/g, "-");
              const href = p.url ? (p.url.startsWith("/") ? p.url : p.url) : `/gear/${slug}`;
              const isInternal = p.url?.startsWith("/") || !p.url;

              const priceId =
                p.id === "sticker_pack"
                  ? stickerPrice
                  : p.id === "morale_patch_green"
                  ? patchPrice
                  : "";

              return (
                <li key={p.id} className="glow-row">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{p.title}</div>
                    {p.blurb ? <div className="muted text-sm">{p.blurb}</div> : null}
                  </div>

                  <div className="flex gap-2">
                    {priceId ? (
                      <BuyPriceButton priceId={priceId} className="btn-ghost" />
                    ) : isInternal ? (
                      <Link href={href} className="btn-ghost">
                        {p.inStock ? "View" : "Waitlist"}
                      </Link>
                    ) : (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                        {p.inStock ? "View" : "Waitlist"}
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
