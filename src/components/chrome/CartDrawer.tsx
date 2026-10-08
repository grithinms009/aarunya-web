import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useUi } from '@/store/useStore';
import { CloseIcon } from '@/components/ui/icons';
import s from './Overlay.module.css';

/** Slides in from the right. Free-shipping nudge, line items with qty steppers, money
 *  summary, then Checkout / View bag. */
export function CartDrawer() {
  const { cartOpen, closeAll } = useUi();
  const cart = useCart();

  return (
    <>
      <div
        aria-hidden="true"
        onClick={closeAll}
        className={s.scrim}
        style={{ zIndex: 80, opacity: cartOpen ? 1 : 0, pointerEvents: cartOpen ? 'auto' : 'none' }}
      />
      <aside
        role="dialog"
        aria-label="Shopping bag"
        className={`${s.panel} ${s.cart}`}
        style={{
          transform: cartOpen ? 'none' : 'translateX(100%)',
          visibility: cartOpen ? 'visible' : 'hidden',
        }}
      >
        <div className={s.cartHead}>
          <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 26 }}>
            Your Bag{' '}
            <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 13, color: '#756964' }}>
              ({cart.count})
            </span>
          </h2>
          <button type="button" aria-label="Close bag" onClick={closeAll} className={s.closeBtn}>
            <CloseIcon />
          </button>
        </div>

        <div style={{ padding: '14px 22px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 14px', background: '#FBEFEF', borderRadius: 14 }}>
            <p style={{ margin: 0, fontSize: 13 }}>{cart.shipMsg}</p>
            <div style={{ height: 4, background: '#F4D8DC', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: cart.pct, background: '#C79A45', transition: 'width .4s' }} />
            </div>
          </div>
        </div>

        <div className={s.cartBody}>
          {cart.empty && (
            <div style={{ textAlign: 'center', padding: '56px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <p style={{ margin: 0, fontFamily: "'Jost',sans-serif", fontSize: 19, fontWeight: 500 }}>
                Your bag is empty
              </p>
              <Link
                to="/shop"
                onClick={closeAll}
                style={{ marginTop: 6, minHeight: 46, display: 'inline-flex', alignItems: 'center', padding: '0 24px', borderRadius: 999, border: '1px solid #C79A45', color: '#302722', textDecoration: 'none', fontSize: 13.5 }}
              >
                Start shopping
              </Link>
            </div>
          )}

          {cart.lines.map((l) => (
            <div key={l.key} style={{ display: 'grid', gridTemplateColumns: '72px minmax(0,1fr)', gap: 14, padding: '16px 0', borderBottom: '1px solid #F0E2DE' }}>
              <Link
                to={l.href}
                aria-label={l.name}
                onClick={closeAll}
                style={{ display: 'block', aspectRatio: '4/5', borderRadius: 12, border: '1px solid #F0E2DE', background: l.bg }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <Link to={l.href} onClick={closeAll} style={{ color: '#302722', textDecoration: 'none', fontSize: 14, lineHeight: 1.35 }}>
                    {l.name}
                  </Link>
                  <span style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap' }}>{l.total}</span>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#756964' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.hex }} />
                  {l.color}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                  <div className={s.stepper}>
                    <button type="button" aria-label="Decrease quantity" onClick={l.dec} className={s.stepBtn}>
                      −
                    </button>
                    <span style={{ minWidth: 20, textAlign: 'center', fontSize: 14 }}>{l.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={l.inc}
                      disabled={l.atStock}
                      className={s.stepBtn}
                      style={{ opacity: l.incOpacity }}
                    >
                      +
                    </button>
                  </div>
                  <button type="button" onClick={l.remove} className={s.removeBtn} style={{ fontSize: 12 }}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.has && (
          <div className={s.cartFoot}>
            <div className={s.rowBetween} style={{ fontSize: 13.5 }}>
              <span style={{ color: '#756964' }}>Subtotal</span>
              <span>{cart.subtotal}</span>
            </div>
            <div className={s.rowBetween} style={{ fontSize: 13.5 }}>
              <span style={{ color: '#756964' }}>Shipping</span>
              <span style={{ color: cart.shipColor }}>{cart.shipping}</span>
            </div>
            {cart.gift && (
              <div className={s.rowBetween} style={{ fontSize: 13.5 }}>
                <span style={{ color: '#756964' }}>Gift wrap</span>
                <span>{cart.giftFee}</span>
              </div>
            )}
            <div className={s.rowBetween} style={{ fontSize: 16, fontWeight: 500 }}>
              <span>Total</span>
              <span>{cart.total}</span>
            </div>
            <Link to="/checkout" onClick={closeAll} className={s.checkoutBtn} style={{ marginTop: 4 }}>
              Checkout
            </Link>
            <Link
              to="/cart"
              onClick={closeAll}
              style={{ textAlign: 'center', fontSize: 13, color: '#756964', textDecoration: 'none', padding: 4 }}
            >
              View bag
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
