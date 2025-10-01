// src/lib/blank.ts

/** Basic brand + contact config for BLANK.
 *  Edit these values and the UI will pick them up automatically.
 */

export type BrandConfig = {
  /** Public-facing brand name shown in badges and copy. */
  name: string;
  /** Optional legal name for terms/receipts. */
  legalName?: string;
  /** Optional slogan/tagline. */
  slogan?: string;
};

export type ContactConfig = {
  /** Support email shown on disclosures/packing slips. */
  email?: string;
  /** Support phone number (E.164 or local). */
  phone?: string;
  /** Public site for deeper info (optional). */
  website?: string;
};

export const BRAND: BrandConfig = {
  name: "BLANK",
  legalName: "Blank, LLC",
  slogan: "Built by BLANK, fueled by purpose",
};

export const CONTACT: ContactConfig = {
  email: "support@blanknothing.com",
  phone: "864-713-0509",
  
};

/** Small helpers if you want consistent labels elsewhere */
export const builtByLabel = `Built by ${BRAND.name}`;
export const assembledByLine = `Assembled by ${BRAND.name}.`;
