import { CONFIG } from '@/data/config';

/** `₹` + en-IN grouping. */
export const fmt = (n: number | undefined | null) =>
  '₹' + Number(n || 0).toLocaleString('en-IN');

/** Discount %, shown only when mrp > price. */
export const discountOf = (price: number, mrp: number) =>
  mrp > price ? Math.round((1 - price / mrp) * 100) : 0;

/** ₹60 below the threshold, free at or above it; nothing on an empty bag. */
export const calcShipping = (subtotal: number) =>
  subtotal <= 0 ? 0 : subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : CONFIG.SHIPPING_FEE;

export const whatsappUrl = (text: string = CONFIG.WHATSAPP_TEXT) =>
  `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const instagramUrl = () => `https://instagram.com/${CONFIG.INSTAGRAM_HANDLE}`;

/** CSS background shorthand for a variant image, falling back to the hatched placeholder. */
export const bgOf = (
  variant: { images?: string[]; tint?: string } | undefined,
  i = 0,
): string => {
  const img = variant?.images?.[i];
  if (img) return `center/cover no-repeat url("${img}")`;
  return `repeating-linear-gradient(135deg,rgba(255,255,255,.5) 0 6px,rgba(255,255,255,0) 6px 12px), ${
    variant?.tint ?? '#FBEFEF'
  }`;
};

/** `repeat(k,minmax(0,1fr))` — the prototype's `cols()` helper. */
export const cols = (k: number) => `repeat(${k},minmax(0,1fr))`;

export const pieces = (n: number) => `${n} piece${n === 1 ? '' : 's'}`;
