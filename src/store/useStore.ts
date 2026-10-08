import { create } from 'zustand';
import { persist, type StateStorage } from 'zustand/middleware';
import type { CartLine, Product } from '@/data/types';

/** The handoff specifies one localStorage key per slice (`aj_cart`, `aj_wish`, `aj_gift`,
 *  `aj_pin`) rather than a single blob, so persist reads and writes those four keys.
 *  Every access is guarded: localStorage throws in private mode and with site data blocked. */
const KEYS = { cart: 'aj_cart', wish: 'aj_wish', gift: 'aj_gift', pin: 'aj_pin' } as const;

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
};
const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode / blocked site data — state simply does not persist */
  }
};

const splitStorage: StateStorage = {
  getItem: () =>
    JSON.stringify({
      state: {
        cart: read<CartLine[]>(KEYS.cart, []),
        wish: read<string[]>(KEYS.wish, []),
        // Stored as '1' / '0' by the prototype, so it is read as a raw string.
        gift: (() => {
          try {
            return localStorage.getItem(KEYS.gift) === '1';
          } catch {
            return false;
          }
        })(),
        pin: (() => {
          try {
            return localStorage.getItem(KEYS.pin) ?? '';
          } catch {
            return '';
          }
        })(),
      },
      version: 0,
    }),
  setItem: (_name, value) => {
    const { state } = JSON.parse(value) as { state: ShopState };
    write(KEYS.cart, JSON.stringify(state.cart));
    write(KEYS.wish, JSON.stringify(state.wish));
    write(KEYS.gift, state.gift ? '1' : '0');
    write(KEYS.pin, state.pin);
  },
  removeItem: () => {
    Object.values(KEYS).forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {
        /* ignore */
      }
    });
  },
};

/** Shopper state that survives a reload, persisted to the localStorage keys the handoff names. */
interface ShopState {
  cart: CartLine[];
  wish: string[];
  gift: boolean;
  pin: string;
}

interface ShopActions {
  /** Adds qty of a variant, capped at its stock. Merges with an existing line. */
  add: (product: Product, variantId: string, qty: number) => void;
  /** Sets a line's qty; 0 or less removes it. */
  setQty: (variantId: string, qty: number) => void;
  toggleWish: (productId: string) => boolean;
  setGift: (on: boolean) => void;
  setPin: (pin: string) => void;
}

export const useShop = create<ShopState & ShopActions>()(
  persist<ShopState & ShopActions, [], [], ShopState>(
    (set) => ({
      cart: [],
      wish: [],
      gift: false,
      pin: '',

      add: (product, variantId, qty) => {
        const variant = product.variants.find((v) => v.id === variantId);
        if (!variant || variant.stock <= 0) return;
        set((s) => {
          const existing = s.cart.find((l) => l.vid === variantId);
          const cart = existing
            ? s.cart.map((l) =>
                l.vid === variantId ? { ...l, qty: Math.min(variant.stock, l.qty + qty) } : l,
              )
            : [...s.cart, { pid: product.id, vid: variantId, qty: Math.min(variant.stock, qty) }];
          return { cart };
        });
      },

      setQty: (variantId, qty) =>
        set((s) => ({
          cart:
            qty <= 0
              ? s.cart.filter((l) => l.vid !== variantId)
              : s.cart.map((l) => (l.vid === variantId ? { ...l, qty } : l)),
        })),

      toggleWish: (productId) => {
        let had = false;
        set((s) => {
          had = s.wish.includes(productId);
          return {
            wish: had ? s.wish.filter((x) => x !== productId) : [...s.wish, productId],
          };
        });
        return had;
      },

      setGift: (on) => set({ gift: on }),
      setPin: (pin) => set({ pin }),
    }),
    {
      name: 'aarunya-shop', // unused: splitStorage ignores it and writes the four aj_* keys
      storage: {
        getItem: (n) => JSON.parse(splitStorage.getItem(n) as string),
        setItem: (n, v) => splitStorage.setItem(n, JSON.stringify(v)),
        removeItem: (n) => splitStorage.removeItem(n),
      },
      partialize: (s) => ({ cart: s.cart, wish: s.wish, gift: s.gift, pin: s.pin }),
    },
  ),
);

/** Transient UI state — never persisted. */
interface UiState {
  cartOpen: boolean;
  menuOpen: boolean;
  searchOpen: boolean;
  megaOpen: boolean;
  /** Which shop filter dropdown is open ('' = none). */
  dd: string;
  toast: string;
  /** True while a mobile product page shows its sticky bottom bar — the layout reserves
   *  space for it and the WhatsApp button and toast lift above it. */
  stickyBar: boolean;
  openCart: () => void;
  openMenu: () => void;
  openSearch: () => void;
  setMega: (open: boolean) => void;
  setDd: (dd: string) => void;
  setStickyBar: (on: boolean) => void;
  closeAll: () => void;
  flash: (text: string) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useUi = create<UiState>((set) => ({
  cartOpen: false,
  menuOpen: false,
  searchOpen: false,
  megaOpen: false,
  dd: '',
  toast: '',
  stickyBar: false,
  openCart: () => set({ cartOpen: true }),
  openMenu: () => set({ menuOpen: true }),
  openSearch: () => set({ searchOpen: true }),
  setMega: (megaOpen) => set({ megaOpen }),
  setDd: (dd) => set({ dd }),
  setStickyBar: (stickyBar) => set({ stickyBar }),
  closeAll: () =>
    set({ cartOpen: false, menuOpen: false, searchOpen: false, megaOpen: false, dd: '' }),
  /** Bottom-centre toast; auto-hides after 2.2s. */
  flash: (text) => {
    clearTimeout(toastTimer);
    set({ toast: text });
    toastTimer = setTimeout(() => set({ toast: '' }), 2200);
  },
}));
