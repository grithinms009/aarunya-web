import { Link } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
import { ProductCard } from '@/components/product/ProductCard';
import { useCatalog } from '@/hooks/useCatalog';
import { useViewport } from '@/hooks/useViewport';
import { useShop } from '@/store/useStore';

/** Saved pieces, or the empty state. */
export function Wishlist() {
  const { products, ready } = useCatalog();
  const { L } = useViewport();
  const wish = useShop((s) => s.wish);

  // Keep the shopper's saved order rather than the catalogue order.
  const saved = wish.map((id) => products.find((p) => p.id === id)).filter((p) => !!p);

  return (
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,40px) clamp(56px,8vw,96px)' }}>
      <Seo title="Wishlist" />
      <h1 style={{ margin: '0 0 clamp(18px,3vw,30px)', fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(34px,5vw,52px)', lineHeight: 1.05 }}>
        Wishlist
      </h1>

      {ready && saved.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: '#FBEFEF', borderRadius: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <p style={{ margin: 0, fontFamily: "'Jost',sans-serif", fontSize: 20, fontWeight: 500 }}>
            Nothing saved yet
          </p>
          <p style={{ margin: 0, fontSize: 14, color: '#756964' }}>
            Tap the heart on any piece to keep it here.
          </p>
          <Link
            to="/shop"
            style={{ marginTop: 8, minHeight: 50, display: 'inline-flex', alignItems: 'center', padding: '0 28px', borderRadius: 999, background: '#8D3545', color: 'var(--bg)', textDecoration: 'none', fontSize: 14 }}
          >
            Shop Now
          </Link>
        </div>
      )}

      {saved.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: L.prodCols, gap: 'clamp(24px,3vw,36px) clamp(12px,2vw,24px)' }}>
          {saved.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
