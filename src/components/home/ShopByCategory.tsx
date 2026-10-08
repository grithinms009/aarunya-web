import { Link } from 'react-router-dom';
import { useCatalog } from '@/hooks/useCatalog';
import { useViewport } from '@/hooks/useViewport';
import { categoryHref } from '@/lib/catalog';
import { SectionTitle } from '@/components/ui/SectionTitle';
import s from './ShopByCategory.module.css';

/** Circular category tiles: 8 columns at >=1180, 4 at >=600, 3 below. */
export function ShopByCategory() {
  const { categories } = useCatalog();
  const { L } = useViewport();

  return (
    <section data-fade style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(40px,6vw,72px) clamp(16px,4vw,40px) 0' }}>
      <SectionTitle>Shop by Category</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: L.catCols, gap: 'clamp(18px,2.4vw,28px) clamp(14px,2vw,24px)' }}>
        {categories.map((c) => (
          <Link key={c.slug} to={categoryHref(c)} className={s.tile}>
            <div className={s.ring}>
              <div className={s.clip} style={{ background: c.tint }}>
                <div
                  role="img"
                  aria-label={c.name}
                  className={s.image}
                  style={{
                    background: c.image
                      ? `center/cover no-repeat url("${c.image}")`
                      : 'repeating-linear-gradient(135deg,rgba(255,255,255,.55) 0 9px,rgba(255,255,255,0) 9px 18px)',
                  }}
                />
              </div>
            </div>
            <span className={s.label}>{c.short}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
