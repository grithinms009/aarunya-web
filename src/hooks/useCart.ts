import { useEffect, useMemo, useRef } from 'react';
import { api } from '@/data/api';
import { CONFIG } from '@/data/config';
import { bgOf, calcShipping, fmt } from '@/lib/format';
import { productHref, resolveVariants } from '@/lib/catalog';
import type { ResolvedVariant } from '@/data/types';
import { useShop } from '@/store/useStore';
import { useCatalog } from './useCatalog';

export interface CartLineView {
  key: string;
  /** Product id — needed when building the order payload. */
  pid: string;
  vid: string;
  name: string;
  href: string;
  color: string;
  hex: string;
  bg: string;
  /** Per-unit price, formatted. */
  unit: string;
  /** Line total, formatted. */
  total: string;
  qty: number;
  /** Dimmed when the line is already at the variant's stock. */
  incOpacity: number;
  atStock: boolean;
  dec: () => void;
  inc: () => void;
  remove: () => void;
}

/** Everything the bag UI needs: lines, counts, money and the free-shipping nudge.
 *  Mirrors the prototype's `cart` + `totals()`. */
export function useCart() {
  const { products } = useCatalog();
  const cart = useShop((s) => s.cart);
  const gift = useShop((s) => s.gift);
  const setQty = useShop((s) => s.setQty);

  const threshold = CONFIG.FREE_SHIPPING_THRESHOLD;

  const view = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p] as const));

    const lines: CartLineView[] = cart
      .map((l) => {
        const p = byId.get(l.pid);
        const v: ResolvedVariant | undefined = p
          ? resolveVariants(p).find((x) => x.id === l.vid)
          : undefined;
        if (!p || !v) return null;
        return {
          key: l.vid,
          pid: p.id,
          vid: l.vid,
          name: p.name,
          href: productHref(p),
          color: v.label,
          hex: v.hex,
          bg: bgOf(v),
          unit: fmt(p.price),
          total: fmt(p.price * l.qty),
          qty: l.qty,
          incOpacity: l.qty >= v.stock ? 0.35 : 1,
          atStock: l.qty >= v.stock,
          dec: () => setQty(l.vid, l.qty - 1),
          inc: () => {
            if (l.qty < v.stock) setQty(l.vid, l.qty + 1);
          },
          remove: () => setQty(l.vid, 0),
        } satisfies CartLineView;
      })
      .filter((x): x is CartLineView => x !== null);

    const subtotal = cart.reduce((a, l) => {
      const p = byId.get(l.pid);
      return a + (p ? p.price * l.qty : 0);
    }, 0);
    const shipping = calcShipping(subtotal);
    const giftFee = gift && cart.length ? CONFIG.GIFT_WRAP_FEE : 0;
    const total = subtotal + shipping + giftFee;

    const count = lines.reduce((a, l) => a + l.qty, 0);
    const remaining = threshold - subtotal;
    const freeShipping = shipping === 0 && subtotal > 0;

    return {
      lines,
      count,
      has: count > 0,
      empty: count === 0,
      ariaLabel: `Bag, ${count} item${count === 1 ? '' : 's'}`,
      raw: { subtotal, shipping, giftFee, total },
      subtotal: fmt(subtotal),
      shipping: freeShipping ? 'FREE' : fmt(shipping),
      shipColor: freeShipping ? '#3E7B5C' : '#302722',
      total: fmt(total),
      shipMsg:
        subtotal === 0
          ? `Free shipping on orders above ${fmt(threshold)}`
          : remaining > 0
            ? `Add ${fmt(remaining)} more to unlock FREE shipping`
            : 'You’ve unlocked FREE shipping ♡',
      pct: Math.min(100, (subtotal / threshold) * 100) + '%',
      gift: giftFee > 0,
      giftFee: fmt(giftFee),
    };
  }, [cart, gift, products, setQty, threshold]);

  return view;
}

/** Mirrors the cart to `POST /cart` whenever it changes, skipping the first run so a
 *  restored-from-localStorage bag does not fire a pointless request. */
export function useCartSync() {
  const cart = useShop((s) => s.cart);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    api
      .syncCart(cart.map((l) => ({ productId: l.pid, variantId: l.vid, qty: l.qty })))
      .catch(() => {
        /* a failed sync must never block the shopper */
      });
  }, [cart]);
}
