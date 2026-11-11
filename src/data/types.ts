export type ColorKey = 'gold' | 'rose' | 'silver' | 'black' | 'green';

export interface ColorDef {
  label: string;
  hex: string;
  /** Image-placeholder background for this colour. */
  tint: string;
}

export interface Variant {
  id: string;
  color: ColorKey;
  stock: number;
  /** front, on model, detail */
  images: string[];
}

/** A variant joined with its colour definition — what the UI actually renders. */
export type ResolvedVariant = Variant & ColorDef;

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  /** Sub-category slug, or null. */
  type: string | null;
  /** Units sold; drives the "Popularity" sort. */
  popularity: number;
  price: number;
  mrp: number;
  featured: boolean;
  isNew: boolean;
  createdAt: string;
  rating: number | null;
  reviewCount: number;
  description: string;
  material: string;
  /** Whether gift wrap can be added to this piece. */
  giftWrap?: boolean;
  /** Whether this piece is eligible for exchange, per the shop's policy. */
  exchange?: boolean;
  variants: Variant[];
}

export interface SubCategory {
  slug: string;
  name: string;
}

export interface Category {
  slug: string;
  name: string;
  short: string;
  /** Placeholder label stem, e.g. "necklace". */
  ph: string;
  tint: string;
  subs?: SubCategory[];
  /** Filled in at load time from the first product in the category. */
  image?: string;
}

export interface Offer {
  badge: string;
  title: string;
  accent: string;
  sub: string;
  cta: string;
  href: string;
  /** 'sale' (MRP above price) or a price key. */
  match: 'sale' | PriceKey;
  image: string;
  /** Natural image width; column widths are proportional to it. */
  w: number;
  btn: 'solid' | 'outline';
  /** Live CTA position, as a percentage of the banner. */
  bx: number;
  by: number;
}

export type PriceKey = 'all' | 'u500' | '500-1000' | 'o1000';

export interface PolicySection {
  h: string;
  p: string;
}
export interface Policy {
  title: string;
  updated: string;
  sections: PolicySection[];
}

export interface DeliveryEstimate {
  ok: boolean;
  pin?: string;
  minDays?: number;
  maxDays?: number;
  cod?: boolean;
  /** State name, null when the PIN spans two states. */
  state?: string | null;
  district?: string;
  zone?: 'home' | 'rest' | 'remote' | null;
  shippingFee?: number;
  /** Set when ok is false. */
  reason?: 'unknown_pin' | 'no_delivery';
}

export interface CartLine {
  pid: string;
  vid: string;
  qty: number;
}

/** Optional billing details, sent only when they differ from the delivery address. */
export interface BillingDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  /** Optional, for business purchases. The server validates it. */
  gstin: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email: string;
  address: string;
  house: string;
  landmark: string;
  city: string;
  state: string;
  pin: string;
  billing?: BillingDetails;
}

/** What the browser sends. Prices and totals are deliberately absent: the server prices
 *  the order from the catalogue and returns the amount. */
export interface OrderPayload {
  customer: OrderCustomer;
  items: { productId: string; variantId: string; qty: number }[];
  giftWrap: boolean;
}

export interface OrderResult {
  orderId: string;
  status: string;
  /** Rupees, as computed by the server (includes GST in GST-exclusive mode). */
  amount: number;
  /** The shopper's private handle on this order, issued once at checkout. */
  accessToken?: string;
}

/** The GST breakup the server returns from POST /cart. Display only; never recomputed here. */
export type CartTax =
  | { applied: false }
  | {
      applied: true;
      taxType: 'intra' | 'inter';
      priceMode: 'inclusive' | 'exclusive' | string;
      placeOfSupply: { code: string; name: string };
      stateTaxLabel: 'SGST' | 'UTGST';
      taxablePaise: number;
      cgstPaise: number;
      sgstPaise: number;
      igstPaise: number;
      taxPaise: number;
      roundOffPaise: number;
      grandTotalPaise: number;
    };

export interface CartQuote {
  ok: boolean;
  subtotal: number;
  shipping: number;
  giftFee: number;
  /** Rupees. Authoritative: what the order will be charged. */
  total: number;
  tax: CartTax;
  /** What the server made of the PIN and state. Absent from older servers. */
  delivery?: CartDelivery;
}

export interface CartDelivery {
  pin: string;
  /** A human message for the PIN field; empty when the PIN is fine. */
  pinError: string;
  zone: 'home' | 'rest' | 'remote' | null;
  state: { code: string; name: string } | null;
  district: string;
}

export type PaymentResult =
  | { status: 'GATEWAY_NOT_CONFIGURED'; provider?: string; orderId: string; amount: number }
  | {
      status: 'CREATED';
      provider?: string;
      orderId: string;
      keyId: string;
      gatewayOrderId: string;
      amountPaise: number;
      amount: number;
      currency: string;
    };

export interface PaymentVerification {
  ok: boolean;
  paid: boolean;
  pending: boolean;
  orderId: string;
}
