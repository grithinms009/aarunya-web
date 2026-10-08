import { Link } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { useCatalog } from '@/hooks/useCatalog';
import { useViewport } from '@/hooks/useViewport';
import { categoryHref } from '@/lib/catalog';
import { pieces } from '@/lib/format';
import cls from './Collections.module.css';

/** Grid of every category with its image, name and piece count. */
export function Collections() {
  const { products, categories } = useCatalog();
  const { L } = useViewport();

  return (
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(28px,5vw,56px) clamp(16px,4vw,40px) clamp(56px,8vw,96px)' }}>
      <Seo title="Collections" />
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Collections' }]} marginBottom={14} />
      <h1 style={{ margin: '0 0 8px', fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(34px,5vw,54px)', lineHeight: 1.05 }}>
        Collections
      </h1>
      <p style={{ margin: '0 0 clamp(24px,4vw,40px)', color: '#756964', fontSize: 14.5 }}>
        Every piece is anti-tarnish, chosen for everyday wear.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: L.gridCats, gap: 'clamp(14px,2vw,24px)' }}>
        {categories.map((c) => {
          const count = products.filter((p) => p.category === c.slug).length;
          return (
            <Link key={c.slug} to={categoryHref(c)} className={cls.tile}>
              <div className={cls.frame} style={{ background: c.tint }}>
                <div
                  role="img"
                  aria-label={c.name}
                  className={cls.image}
                  style={{
                    background: c.image
                      ? `center/cover no-repeat url("${c.image}")`
                      : 'repeating-linear-gradient(135deg,rgba(255,255,255,.55) 0 9px,rgba(255,255,255,0) 9px 18px)',
                  }}
                >
                  {!c.image && <span className={cls.ph}>{c.ph} · category photo</span>}
                </div>
              </div>
              <div className={cls.meta}>
                <span className={cls.name}>{c.name}</span>
                <span className={cls.count}>{pieces(count)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
