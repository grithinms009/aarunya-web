/* The single source for who this business is and what it promises customers.
 *
 * Everything a payment gateway, a customer or a regulator could hold the shop to lives
 * here, and nothing in this file is invented. Anything the merchant has not confirmed is
 * `null`, which makes it (a) a type error to use carelessly, (b) visible on the page as a
 * neutral "being updated" note rather than a fabricated value, and (c) reported by
 * `npm run check:business`, which fails until every launch-blocking field is supplied.
 *
 * Values the merchant can already edit in the admin panel (support email, WhatsApp number,
 * shipping fee, free-shipping threshold, return window) are read from the live store
 * settings instead of being duplicated here, so the site and the backend cannot disagree.
 */
import { CONFIG } from '@/data/config';

/** A fact the merchant must confirm. `null` until they do. */
export type Supplied<T> = T | null;

/* The seeded defaults that ship with a fresh install. They are examples, not facts, so
   they are treated as missing until the merchant replaces them in Settings. */
const SEEDED_PLACEHOLDERS = new Set([
  '919876543210',
  'hello@aarunyajewels.in',
  'aarunyajewelsbyveena',
]);

/** Returns the value only if it is a real, merchant-supplied one. */
export const supplied = <T extends string>(v: T | undefined | null): Supplied<T> =>
  v && String(v).trim() && !SEEDED_PLACEHOLDERS.has(String(v).trim()) ? v : null;

export interface PostalAddress {
  line1: Supplied<string>;
  line2: Supplied<string>;
  city: Supplied<string>;
  state: Supplied<string>;
  pin: Supplied<string>;
  country: string;
}

export interface GrievanceOfficer {
  name: Supplied<string>;
  designation: Supplied<string>;
  email: Supplied<string>;
  phone: Supplied<string>;
}

/* ------------------------------------------------------------------ identity */

/** Publicly used brand name. Safe to state — it is how the shop already trades. */
export const BRAND_NAME = 'Aarunya Jewels by Veena';

/**
 * The person or entity legally behind the shop, and how it is constituted.
 *
 * The business is not registered as a company, so nothing here may describe it as a
 * private limited company, a GST-registered entity or a certified jeweller.
 */
export const MERCHANT = {
  /** e.g. the proprietor's full legal name, as it appears on their bank account. */
  legalName: null as Supplied<string>,
  /** e.g. 'Sole proprietorship'. */
  constitution: null as Supplied<string>,
  /** Set only if the merchant actually holds one; leave null otherwise. */
  gstin: null as Supplied<string>,
};

/** The real operating address, also used as the return address. */
export const ADDRESS: PostalAddress = {
  line1: null,
  line2: null,
  city: null,
  /* The shop operates from Kerala; the rest of the address still needs confirming. */
  state: 'Kerala',
  pin: null,
  country: 'India',
};

/** The primary production domain. Only one, so canonical URLs stay unambiguous. */
export const PRIMARY_DOMAIN: Supplied<string> = null;

/* ------------------------------------------------------------------ support */

export const SUPPORT = {
  /** Read from the live store settings, where the merchant edits it. */
  get email(): Supplied<string> {
    return supplied(CONFIG.EMAIL);
  },
  get whatsapp(): Supplied<string> {
    return supplied(CONFIG.WHATSAPP_NUMBER);
  },
  get instagram(): Supplied<string> {
    return supplied(CONFIG.INSTAGRAM_HANDLE);
  },
  /** A phone line answered during the hours below. */
  phone: null as Supplied<string>,
  /** e.g. 'Monday to Saturday'. */
  days: null as Supplied<string>,
  /** e.g. '10:00 am to 6:00 pm IST'. */
  hours: null as Supplied<string>,
};

/** Named person who handles complaints and escalations. Never invent this. */
export const GRIEVANCE: GrievanceOfficer = {
  name: null,
  designation: null,
  email: null,
  phone: null,
};

/* ------------------------------------------------------------------ operations */

/**
 * Shipping. The money figures come from the live store settings, which is also what the
 * backend charges, so the policy page and the checkout can never quote different numbers.
 */
export const SHIPPING = {
  courier: 'India Post',
  /** Where parcels are posted from. */
  get origin(): Supplied<string> {
    return ADDRESS.city;
  },
  get feeBelowThreshold(): number {
    return Number(CONFIG.SHIPPING_FEE) || 0;
  },
  get freeAbove(): number {
    return Number(CONFIG.FREE_SHIPPING_THRESHOLD) || 0;
  },
  /**
   * Which figure the free-shipping threshold is measured against. The backend compares
   * the merchandise subtotal after any discount and before shipping and gift wrap, so
   * that is what is stated to customers.
   */
  thresholdBasis: 'the item subtotal after any discount, before shipping and gift wrap',
  /** Working days between payment and handover to India Post. Merchant to confirm. */
  processingDays: null as Supplied<string>,
  /** Typical India Post transit, e.g. '3 to 7 working days'. Merchant to confirm. */
  deliveryWindow: null as Supplied<string>,
};

/** Returns, replacements, cancellations and refunds. */
export const RETURNS = {
  /** Days after delivery within which a request must be raised. From store settings. */
  get windowDays(): number {
    return Number(CONFIG.returnWindow) || 0;
  },
  /** When a customer can still cancel, e.g. 'any time before the parcel is dispatched'. */
  cancellationCutoff: null as Supplied<string>,
  /** Working days from approval to the refund being initiated. Merchant to confirm. */
  refundInitiationDays: null as Supplied<string>,
  /** Typical time for the bank or UPI app to credit it back. Merchant to confirm. */
  refundCompletionDays: null as Supplied<string>,
  /** Who pays return postage, and when. Merchant to confirm. */
  returnShipping: null as Supplied<string>,
  /** Whether an unboxing video is required for a damage claim. From store settings. */
  get requiresUnboxingVideo(): boolean {
    return CONFIG.requireVideo !== false;
  },
};

export const PAYMENTS = {
  gateway: 'Razorpay',
  /** Set true only once Razorpay is live and the backend verifies payments. */
  live: false,
};

/** Shown as "Last updated" on every policy page. Bump when policy wording changes. */
export const POLICIES_UPDATED: Supplied<string> = null;

/* ------------------------------------------------------------------ readiness */

export interface MissingDetail {
  field: string;
  why: string;
  /** Blocking details must be supplied before the site goes live. */
  blocking: boolean;
}

/**
 * Everything still missing, for `npm run check:business` and the launch report.
 * Keep the `why` text specific enough that the merchant knows exactly what to send.
 */
export function missingBusinessInfo(): MissingDetail[] {
  const out: MissingDetail[] = [];
  const need = (cond: unknown, field: string, why: string, blocking = true) => {
    if (!cond) out.push({ field, why, blocking });
  };

  need(MERCHANT.legalName, 'MERCHANT.legalName',
    'The proprietor’s full legal name, for Terms and the Razorpay application.');
  need(MERCHANT.constitution, 'MERCHANT.constitution',
    'How the business is constituted, e.g. "Sole proprietorship".');
  need(ADDRESS.line1, 'ADDRESS.line1', 'Street address, shown on Contact and used for returns.');
  need(ADDRESS.city, 'ADDRESS.city', 'City or town of the operating address.');
  need(ADDRESS.pin, 'ADDRESS.pin', 'PIN code of the operating address.');
  need(PRIMARY_DOMAIN, 'PRIMARY_DOMAIN',
    'Which domain is primary (.com or .in), so canonical URLs point at one site.');
  need(SUPPORT.email, 'SUPPORT.email',
    'A monitored support inbox. Set it in the admin under Settings → Store contact.');
  need(SUPPORT.phone, 'SUPPORT.phone', 'A phone number answered during support hours.');
  need(SUPPORT.whatsapp, 'SUPPORT.whatsapp',
    'The WhatsApp Business number. Set it in the admin under Settings → Store contact.');
  need(SUPPORT.days, 'SUPPORT.days', 'Which days support is available.');
  need(SUPPORT.hours, 'SUPPORT.hours', 'Support hours, with the time zone.');
  need(GRIEVANCE.name, 'GRIEVANCE.name', 'Named grievance contact. Must be a real person.');
  need(GRIEVANCE.designation, 'GRIEVANCE.designation', 'That person’s designation.');
  need(GRIEVANCE.email, 'GRIEVANCE.email', 'Email for complaints and escalations.');
  need(GRIEVANCE.phone, 'GRIEVANCE.phone', 'Phone number for complaints.');
  need(SHIPPING.processingDays, 'SHIPPING.processingDays',
    'Working days between payment and handover to India Post.');
  need(SHIPPING.deliveryWindow, 'SHIPPING.deliveryWindow',
    'Typical India Post delivery window, stated as a range, not a guarantee.');
  need(RETURNS.cancellationCutoff, 'RETURNS.cancellationCutoff',
    'Up to what point an order can be cancelled.');
  need(RETURNS.refundInitiationDays, 'RETURNS.refundInitiationDays',
    'Working days from approval to the refund being initiated.');
  need(RETURNS.refundCompletionDays, 'RETURNS.refundCompletionDays',
    'How long the bank or UPI app typically takes after that.');
  need(RETURNS.returnShipping, 'RETURNS.returnShipping',
    'Who pays return postage, and in which cases.');
  need(POLICIES_UPDATED, 'POLICIES_UPDATED',
    'The date the merchant approved this policy wording.');
  need(RETURNS.windowDays > 0, 'RETURNS.windowDays',
    'Return window in days. Set it in the admin under Returns → policy.', false);

  return out;
}

export const isLaunchReady = (): boolean =>
  missingBusinessInfo().every((m) => !m.blocking);

/* ------------------------------------------------------------------ formatting */

/** The address as a single line, or null while it is incomplete. */
export function addressLine(): Supplied<string> {
  const parts = [ADDRESS.line1, ADDRESS.line2, ADDRESS.city, ADDRESS.state, ADDRESS.pin]
    .filter(Boolean);
  /* Without a street and a city it is not an address worth printing. */
  if (!ADDRESS.line1 || !ADDRESS.city) return null;
  return parts.join(', ') + ', ' + ADDRESS.country;
}

/** Absolute URL for canonical tags, or null until the primary domain is chosen. */
export function canonicalUrl(path: string): Supplied<string> {
  if (!PRIMARY_DOMAIN) return null;
  const base = PRIMARY_DOMAIN.replace(/\/+$/, '');
  return base + (path.startsWith('/') ? path : '/' + path);
}
