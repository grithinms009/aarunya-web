import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
import { Caret, PdpBreadcrumb } from '@/components/ui/Breadcrumb';
import { Diamond } from '@/components/ui/SectionTitle';
import { HeartIcon } from '@/components/ui/icons';
import { Gallery, type GalleryView } from '@/components/pdp/Gallery';
import { GiftWrap } from '@/components/pdp/GiftWrap';
import { DeliveryCheck } from '@/components/pdp/DeliveryCheck';
import { PairItUp } from '@/components/pdp/PairItUp';
import { ProductRow } from '@/components/home/ProductRow';
import { CONTENT, VIEWS } from '@/data/config';
import { useCatalog } from '@/hooks/useCatalog';
import { useViewport } from '@/hooks/useViewport';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import { bgOf, discountOf, fmt } from '@/lib/format';
import { categoryOf, firstInStock, resolveVariants } from '@/lib/catalog';
import { useShop, useUi } from '@/store/useStore';
import cls from './ProductPage.module.css';

type TabKey = 'details' | 'material' | 'care' | 'shipping' | 'returns';

export function ProductPage() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const { products, categories, ready } = useCatalog();
  const { w, isDesktop, isMobile } = useViewport();
  const add = useShop((s) => s.add);
  const wish = useShop((s) => s.wish);
  const toggleWish = useShop((s) => s.toggleWish);
  const { openCart, flash, setStickyBar } = useUi();

  const product = products.find((p) => p.slug === slug);

  const [vi, setVi] = useState(0);
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabKey>('details');

  const infoRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLElement>(null);
  const tabPanelRef = useRef<HTMLDivElement>(null);

  // Default to the first in-stock colour whenever the product changes.
  useEffect(() => {
    setVi(firstInStock(product));
    setImg(0);
    setQty(1);
    setTab('details');
  }, [product]);

  // The sticky bottom bar only exists on mobile product pages.
  useEffect(() => {
    setStickyBar(isMobile && !!product);
    return () => setStickyBar(false);
  }, [isMobile, product, setStickyBar]);

  // Info column children stagger in, 70ms apart.
  useEffect(() => {
    if (!product || prefersReducedMotion()) return;
    const info = infoRef.current;
    if (!info) return;
    const raf = requestAnimationFrame(() => {
      Array.from(info.children).forEach((child, i) => {
        (child as HTMLElement).animate?.(
          [
            { opacity: 0, transform: 'translate3d(0,16px,0)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 760, delay: 120 + i * 70, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' },
        );
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [product]);

  // Tab content fades up on change.
  const firstTab = useRef(true);
  useEffect(() => {
    if (firstTab.current) {
      firstTab.current = false;
      return;
    }
    const el = tabPanelRef.current;
    if (!el?.animate || prefersReducedMotion()) return;
    el.animate(
      [
        { opacity: 0, transform: 'translate3d(0,8px,0)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' },
    );
  }, [tab]);

  const variants = useMemo(() => (product ? resolveVariants(product) : []), [product]);

  if (ready && !product) {
    return (
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '96px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <Seo title="Page not found" />
        <h1 style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 36 }}>
          We couldn’t find that piece
        </h1>
        <Link
          to="/shop"
          style={{ minHeight: 48, display: 'inline-flex', alignItems: 'center', padding: '0 26px', borderRadius: 999, background: '#8D3545', color: '#FFF9F6', textDecoration: 'none', fontSize: 14 }}
        >
          Browse the shop
        </Link>
      </section>
    );
  }

  if (!product) return null;

  const cat = categoryOf(categories, product.category);
  const variant = variants[Math.min(vi, variants.length - 1)] ?? variants[0];
  const off = discountOf(product.price, product.mrp);
  const sold = variant?.stock === 0;
  const maxQty = Math.min(variant?.stock ?? 1, 10);
  const wished = wish.includes(product.id);

  const views: GalleryView[] = VIEWS.map((view, i) => ({
    img: variant?.images[i],
    alt: `${product.name} in ${variant?.label}, ${view} view`,
    label: `${cat.ph} · ${variant?.label.toLowerCase()} · ${view}`,
    tint: variant?.tint ?? '#FBEFEF',
    bg: bgOf(variant, i),
  }));

  const stockText = sold
    ? `${variant.label} is sold out`
    : variant.stock <= 3
      ? `Only ${variant.stock} left in ${variant.label}`
      : 'In stock, ready to ship';
  const stockColor = sold ? '#8D3545' : variant.stock <= 3 ? '#8A6527' : '#3E7B5C';
  const stockHalo = sold
    ? 'rgba(141,53,69,.12)'
    : variant.stock <= 3
      ? 'rgba(138,101,39,.14)'
      : 'rgba(62,123,92,.14)';

  const tabs: { key: TabKey; tab: string; title: string; lines: string[] }[] = [
    { key: 'details', tab: 'Details', title: 'Description & Details', lines: [`Available in: ${variants.map((x) => x.label).join(', ')}.`] },
    { key: 'material', tab: 'Material', title: 'Material', lines: [product.material, 'Anti-tarnish finish for everyday wear. Nickel-free.'] },
    { key: 'care', tab: 'Care', title: 'Care Instructions', lines: CONTENT.care },
    {
      key: 'shipping', tab: 'Shipping', title: 'Shipping & Delivery',
      lines: ['₹60 shipping on orders below ₹499.', 'FREE shipping on orders ₹499 and above.', 'Pan India Delivery.', ...CONTENT.delivery],
    },
    { key: 'returns', tab: 'Returns', title: 'Returns / Exchange', lines: CONTENT.returns },
  ];
  const activeTab = tabs.find((t) => t.key === tab) ?? tabs[0];

  const specs = [
    ['Material', product.material],
    ['Finish', 'Anti-tarnish, nickel-free'],
    ['Colours', variants.map((x) => x.label).join(', ')],
    ['Category', cat.name],
  ].filter(([, v]) => !!v) as [string, string][];

  // Same category first, then featured pieces from elsewhere, capped at four.
  const related = [
    ...products.filter((x) => x.category === product.category && x.id !== product.id),
    ...products.filter((x) => x.featured && x.category !== product.category && x.id !== product.id),
  ].slice(0, 4);

  const onWish = () => {
    const had = toggleWish(product.id);
    flash(had ? 'Removed from wishlist' : 'Saved to your wishlist ♡');
  };

  const addToCart = () => {
    if (sold || !variant) return;
    add(product, variant.id, qty);
    openCart();
  };

  const buyNow = () => {
    if (sold || !variant) return;
    add(product, variant.id, qty);
    navigate('/checkout');
  };

  const toDetails = () => {
    setTab('details');
    const el = tabsRef.current;
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - (isDesktop ? 96 : 76),
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    }
  };

  const gridCols = w >= 860 ? 'minmax(0,500px) minmax(0,400px)' : 'minmax(0,520px)';
  const tabCols = w >= 860 ? 'minmax(0,1.15fr) minmax(0,1fr)' : '1fr';

  return (
    <>
      <Seo title={product.name} description={product.description} product={product} />

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: 'clamp(16px,3vw,28px) clamp(16px,4vw,40px) 0' }}>
        <PdpBreadcrumb>
          <Link to="/" style={{ color: '#756964', textDecoration: 'none' }}>
            Home
          </Link>
          <Caret />
          <Link to={`/category/${cat.slug}`} style={{ color: '#756964', textDecoration: 'none' }}>
            {cat.short}
          </Link>
          <Caret />
          <span style={{ color: '#302722' }}>{product.name}</span>
        </PdpBreadcrumb>

        <div style={{ display: 'grid', gridTemplateColumns: gridCols, justifyContent: 'center', gap: 'clamp(28px,5.5vw,72px)', alignItems: 'start' }}>
          <Gallery
            views={views}
            index={img}
            onIndex={setImg}
            off={off}
            wished={wished}
            onWish={onWish}
            wishLabel={wished ? 'Saved to wishlist' : 'Save to wishlist'}
            variantKey={variant?.id ?? ''}
          />

          <div ref={infoRef} className={cls.info}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to={`/category/${cat.slug}`} className={cls.catLink}>
                {cat.name}
              </Link>
              <h1 className={cls.title}>{product.name}</h1>
              <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px 12px', marginTop: 4 }}>
                <span style={{ fontSize: 20, fontWeight: 500, letterSpacing: '.02em' }}>{fmt(product.price)}</span>
                {off > 0 && (
                  <>
                    <s style={{ fontSize: 15, color: '#8B7E77' }}>{fmt(product.mrp)}</s>
                    <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#8D3545' }}>
                      {off}% off
                    </span>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px 16px', fontSize: 13, color: '#756964' }}>
                <span>Inclusive of all taxes</span>
                <span role="status" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 500, color: stockColor }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: stockColor, boxShadow: `0 0 0 3px ${stockHalo}` }} />
                  {stockText}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px 24px', paddingTop: 20, borderTop: '1px solid #EFE3D3' }}>
              <div role="radiogroup" aria-label="Colour" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 13.5, color: '#756964' }}>
                  Colour: <span style={{ color: '#302722', fontWeight: 500 }}>{variant?.label}</span>
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginLeft: -4 }}>
                  {variants.map((sw, i) => {
                    const on = i === vi;
                    const swSold = sw.stock === 0;
                    return (
                      <button
                        key={sw.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        aria-label={`${sw.label}${swSold ? ', sold out' : ''}`}
                        title={sw.label}
                        onClick={() => {
                          setVi(i);
                          setImg(0);
                          setQty(1);
                        }}
                        className={cls.swatch}
                        style={{ border: `1px solid ${on ? '#9D762F' : 'transparent'}` }}
                      >
                        <span className={cls.swatchDot} style={{ background: sw.hex, opacity: swSold ? 0.45 : 1 }} />
                        {swSold && <span aria-hidden="true" className={cls.soldLine} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 13.5, color: '#756964' }}>Quantity</span>
                <div className={cls.qtyBox} style={{ opacity: sold ? 0.5 : 1 }}>
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className={cls.qtyBtn}>
                    −
                  </button>
                  <span aria-live="polite" aria-label="Quantity" style={{ minWidth: 28, textAlign: 'center', fontSize: 15, fontWeight: 500 }}>
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => Math.min(Math.max(maxQty, 1), q + 1))}
                    className={cls.qtyBtn}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button type="button" onClick={addToCart} disabled={sold} className={cls.addBtn} style={{ opacity: sold ? 0.45 : 1 }}>
                Add to Cart
              </button>
              <button type="button" onClick={buyNow} disabled={sold} className={cls.buyBtn} style={{ opacity: sold ? 0.45 : 1 }}>
                Buy Now
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button type="button" onClick={onWish} aria-pressed={wished} className={cls.textBtn}>
                <HeartIcon size={18} fill={wished ? '#8D3545' : 'none'} stroke="#8D3545" strokeWidth={1.6} />
                {wished ? 'Saved to wishlist' : 'Save to wishlist'}
              </button>

              <GiftWrap />

              <button type="button" onClick={toDetails} className={cls.textBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"
                  style={{ flex: 'none', fill: 'none', stroke: '#8A6527', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                  <path d="M6 4h9l4 4v12H6z M14 4v5h5 M9 13h7 M9 16.5h5" />
                </svg>
                Product details &amp; care
              </button>
            </div>

            <DeliveryCheck />
          </div>
        </div>
      </section>

      <section ref={tabsRef} aria-label="Product information" style={{ maxWidth: 1080, margin: '0 auto', padding: 'clamp(48px,7vw,88px) clamp(16px,4vw,40px) 0' }}>
        <div role="tablist" aria-label="Product information" className={cls.tablist}>
          {tabs.map((t) => {
            const on = t.key === tab;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t.key)}
                className={cls.tab}
                style={{
                  borderBottom: `2px solid ${on ? '#C79A45' : 'transparent'}`,
                  color: on ? '#302722' : '#756964',
                }}
              >
                {t.tab}
              </button>
            );
          })}
        </div>

        <div ref={tabPanelRef} role="tabpanel" aria-label={activeTab.title} style={{ paddingTop: 'clamp(24px,3vw,36px)' }}>
          {tab === 'details' ? (
            <div style={{ display: 'grid', gridTemplateColumns: tabCols, gap: 'clamp(28px,5vw,80px)', alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
                <h3 style={{ margin: 0, fontFamily: "'Jost',sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', color: '#756964' }}>
                  About this piece
                </h3>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.8, color: '#4A3F3A', maxWidth: '62ch' }}>
                  {product.description}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <h3 style={{ margin: '0 0 4px', fontFamily: "'Jost',sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', color: '#756964' }}>
                  Specifications
                </h3>
                <dl style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
                  {specs.map(([k, v]) => (
                    <div key={k} className={cls.specRow}>
                      <dt style={{ color: '#756964' }}>{k}</dt>
                      <dd style={{ margin: 0, textAlign: 'right', fontWeight: 500, color: '#302722' }}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: '72ch' }}>
              {activeTab.lines.map((line, i) => (
                <p key={i} className={cls.accLine}>
                  <Diamond size={5} style={{ marginTop: '.7em' }} />
                  <span>{line}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      <PairItUp product={product} currentVariant={variant} />

      <section data-fade style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(56px,8vw,96px) clamp(16px,4vw,40px) clamp(56px,8vw,96px)' }}>
        <h2 style={{ margin: '0 0 clamp(18px,3vw,30px)', fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(28px,3.6vw,40px)', lineHeight: 1.1 }}>
          You May Also Love
        </h2>
        <ProductRow items={related} />
      </section>

      {isMobile && (
        <div className={cls.stickyBar}>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, padding: '0 4px' }}>
            <span style={{ fontSize: 16, fontWeight: 500 }}>{fmt(product.price)}</span>
            <span style={{ fontSize: 11, color: '#756964' }}>{variant?.label}</span>
          </div>
          <button type="button" onClick={addToCart} disabled={sold} className={cls.stickyAdd} style={{ opacity: sold ? 0.45 : 1 }}>
            Add to Cart
          </button>
          <button type="button" onClick={buyNow} disabled={sold} className={cls.stickyBuy} style={{ opacity: sold ? 0.45 : 1 }}>
            Buy Now
          </button>
        </div>
      )}
    </>
  );
}
