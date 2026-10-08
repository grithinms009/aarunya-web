import type { Category, ColorKey, PriceKey, Product } from '@/data/types';

export type SortKey = 'popular' | 'newest' | 'name-asc' | 'price-asc' | 'price-desc';

export interface Filters {
  /** Category slugs in scope — path-derived on /category routes. */
  cats: string[];
  /** Sub-type slugs. */
  types: string[];
  price: PriceKey;
  colors: ColorKey[];
  inStock: boolean;
  sale: boolean;
}

export const EMPTY_FILTERS: Filters = {
  cats: [], types: [], price: 'all', colors: [], inStock: false, sale: false,
};

const pop = (p: Product) => p.popularity || 0;

/** Price ties break on popularity so equal-priced rows stay in a sensible order. */
export const SORTERS: Record<SortKey, (a: Product, b: Product) => number> = {
  popular: (a, b) => pop(b) - pop(a),
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  'name-asc': (a, b) => a.name.localeCompare(b.name),
  'price-asc': (a, b) => a.price - b.price || pop(b) - pop(a),
  'price-desc': (a, b) => b.price - a.price || pop(b) - pop(a),
};

export const SORT_LABELS: [SortKey, string][] = [
  ['popular', 'Popularity'],
  ['newest', 'Newest first'],
  ['name-asc', 'Name: A to Z'],
  ['price-asc', 'Price: Low to High'],
  ['price-desc', 'Price: High to Low'],
];

const priceOk = (price: PriceKey, p: Product) =>
  price === 'all' ||
  (price === 'u500' && p.price < 500) ||
  (price === '500-1000' && p.price >= 500 && p.price <= 1000) ||
  (price === 'o1000' && p.price > 1000);

export interface TypeOption {
  slug: string;
  name: string;
  /** Which category this sub-type belongs to. */
  cat: string;
  /** Disambiguated with the category name when more than one category is in scope. */
  label: string;
}

/** Sub-types offered by the categories currently in scope. */
export function typeOptions(categories: Category[], cats: string[]): TypeOption[] {
  const selected = categories.filter((c) => cats.includes(c.slug));
  return selected.flatMap((c) =>
    (c.subs ?? []).map((t) => ({
      ...t,
      cat: c.slug,
      label: selected.length > 1 ? `${t.name} · ${c.short}` : t.name,
    })),
  );
}

export interface ShopResult {
  /** Products matching only the category + type narrowing — the basis for filter counts. */
  scope: Product[];
  /** Products matching every active filter, sorted. */
  items: Product[];
  typeOpts: TypeOption[];
  /** Types that actually exist in scope (a stale query param is ignored). */
  activeTypes: string[];
}

/** Applies the category/type scope, then the remaining filters, then the sort. */
export function applyFilters(
  products: Product[],
  categories: Category[],
  f: Filters,
  sort: SortKey,
): ShopResult {
  const typeOpts = typeOptions(categories, f.cats);
  const activeTypes = f.types.filter((t) => typeOpts.some((o) => o.slug === t));

  const inCats = (p: Product) => !f.cats.length || f.cats.includes(p.category);
  // A type selection only narrows the categories it belongs to; other categories pass through.
  const typeOk = (p: Product) => {
    if (!activeTypes.length) return true;
    const catHasSelection = typeOpts.some(
      (o) => o.cat === p.category && activeTypes.includes(o.slug),
    );
    return !catHasSelection || (p.type !== null && activeTypes.includes(p.type));
  };

  const scope = products.filter((p) => inCats(p) && typeOk(p));

  const items = scope
    .filter(
      (p) =>
        (!f.sale || p.mrp > p.price) &&
        priceOk(f.price, p) &&
        (!f.colors.length || p.variants.some((v) => f.colors.includes(v.color))) &&
        (!f.inStock || p.variants.some((v) => v.stock > 0)),
    )
    .sort(SORTERS[sort] ?? SORTERS.popular);

  return { scope, items, typeOpts, activeTypes };
}

/** Number of active filters, for the "Clear all" affordance. Categories don't count on a
 *  /category route, where the scope comes from the URL rather than a chosen filter. */
export function countFilters(f: Filters, activeTypes: string[], onCategoryRoute: boolean) {
  return (
    (onCategoryRoute ? 0 : f.cats.length) +
    activeTypes.length +
    (f.price !== 'all' ? 1 : 0) +
    f.colors.length +
    (f.inStock ? 1 : 0) +
    (f.sale ? 1 : 0)
  );
}
