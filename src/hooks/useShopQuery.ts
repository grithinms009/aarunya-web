import { useCallback, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { ColorKey, PriceKey } from '@/data/types';
import { EMPTY_FILTERS, type Filters, type SortKey } from '@/lib/shopFilters';

const SORT_KEYS: SortKey[] = ['popular', 'newest', 'name-asc', 'price-asc', 'price-desc'];
const PRICE_KEYS: PriceKey[] = ['all', 'u500', '500-1000', 'o1000'];

const splitList = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);

/** Filters and sort, read from and written to the URL so any view is shareable.
 *
 *  Categories come from the path (`/category/:cat`). A sub-type may come from the path too
 *  (`/category/:cat/:type`), but as soon as the shopper uses the Product Type dropdown the
 *  full set moves into `?type=` and the path drops back to the category, keeping one
 *  source of truth. */
export function useShopQuery() {
  const { cat, type } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const rawSort = params.get('sort') as SortKey | null;
  const sort: SortKey = rawSort && SORT_KEYS.includes(rawSort) ? rawSort : 'popular';

  const rawPrice = params.get('price') as PriceKey | null;
  const price: PriceKey = rawPrice && PRICE_KEYS.includes(rawPrice) ? rawPrice : 'all';

  const filters: Filters = useMemo(() => {
    const queryTypes = splitList(params.get('type'));
    return {
      ...EMPTY_FILTERS,
      cats: cat ? [cat] : [],
      types: queryTypes.length ? queryTypes : type ? [type] : [],
      price,
      colors: splitList(params.get('color')) as ColorKey[],
      inStock: params.get('instock') === '1',
      sale: params.get('sale') === '1',
    };
  }, [cat, type, params, price]);

  /** Writes a filter patch to the query string, dropping defaults so URLs stay clean. */
  const patch = useCallback(
    (next: Partial<Filters> & { sort?: SortKey }) => {
      const merged = { ...filters, sort, ...next };
      const q = new URLSearchParams();
      if (merged.sort !== 'popular') q.set('sort', merged.sort);
      if (merged.price !== 'all') q.set('price', merged.price);
      if (merged.colors.length) q.set('color', merged.colors.join(','));
      if (merged.inStock) q.set('instock', '1');
      if (merged.sale) q.set('sale', '1');
      if (merged.types.length) q.set('type', merged.types.join(','));

      // Touching types moves the sub-type out of the path and into the query.
      const typesChanged = next.types !== undefined;
      const basePath = cat ? (typesChanged ? `/category/${cat}` : location.pathname) : '/shop';
      navigate({ pathname: basePath, search: q.toString() ? `?${q}` : '' }, { replace: false });
    },
    [filters, sort, cat, navigate],
  );

  const setSort = useCallback((value: SortKey) => patch({ sort: value }), [patch]);

  /** Clears every filter, keeping the category scope from the path. */
  const clearAll = useCallback(() => {
    const q = new URLSearchParams();
    if (sort !== 'popular') q.set('sort', sort);
    navigate(
      { pathname: cat ? `/category/${cat}` : '/shop', search: q.toString() ? `?${q}` : '' },
      { replace: false },
    );
  }, [cat, sort, navigate]);

  return { filters, sort, patch, setSort, clearAll, pathCat: cat };
}
