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

/* Example values that shipped with earlier installs. They are not facts, so anything
   still set to one of them is treated as missing until replaced in Settings. The real
   contact details are seeded now, so this list only guards against an old database. */
const SEEDED_PLACEHOLDERS = new Set([
  '919876543210',
  'hello@aarunyajewels.in',
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
  /** The owner's name, as supplied by the merchant. */
  legalName: 'Veena G' as Supplied<string>,
  /**
   * How the business is constituted, e.g. 'Sole proprietorship'.
   *
   * Still null on purpose: the shop is not registered as a company, but the merchant has
   * not confirmed the exact wording to use, and inventing a legal status is precisely the
   * kind of claim that must not appear. The pages read correctly without it.
   */
  constitution: null as Supplied<string>,
  /** Set only if the merchant actually holds one; leave null otherwise. */
  gstin: null as Supplied<string>,
};

/** The real operating address, also used as the return address. */
export const ADDRESS: PostalAddress = {
  line1: 'Pulickatharayil, Edappon',
  line2: 'Ayranikudy P.O.',
  city: 'Mavelikara, Alappuzha District',
  state: 'Kerala',
  pin: '690558',
  country: 'India',
};

/**
 * The primary production domain. Only one, so canonical URLs stay unambiguous.
 *
 * Still null: the shop holds both aarunyajewelsbyveena.com and .in, and which one serves
 * as primary has not been confirmed. Until it is, no canonical tag is emitted — better
 * than naming the wrong one and splitting the site across two canonical hosts.
 */
export const PRIMARY_DOMAIN: Supplied<string> = 'aarunyajewelsbyveena.in';

/* ------------------------------------------------------------------ support */

export const SUPPORT = {
  /** Read from the live store settings, where the merchant edits it. */
  get email(): Supplied<string> {
    return supplied(CONFIG.EMAIL);
  },
  get instagram(): Supplied<string> {
    return supplied(CONFIG.INSTAGRAM_HANDLE);
  },
  /** The customer support line. */
  phone: '+91 97477 38193' as Supplied<string>,
  /** Tel: href form — digits and a leading +, nothing else. */
  phoneHref: '+919747738193',

  /**
   * WhatsApp is shown only once the merchant confirms this number is WhatsApp Business
   * enabled. The number is the same support line, but a WhatsApp link that goes nowhere
   * is worse than no link, so every WhatsApp affordance on the site is gated on this.
   */
  whatsappConfirmed: false,
  get whatsapp(): Supplied<string> {
    return this.whatsappConfirmed ? supplied(CONFIG.WHATSAPP_NUMBER) : null;
  },

  /**
   * Messages can be sent at any hour. Deliberately not phrased as a response-time
   * promise: the merchant has not committed to one, and "we reply within 24 hours" is
   * a commitment a gateway and a customer will both hold the shop to.
   */
  days: 'Any day' as Supplied<string>,
  hours: 'messages accepted 24/7' as Supplied<string>,
  /** Sets expectations without promising a deadline. */
  responseNote:
    'Messages reach us at any time and are answered as quickly as we can, usually within '
    + 'a working day. Calls are best during daytime hours, IST.',
};

/** Named person who handles complaints and escalations. Never invent this. */
export const GRIEVANCE: GrievanceOfficer = {
  name: 'Veena G',
  designation: 'Owner',
  /* The same channels as support: a one-person shop, stated honestly rather than
     dressed up as a separate department. */
  get email(): Supplied<string> {
    return SUPPORT.email;
  },
  get phone(): Supplied<string> {
    return SUPPORT.phone;
  },
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
  /**
   * Business days between order confirmation and handover to India Post. This is dispatch
   * time, which is counted separately from transit — the two are never added together or
   * quoted as one "delivery time", because a customer reading a single number will take
   * it as a delivery date.
   */
  processingDays: '2 to 4 business days' as Supplied<string>,

  /** Transit after dispatch, which differs sharply inside and outside the home state. */
  transit: {
    local: '1 to 3 days',
    rest: '3 to 10 days',
    /** The state the shorter window applies to. */
    localLabel: 'Kerala',
  },

  /** A single phrase for places that can only show one window. */
  get deliveryWindow(): Supplied<string> {
    return `${this.transit.local} within ${this.transit.localLabel}, `
      + `${this.transit.rest} elsewhere in India, after dispatch`;
  },
};

/** Returns, replacements, cancellations and refunds. */
export const RETURNS = {
  /** Days after delivery within which a request must be raised. From store settings. */
  get windowDays(): number {
    return Number(CONFIG.returnWindow) || 0;
  },
  /** How long a customer has to ask for a cancellation, and the condition on it. */
  cancellationCutoff:
    'within one business day of placing the order, as long as it has not already been '
    + 'dispatched' as Supplied<string>,

  /** Business days from approval to the refund being initiated with Razorpay. */
  refundInitiationDays: '3 to 5 business days' as Supplied<string>,

  /**
   * Deliberately not a number of days. Once a refund is initiated the timing belongs to
   * Razorpay, the payment method and the customer's bank, so the site describes that
   * rather than promising a credit date it does not control.
   */
  refundCompletionDays:
    'a further few days, depending on your bank and payment method' as Supplied<string>,

  /** Who pays return postage. Discretionary returns differ from genuine faults. */
  returnShipping:
    'Where a return is accepted at our discretion — you changed your mind, or the piece '
    + 'is not what you hoped for — the return postage is yours. Where the piece is '
    + 'defective, damaged, incorrect or something is missing, you should not be out of '
    + 'pocket: we cover the return, and we will tell you how to send it before you post '
    + 'anything.' as Supplied<string>,
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
export const POLICIES_UPDATED: Supplied<string> = '17 October 2026';

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
