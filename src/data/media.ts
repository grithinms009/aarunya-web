import { CONFIG } from './config';

/**
 * Where uploaded images are served from.
 *
 * The API returns image paths as `/uploads/…`, relative on purpose: the database should
 * not hold a hostname. In development that is right — Vite proxies /uploads to the API.
 * In production the storefront and the API are different hosts, so a relative path
 * resolves against the storefront, where no images live.
 *
 * Worse, it does not 404 there. The site is served with a single-page-application
 * fallback, so an unknown path returns index.html with a 200, and the browser is handed
 * HTML where it expected a JPEG. The network tab shows 200 and the picture is blank.
 *
 * Empty string in development, so paths stay relative and the proxy keeps working.
 */
export const MEDIA_ORIGIN = (() => {
  const base = CONFIG.API_BASE;
  if (!/^https?:\/\//i.test(base)) return '';
  try {
    return new URL(base).origin;
  } catch {
    return '';
  }
})();

/** One upload path, made absolute. Anything else is handed back untouched. */
export const mediaUrl = (path: string): string =>
  MEDIA_ORIGIN && path.startsWith('/uploads/') ? MEDIA_ORIGIN + path : path;

/**
 * Rewrites every upload path inside a payload, however deeply nested.
 *
 * Done here, at the boundary, rather than in each component: a dozen places render these
 * images — cards, galleries, category tiles, banners, the cart, search — and one of them
 * forgetting to call a helper is a blank picture nobody notices until a customer does.
 */
export function withMediaOrigin<T>(value: T): T {
  if (!MEDIA_ORIGIN) return value;
  if (typeof value === 'string') return mediaUrl(value) as unknown as T;
  if (Array.isArray(value)) return value.map(withMediaOrigin) as unknown as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = withMediaOrigin(v);
    return out as T;
  }
  return value;
}
