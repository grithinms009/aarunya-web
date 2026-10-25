import { Fragment, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
import { ProductCard } from '@/components/product/ProductCard';
import { ChevronIcon } from '@/components/ui/icons';
import { COLORS, PRICES } from '@/data/config';
import { useCatalog } from '@/hooks/useCatalog';
import { useShopQuery } from '@/hooks/useShopQuery';
import { useViewport } from '@/hooks/useViewport';
import { categoryHref, categoryOf, colorsInScope, hasSubs } from '@/lib/catalog';
import { pieces } from '@/lib/format';
import { applyFilters, countFilters, SORT_LABELS, type SortKey } from '@/lib/shopFilters';
import { useUi } from '@/store/useStore';
import type { ColorKey } from '@/data/types';
import s from './Shop.module.css';

type DdKey = 'type' | 'price' | 'color' | 'stock';

/** Shop and category listings share this screen: breadcrumb, chips, filter popovers,
 *  sort and the product grid. */
export function Shop() {
  const { products, categories, ready } = useCatalog();
  const { isMobile, isDesktop, L } = useViewport();
  const { filters: f, sort, patch, setSort, clearAll, pathCat } = useShopQuery();
  const { dd, setDd } = useUi();

  const { scope, items, typeOpts, activeTypes } = useMemo(
    () => applyFilters(products, categories, f, sort),
    [products, categories, f, sort],
  );

  const onCategoryRoute = !!pathCat;
  const oneCat = f.cats.length === 1 ? categoryOf(categories, f.cats[0]) : null;
  const oneType =
    oneCat && activeTypes.length === 1
      ? (oneCat.subs ?? []).find((t) => t.slug === activeTypes[0])
      : undefined;

  const title = oneType ? oneType.name : oneCat ? oneCat.name : 'All Jewellery';
  const nFilters = countFilters(f, activeTypes, onCategoryRoute);
  const scopeColors = colorsInScope(scope);

  // Chips: sub-types when the category has them, otherwise the category list.
  const chips =
    oneCat && hasSubs(oneCat)
      ? [
          { label: `All ${oneCat.short}`, href: categoryHref(oneCat), active: !activeTypes.length },
          ...(oneCat.subs ?? []).map((t) => ({
            label: t.name,
            href: categoryHref(oneCat, t),
            active: activeTypes.length === 1 && activeTypes[0] === t.slug,
          })),
        ]
      : [
          { label: 'All', href: '/shop', active: !f.cats.length },
          ...categories.map((c) => ({
            label: c.short,
            href: categoryHref(c),
            active: f.cats.length === 1 && f.cats[0] === c.slug,
          })),
        ];

  const priceLabel = PRICES.find(([k]) => k === f.price)?.[1] ?? '';
  const stockBits = [f.inStock && 'In stock', f.sale && 'On sale'].filter(Boolean) as string[];

  const dropdowns: { key: DdKey; label: string; val: string; clear: () => void }[] = [
    ...(typeOpts.length
      ? [
          {
            key: 'type' as DdKey,
            label: 'Product Type',
            val: activeTypes.length ? `· ${activeTypes.length}` : '',
            clear: () => patch({ types: [] }),
          },
        ]
      : []),
    {
      key: 'price',
      label: 'Price',
      val: f.price !== 'all' ? `· ${priceLabel}` : '',
      clear: () => patch({ price: 'all' }),
    },
    {
      key: 'color',
      label: 'Colour',
      val: f.colors.length ? `· ${f.colors.length}` : '',
      clear: () => patch({ colors: [] }),
    },
    {
      key: 'stock',
      label: 'Availability',
      val: stockBits.length ? `· ${stockBits.join(', ')}` : '',
      clear: () => patch({ inStock: false, sale: false }),
    },
  ];

  const toggleType = (slug: string) =>
    patch({
      types: f.types.includes(slug) ? f.types.filter((x) => x !== slug) : [...f.types, slug],
    });

  const toggleColor = (key: ColorKey) =>
    patch({
      colors: f.colors.includes(key) ? f.colors.filter((x) => x !== key) : [...f.colors, key],
    });

  const countText = pieces(items.length);

  return (
    <section style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: 'clamp(22px,4vw,44px) clamp(16px,4vw,40px) clamp(56px,8vw,96px)' }}>
      <Seo title={oneType ? oneType.name : oneCat ? oneCat.name : 'Shop All Jewellery'} />

      <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: '#756964', display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        <Link to="/" style={{ color: '#756964', textDecoration: 'none' }}>
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" style={{ color: '#756964', textDecoration: 'none' }}>
          Shop
        </Link>
        {oneCat && (
          <>
            <span>/</span>
            <Link to={categoryHref(oneCat)} style={{ color: oneType ? '#756964' : '#302722', textDecoration: 'none' }}>
              {oneCat.short}
            </Link>
          </>
        )}
        {oneType && (
          <>
            <span>/</span>
            <span style={{ color: '#302722' }}>{oneType.name}</span>
          </>
        )}
      </nav>

      <h1 style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.05 }}>
        {title}
      </h1>

      <div className={s.chipRow}>
        {chips.map((c) => (
          <Link
            key={c.href + c.label}
            to={c.href}
            aria-current={c.active ? 'page' : undefined}
            className={s.chip}
            style={{
              background: c.active ? '#302722' : '#FFFFFF',
              color: c.active ? 'var(--bg)' : '#302722',
              border: `1px solid ${c.active ? '#302722' : '#EADAD4'}`,
            }}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'block', marginTop: 'clamp(20px,3vw,32px)' }}>
        {/* Click-away layer behind the open popover. */}
        {!!dd && <div aria-hidden="true" onClick={() => setDd('')} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />}

        <div className={s.controls}>
          <div className={s.ddGroup}>
            {dropdowns.map((d) => {
              const open = dd === d.key;
              const active = !!d.val || open;
              return (
                <div key={d.key} style={{ position: isMobile ? 'static' : 'relative' }}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setDd(open ? '' : d.key)}
                    className={s.ddBtn}
                    style={{
                      border: `1px solid ${active ? '#C79A45' : '#EADAD4'}`,
                      background: d.val ? '#FBEFEF' : '#FFFFFF',
                    }}
                  >
                    {d.label}
                    {!!d.val && <span className={s.ddVal}>{d.val}</span>}
                    <ChevronIcon size={11} strokeWidth={1.8} open={open} />
                  </button>

                  {open && (
                    <div
                      role="dialog"
                      aria-label={d.label}
                      className={s.ddPanel}
                      style={{
                        right: isMobile ? 0 : 'auto',
                        width: isMobile ? 'auto' : d.key === 'color' ? 320 : 260,
                      }}
                    >
                      {d.key === 'type' &&
                        typeOpts.map((t) => {
                          const count = products.filter(
                            (p) => p.category === t.cat && p.type === t.slug,
                          ).length;
                          const on = f.types.includes(t.slug);
                          return (
                            <label key={`${t.cat}/${t.slug}`} className={s.optRow} style={{ opacity: count ? 1 : 0.55 }}>
                              <input type="checkbox" checked={on} onChange={() => toggleType(t.slug)} className={s.optInput} />
                              <span style={{ flex: 1 }}>{t.label}</span>
                              <span className={s.optCount}>{count}</span>
                            </label>
                          );
                        })}

                      {d.key === 'price' &&
                        PRICES.map(([key, label]) => (
                          <label key={key} className={s.optRow}>
                            <input
                              type="radio"
                              name="price"
                              checked={f.price === key}
                              onChange={() => patch({ price: key })}
                              className={s.optInput}
                            />
                            <span>{label}</span>
                          </label>
                        ))}

                      {d.key === 'color' && (
                        <div className={s.colorWrap}>
                          {(Object.entries(COLORS) as [ColorKey, (typeof COLORS)[ColorKey]][])
                            .filter(([k]) => scopeColors.has(k) || f.colors.includes(k))
                            .map(([k, c]) => {
                              const on = f.colors.includes(k);
                              return (
                                <button
                                  key={k}
                                  type="button"
                                  aria-pressed={on}
                                  onClick={() => toggleColor(k)}
                                  className={s.colorBtn}
                                  style={{
                                    border: `1px solid ${on ? '#9D762F' : '#EADAD4'}`,
                                    background: on ? '#FBEFEF' : '#FFFFFF',
                                  }}
                                >
                                  <span className={s.colorDot} style={{ background: c.hex }} />
                                  {c.label}
                                </button>
                              );
                            })}
                        </div>
                      )}

                      {d.key === 'stock' && (
                        <>
                          <label className={s.optRow}>
                            <input
                              type="checkbox"
                              checked={f.inStock}
                              onChange={() => patch({ inStock: !f.inStock })}
                              className={s.optInput}
                            />
                            <span>In stock only</span>
                          </label>
                          <label className={s.optRow}>
                            <input
                              type="checkbox"
                              checked={f.sale}
                              onChange={() => patch({ sale: !f.sale })}
                              className={s.optInput}
                            />
                            <span>On sale</span>
                          </label>
                        </>
                      )}

                      {!!d.val && (
                        <button type="button" onClick={d.clear} className={s.clearLink}>
                          Clear
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {nFilters > 0 && (
              <button type="button" onClick={clearAll} className={s.clearAll}>
                Clear all
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {isDesktop && <span style={{ fontSize: 13, color: '#756964' }}>{countText}</span>}
            <label className={s.sortLabel}>
              <span>Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className={s.sortSelect}
              >
                {SORT_LABELS.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {!isDesktop && (
          <p style={{ margin: '-8px 0 18px', fontSize: 12.5, color: '#756964' }}>{countText}</p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: L.prodCols, gap: 'clamp(24px,3vw,36px) clamp(12px,2vw,22px)' }}>
          {items.map((p) => (
            <Fragment key={p.id}>
              <ProductCard product={p} preferredColors={f.colors} />
            </Fragment>
          ))}
        </div>

        {ready && items.length === 0 && (
          <div className={s.empty}>
            <p style={{ margin: 0, fontFamily: "'Jost',sans-serif", fontSize: 19, fontWeight: 500 }}>
              Nothing matches just yet
            </p>
            <p style={{ margin: 0, fontSize: 14, color: '#756964' }}>Try removing a filter or two.</p>
            <button type="button" onClick={clearAll} className={s.emptyBtn}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
