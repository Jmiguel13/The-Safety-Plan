// lib/types.ts
export type Kit = { id: string; slug: string; name: string; subtitle: string|null; hero_image_url: string|null; description: string|null; };
export type Product = { id: string; title: string; brand: string|null; amway_url: string|null; image_url: string|null; };
export type KitItem = { kit_id: string; product_id: string; quantity: number };
