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
}

export interface CartLine {
  pid: string;
  vid: string;
  qty: number;
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
}

export interface OrderPayload {
  customer: OrderCustomer;
  items: { productId: string; variantId: string; qty: number }[];
  subtotal: number;
  shipping: number;
  giftWrap: boolean;
  giftFee: number;
  total: number;
}

export interface OrderResult {
  orderId: string;
  status: string;
  amount: number;
}

export interface PaymentResult {
  status: string;
  provider: string;
  orderId: string;
  amount: number;
}
