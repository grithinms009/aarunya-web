import { Link } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
import { useCart } from '@/hooks/useCart';
import { useViewport } from '@/hooks/useViewport';
import pill from '@/components/ui/Pill.module.css';
import cls from './CartPage.module.css';

/** The full bag page. The summary aside sticks alongside the lines at >=900px. */
export function CartPage() {
  const cart = useCart();
  const { L } = useViewport();

  return (
    <section style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,40px) clamp(56px,8vw,96px)' }}>
      <Seo title="Your Bag" />
      <h1 style={{ margin: '0 0 clamp(18px,3vw,28px)', fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(34px,5vw,52px)', lineHeight: 1.05 }}>
        Your Bag
      </h1>

      {cart.empty ? (
        <div className={cls.emptyCard}>
          <p style={{ margin: 0, fontFamily: "'Jost',sans-serif", fontSize: 20, fontWeight: 500 }}>
            Your bag is empty
          </p>
          <p style={{ margin: 0, fontSize: 14, color: '#756964' }}>Find something lovely to fill it.</p>
          <Link to="/shop" className={pill.primary} style={{ marginTop: 8 }}>
            Shop Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: L.cartCols, gap: 'clamp(24px,4vw,56px)', alignItems: 'start' }}>
          <div style={{ minWidth: 0 }}>
            <div className={cls.shipCard}>
              <p style={{ margin: 0, fontSize: 13.5 }}>{cart.shipMsg}</p>
              <div className={cls.track}>
                <div className={cls.fill} style={{ width: cart.pct }} />
              </div>
            </div>

            {cart.lines.map((l) => (
              <div key={l.key} className={cls.line}>
                <Link to={l.href} aria-label={l.name} className={cls.thumb} style={{ background: l.bg }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <Link to={l.href} style={{ color: '#302722', textDecoration: 'none', fontSize: 15, lineHeight: 1.35 }}>
                      {l.name}
                    </Link>
                    <span style={{ fontSize: 15, fontWeight: 500, whiteSpace: 'nowrap' }}>{l.total}</span>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#756964' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.hex }} />
                    {l.color} · {l.unit} each
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 6 }}>
                    <div className={cls.stepper}>
                      <button type="button" aria-label="Decrease quantity" onClick={l.dec} className={cls.stepBtn}>
                        −
                      </button>
                      <span style={{ minWidth: 22, textAlign: 'center', fontSize: 14 }}>{l.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={l.inc}
                        disabled={l.atStock}
                        className={cls.stepBtn}
                        style={{ opacity: l.incOpacity }}
                      >
                        +
                      </button>
                    </div>
                    <button type="button" onClick={l.remove} className={cls.removeBtn}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside
            aria-label="Order summary"
            className={cls.summary}
            style={{ position: L.sumPos, top: 104 }}
          >
            <h2 style={{ margin: '0 0 4px', fontFamily: "'Jost',sans-serif", fontWeight: 500, fontSize: 18, letterSpacing: '.01em' }}>
              Summary
            </h2>
            <div className={cls.row}>
              <span style={{ color: '#756964' }}>Subtotal</span>
              <span>{cart.subtotal}</span>
            </div>
            <div className={cls.row}>
              <span style={{ color: '#756964' }}>Shipping</span>
              <span style={{ color: cart.shipColor }}>{cart.shipping}</span>
            </div>
            {cart.gift && (
              <div className={cls.row} style={{ fontSize: 13.5 }}>
                <span style={{ color: '#756964' }}>Gift wrap</span>
                <span>{cart.giftFee}</span>
              </div>
            )}
            <div className={cls.divider} />
            <div className={cls.row} style={{ fontSize: 17, fontWeight: 500 }}>
              <span>Total</span>
              <span>{cart.total}</span>
            </div>
            <Link to="/checkout" className={cls.checkout}>
              Checkout
            </Link>
            <Link to="/shop" style={{ textAlign: 'center', fontSize: 13, color: '#756964', textDecoration: 'none', padding: 6 }}>
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
