import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '@/hooks/useCatalog';
import { bgOf, fmt } from '@/lib/format';
import { categoryHref, categoryOf, productHref, resolveVariants } from '@/lib/catalog';
import { useUi } from '@/store/useStore';
import { CloseIcon } from '@/components/ui/icons';
import s from './Overlay.module.css';

/** Most results shown at once. */
const MAX_RESULTS = 8;

/** Drops from the top and autofocuses. Empty query shows category quick links; results match
 *  on product name + category name, case-insensitive. */
export function SearchOverlay() {
  const { searchOpen, closeAll } = useUi();
  const { products, categories } = useCatalog();
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
    // Clear the query once the overlay has closed so it reopens empty.
    setQ('');
  }, [searchOpen]);

  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!query) return [];
    return products
      .filter((p) =>
        (p.name + ' ' + categoryOf(categories, p.category).name).toLowerCase().includes(query),
      )
      .slice(0, MAX_RESULTS)
      .map((p) => ({
        id: p.id,
        name: p.name,
        href: productHref(p),
        price: fmt(p.price),
        bg: bgOf(resolveVariants(p)[0]),
      }));
  }, [query, products, categories]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={closeAll}
        className={s.scrim}
        style={{ zIndex: 88, opacity: searchOpen ? 1 : 0, pointerEvents: searchOpen ? 'auto' : 'none' }}
      />
      <div
        role="dialog"
        aria-label="Search"
        className={`${s.panel} ${s.search}`}
        style={{
          transform: searchOpen ? 'none' : 'translateY(-105%)',
          visibility: searchOpen ? 'visible' : 'hidden',
        }}
      >
        <div className={s.searchInner}>
          <div className={s.searchRow}>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"
              style={{ flex: 'none', fill: 'none', stroke: '#756964', strokeWidth: 1.4, strokeLinecap: 'round' }}>
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4.5 4.5" />
            </svg>
            <label htmlFor="search-q" className="sr-only">
              Search jewellery
            </label>
            <input
              id="search-q"
              ref={inputRef}
              type="search"
              placeholder="Search necklaces, jhumkas, rings…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className={s.searchInput}
            />
            <button type="button" aria-label="Close search" onClick={closeAll} className={s.closeBtn}>
              <CloseIcon />
            </button>
          </div>

          {!query && (
            <div className={s.quickLinks}>
              {categories.map((c) => (
                <Link key={c.slug} to={categoryHref(c)} className={s.quickLink} onClick={closeAll}>
                  {c.short}
                </Link>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {results.map((r) => (
              <Link key={r.id} to={r.href} className={s.result} onClick={closeAll}>
                <span style={{ aspectRatio: '4/5', borderRadius: 8, background: r.bg, border: '1px solid #F0E2DE' }} />
                <span style={{ fontSize: 14.5 }}>{r.name}</span>
                <span style={{ fontSize: 14 }}>{r.price}</span>
              </Link>
            ))}
          </div>

          {!!query && results.length === 0 && (
            <p style={{ margin: '18px 0 0', fontSize: 14, color: '#756964' }}>
              No pieces match “{q}”.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
