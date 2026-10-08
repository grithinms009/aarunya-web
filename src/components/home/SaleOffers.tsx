import { Link } from 'react-router-dom';
import { OFFERS } from '@/data/config';
import { discountOf } from '@/lib/format';
import { useCatalog } from '@/hooks/useCatalog';
import { useViewport } from '@/hooks/useViewport';
import { EyebrowTitle } from '@/components/ui/SectionTitle';
import { ArrowRightIcon, FEATURE_ICONS, ICON_PATHS } from '@/components/ui/icons';
import type { PriceKey, Product } from '@/data/types';
import s from './SaleOffers.module.css';

const PROMISES = [
  { d: FEATURE_ICONS[0].d, title: 'Anti-Tarnish', sub: 'Made to keep its shine' },
  { d: FEATURE_ICONS[1].d, title: 'Skin Safe', sub: 'Nickel-free, gentle on skin' },
  { d: FEATURE_ICONS[2].d, title: 'Gift Ready', sub: 'Beautifully packed with love' },
  { d: ICON_PATHS.truck, title: 'Pan India Delivery', sub: 'Free shipping above ₹499' },
];

const matchesPriceKey = (k: PriceKey | 'sale', p: Product) =>
  (k === 'u500' && p.price < 500) ||
  (k === '500-1000' && p.price >= 500 && p.price <= 1000) ||
  (k === 'o1000' && p.price > 1000);

/** Two offer banners (headings baked into the artwork) with live CTAs positioned at each
 *  offer's bx/by percentages, then the white promise strip. The section hides itself when
 *  no offer currently has matching products. */
export function SaleOffers() {
  const { products } = useCatalog();
  const { w, L } = useViewport();

  // "Up to {maxOff}% off" uses the biggest live discount in the catalogue.
  const maxOff = Math.max(0, ...products.map((p) => discountOf(p.price, p.mrp)));

  const items = OFFERS.map((o) => {
    const count = products.filter((p) =>
      o.match === 'sale' ? p.mrp > p.price : matchesPriceKey(o.match, p),
    ).length;
    const badge = o.badge.replace('{maxOff}', String(maxOff));
    return {
      ...o,
      count,
      badge,
      alt: [badge, `${o.title} ${o.accent}`, o.sub, o.cta].filter(Boolean).join('. '),
    };
  }).filter((o) => o.count > 0);

  if (!items.length) return null;

  // Column widths are proportional to the natural image widths so the banners end up the
  // same height when they sit side by side.
  const gridCols =
    w >= 860 && items.length > 1
      ? items.map((o) => `minmax(0,${o.w || 1}fr)`).join(' ')
      : '1fr';

  const wide = w >= 860;
  const divider = '1px solid rgba(141,53,69,.12)';

  return (
    <section data-fade aria-label="Sale and offers" style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(56px,8vw,100px) clamp(16px,4vw,40px) 0' }}>
      <EyebrowTitle
        eyebrow="Limited time · While stocks last"
        size="clamp(32px,4.4vw,50px)"
        lineHeight={1.05}
        rule
        gap={10}
        marginBottom="clamp(22px,3vw,36px)"
        letterSpacing=".24em"
      >
        Sale &amp; <em style={{ color: '#8D3545' }}>Offers</em>
      </EyebrowTitle>

      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 'clamp(10px,1.2vw,18px)', alignItems: 'start' }}>
        {items.map((o) => (
          <Link key={o.image} to={o.href} aria-label={o.alt} className={s.banner}>
            <img src={o.image} alt={o.alt} loading="lazy" className={s.bannerImg} />
            <span
              aria-hidden="true"
              className={`${s.cta} ${o.btn === 'outline' ? s.ctaOutline : s.ctaSolid}`}
              style={{ left: `${o.bx}%`, top: `${o.by}%` }}
            >
              {o.cta}
              <ArrowRightIcon className={s.ctaArrow} />
            </span>
          </Link>
        ))}
      </div>

      <ul aria-label="Our promise" className={s.promise} style={{ gridTemplateColumns: L.otCols }}>
        {PROMISES.map((p, i) => (
          <li
            key={p.title}
            className={s.promiseItem}
            style={{
              borderLeft: (wide ? i > 0 : i % 2 === 1) ? divider : 'none',
              borderTop: !wide && i > 1 ? divider : 'none',
            }}
          >
            <span aria-hidden="true" className={s.promiseIcon}>
              <svg width="26" height="26" viewBox="0 0 24 24"
                style={{ fill: 'none', stroke: '#A4505C', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                <path d={p.d} />
              </svg>
            </span>
            <span className={s.promiseText}>
              <span className={s.promiseTitle}>{p.title}</span>
              <span className={s.promiseSub}>{p.sub}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
