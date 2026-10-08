import { COLORS } from '@/data/config';
import type { Category, ColorKey, Product, ResolvedVariant } from '@/data/types';

/** Joins each variant with its colour definition (label / hex / tint). */
export const resolveVariants = (p: Product): ResolvedVariant[] =>
  (p.variants || []).map((v) => ({
    ...(COLORS[v.color] ?? { label: v.color, hex: '#ccc', tint: '#eee' }),
    ...v,
  }));

/** Index of the first in-stock variant — the default selection on a product page. */
export const firstInStock = (p: Product | undefined) => {
  if (!p) return 0;
  const i = p.variants.findIndex((v) => v.stock > 0);
  return i < 0 ? 0 : i;
};

/** Falls back to a generic category so an unknown slug still renders. */
export const categoryOf = (categories: Category[], slug: string): Category =>
  categories.find((c) => c.slug === slug) ?? {
    slug,
    name: 'Jewellery',
    short: 'Jewellery',
    ph: 'jewellery',
    tint: '#FBEFEF',
  };

export const hasSubs = (c: Category) => !!(c.subs && c.subs.length);

/** Path for a category, optionally narrowed to a sub-type. */
export const categoryHref = (c: Pick<Category, 'slug'>, t?: { slug: string }) =>
  `/category/${c.slug}` + (t ? `/${t.slug}` : '');

export const productHref = (p: Pick<Product, 'slug'>) => `/product/${p.slug}`;

/** Colours present across a set of products — used to limit the colour filter to what's in scope. */
export const colorsInScope = (products: Product[]) =>
  new Set<ColorKey>(products.flatMap((p) => p.variants.map((v) => v.color)));
