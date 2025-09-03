import { z } from "zod";

export const DbKit = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  is_published: z.boolean().nullable().transform((v) => !!v),
  buy_url: z.string().nullable().optional(),
});
export type DbKit = z.infer<typeof DbKit>;

export const DbKitItem = z.object({
  quantity: z.number(),
  sort_order: z.number().nullable().optional(),
  product: z.object({ id: z.string(), sku: z.string(), title: z.string(), url: z.string().nullable().optional() }),
});
export type DbKitItem = z.infer<typeof DbKitItem>;