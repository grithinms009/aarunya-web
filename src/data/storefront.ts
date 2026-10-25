/* Loads the store's own content from the API before the app renders.

   The app reads CONFIG, ANNOUNCEMENTS, COLORS, CATEGORIES, OFFERS and PAIRINGS as module
   constants in dozens of places. Rather than thread a context through all of them, this
   fills those same objects in place from GET /api/storefront and is awaited in main.tsx,
   so the first render already has live values. Nothing here is hard-coded: whatever the
   admin panel saves is what the store shows.

   If the API cannot be reached the app still renders, with whatever defaults config.ts
   carries, and the failure is logged rather than left silent. */
import {
  ANNOUNCEMENTS, BANNERS, CATEGORIES, COLORS, CONFIG, OFFERS, PAIRINGS,
} from './config';
import type { Category, ColorDef, ColorKey, Offer } from './types';
import { withMediaOrigin } from './media';

interface Banners {
  heroDesktop: string;
  heroMobile: string;
  heroAlt: string;
  personalised: string;
  personalisedMobile: string;
  personalisedAlt: string;
  personalisedCta: string;
}

interface StorefrontPayload {
  config: Partial<typeof CONFIG>;
  banners: Banners;
  offers: Offer[];
  announcements: string[];
  categories: Category[];
  colors: Record<ColorKey, ColorDef>;
  pairings: Record<string, string[]>;
}

/** Replaces an array's contents without changing the reference other modules hold. */
const refill = <T>(target: T[], next: T[]): void => {
  target.splice(0, target.length, ...next);
};

/** Replaces an object's contents in place, for the same reason. */
const reset = (target: Record<string, unknown>, next: Record<string, unknown>): void => {
  for (const k of Object.keys(target)) delete target[k];
  Object.assign(target, next);
};

let loaded: Promise<void> | null = null;

export function loadStorefront(): Promise<void> {
  if (loaded) return loaded;

  loaded = (async () => {
    const res = await fetch(CONFIG.API_BASE + '/storefront');
    if (!res.ok) throw new Error(`GET /storefront failed: ${res.status}`);
    const data = withMediaOrigin((await res.json()) as StorefrontPayload);

    /* API_BASE and USE_MOCK are local settings and must survive the merge. */
    const { API_BASE, USE_MOCK } = CONFIG;
    Object.assign(CONFIG, data.config, { API_BASE, USE_MOCK });

    if (data.banners) Object.assign(BANNERS, data.banners);
    refill(ANNOUNCEMENTS, data.announcements ?? []);
    refill(OFFERS, data.offers ?? []);
    refill(CATEGORIES, data.categories ?? []);
    reset(COLORS as Record<string, unknown>, (data.colors ?? {}) as Record<string, unknown>);
    reset(PAIRINGS as Record<string, unknown>, (data.pairings ?? {}) as Record<string, unknown>);
  })().catch((e) => {
    console.error('aarunya: could not load store content', e);
  });

  return loaded;
}
