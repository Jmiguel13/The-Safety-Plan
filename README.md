# The Safety Plan

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-20232a?logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?logo=stripe&logoColor=white)](https://stripe.com)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/your-org/safety-plan/pulls)

Mission-driven wellness kits that support frontline fighters and help prevent veteran suicide.  
Every purchase funds resources for veterans in crisis.  

Built with [Next.js](https://nextjs.org), [Stripe](https://stripe.com), [Supabase](https://supabase.com), and Amway’s MyShop platform.

---

## 🚀 Features

- **Kits**  
  - `/kits` — browse Resilient & Homefront kits  
  - `/kits/[slug]` — kit details, recommended add-ons, and Safety Plan gear  
  - `/kits/[slug]/items` — copy full SKU list or add to cart  

- **Shop**  
  - `/shop` — structured into:  
    1. The Kits  
    2. Solo Amway products (curated picks)  
    3. The Safety Plan gear/merch  

- **Donate**  
  - `/donate` — preset or custom amounts via Stripe Checkout  

- **Redirects**  
  - `/r/[slug]` — one-click add-to-cart redirect (logs outbound clicks with Supabase)

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19  
- **Styling**: Tailwind CSS v4  
- **Payments**: Stripe Checkout  
- **Database/Auth**: Supabase  
- **E-commerce**: Amway MyShop deep links  
- **Deployment**: Vercel  

---

## ⚙️ Local Development

Clone and install dependencies:

```bash
git clone https://github.com/your-org/safety-plan.git
cd safety-plan
pnpm install
pnpm dev


Mission-driven wellness kits that support frontline fighters and help prevent veteran suicide.  
Every purchase funds resources for veterans in crisis.  

Built with [Next.js](https://nextjs.org), [Stripe](https://stripe.com), [Supabase](https://supabase.com), and Amway’s MyShop platform.

---

## 🚀 Features

- **Kits**  
  - `/kits` — browse Resilient & Homefront kits  
  - `/kits/[slug]` — kit details, recommended add-ons, and Safety Plan gear  
  - `/kits/[slug]/items` — copy full SKU list or add to cart  

- **Shop**  
  - `/shop` — structured into:  
    1. The Kits  
    2. Solo Amway products (curated picks)  
    3. The Safety Plan gear/merch  

- **Donate**  
  - `/donate` — preset or custom amounts via Stripe Checkout  

- **Redirects**  
  - `/r/[slug]` — one-click add-to-cart redirect (logs outbound clicks with Supabase)

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19  
- **Styling**: Tailwind CSS v4  
- **Payments**: Stripe Checkout  
- **Database/Auth**: Supabase  
- **E-commerce**: Amway MyShop deep links  
- **Deployment**: Vercel  

---

## ⚙️ Local Development

Clone and install dependencies:

```bash
git clone https://github.com/your-org/safety-plan.git
cd safety-plan
pnpm install
pnpm dev

Open http://localhost:3000
 with your browser.
 .
├─ public/                        # static assets (images, icons, manifest, etc.)
├─ src/
│  ├─ app/                        # Next.js App Router pages & API routes
│  │  ├─ about/
│  │  ├─ admin/                   # admin routes
│  │  ├─ api/                     # serverless API (Stripe, Supabase, etc.)
│  │  ├─ checkout/
│  │  ├─ contact/
│  │  ├─ donate/                  # Stripe donation flow
│  │  ├─ faq/
│  │  ├─ gallery/                 # mission gallery
│  │  ├─ kits/                    # wellness kits
│  │  │  ├─ resilient/            # specific kit page
│  │  │  └─ [slug]/               # dynamic kit routes
│  │  │     └─ items/             # SKU list / copy-to-clipboard
│  │  ├─ privacy/
│  │  ├─ r/                       # redirects → MyShop carts
│  │  │  └─ [slug]/route.ts
│  │  ├─ shop/                    # full shop view
│  │  ├─ terms/
│  │  ├─ error.tsx                # global error page
│  │  ├─ layout.tsx               # root layout (header/footer)
│  │  ├─ loading.tsx              # fallback loader
│  │  ├─ not-found.tsx            # 404 page
│  │  ├─ page.tsx                 # homepage
│  │  ├─ robots.ts
│  │  └─ sitemap.ts
│  │
│  ├─ components/                 # UI building blocks
│  │  ├─ admin/                   # admin-only components
│  │  ├─ ui/                      # shared primitives
│  │  ├─ BuyButtons.tsx
│  │  ├─ CopySkus.tsx
│  │  ├─ CrisisCTA.tsx
│  │  ├─ DonateButton.tsx
│  │  ├─ Gallery.tsx
│  │  ├─ HomeHero.tsx
│  │  ├─ ItemRow.tsx
│  │  ├─ KitCard.tsx
│  │  ├─ KitsCTA.tsx
│  │  ├─ NeedHelpRibbon.tsx
│  │  ├─ SiteFooter.tsx
│  │  ├─ SiteHeader.tsx
│  │  ├─ SpecGrid.tsx
│  │  ├─ VeteranAwareness.tsx
│  │  └─ track-link.tsx
│  │
│  └─ lib/                        # domain logic & integrations
│     ├─ admin/
│     ├─ db/
│     ├─ server/
│     ├─ amway.ts                 # myShopLink(), buildCartLink()
│     ├─ amway-products.ts        # curated solo Amway catalog
│     ├─ amway_product_urls.ts    # SKU → PDP URL map
│     ├─ env.ts                   # env helpers
│     ├─ kits.ts                  # kit definitions (items/SKUs)
│     ├─ recommendations.ts       # add-ons for kits
│     ├─ skumap.ts                # SKU mapping utils
│     ├─ ssr-supabase.ts          # SSR Supabase anon client
│     ├─ stripe.ts                # Stripe helpers
│     ├─ supabaseAdmin.ts         # Supabase service-role client
│     ├─ supabasePublic.ts        # Supabase anon client
│     ├─ track.ts                 # outbound click logging
│     ├─ tsp-products.ts          # Safety Plan gear list
│     ├─ types.ts                 # shared types
│     └─ utils.ts                 # misc utils
│
├─ .env.local                     # local environment variables
├─ next.config.mjs
├─ package.json
├─ pnpm-lock.yaml
├─ tailwind.config.js
└─ tsconfig.json

Contributions welcome! Open an issue or PR.

License

MIT © The Safety Plan
Dedication

This project is dedicated to the ones who fight,
to the brave whose courage encourages,
and to the bold who dare to accept the challenge of peace and freedom.
