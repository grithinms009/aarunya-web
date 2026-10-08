import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
import { LockIcon } from '@/components/ui/icons';
import { api } from '@/data/api';
import { STATES } from '@/data/config';
import { useCart } from '@/hooks/useCart';
import { useViewport } from '@/hooks/useViewport';
import { validateOrder, type OrderErrors } from '@/lib/validateOrder';
import { useShop, useUi } from '@/store/useStore';
import type { OrderCustomer } from '@/data/types';
import pill from '@/components/ui/Pill.module.css';
import cls from './Checkout.module.css';

interface FieldDef {
  k: keyof OrderCustomer;
  label: string;
  type?: string;
  inputMode?: 'text' | 'numeric' | 'email' | 'tel';
  autoComplete?: string;
  /** Spans both columns in the two-column layout. */
  full?: boolean;
  select?: boolean;
}

const CONTACT: FieldDef[] = [
  { k: 'name', label: 'Full Name', autoComplete: 'name', full: true },
  { k: 'phone', label: 'Mobile Number', type: 'tel', inputMode: 'numeric', autoComplete: 'tel' },
  { k: 'email', label: 'Email', type: 'email', inputMode: 'email', autoComplete: 'email' },
];

const ADDRESS: FieldDef[] = [
  { k: 'address', label: 'Address', autoComplete: 'address-line1', full: true },
  { k: 'house', label: 'Apartment / House', autoComplete: 'address-line2' },
  { k: 'landmark', label: 'Landmark (optional)' },
  { k: 'city', label: 'City', autoComplete: 'address-level2' },
  { k: 'state', label: 'State', select: true },
  { k: 'pin', label: 'PIN Code', inputMode: 'numeric', autoComplete: 'postal-code' },
];

const BLANK: OrderCustomer = {
  name: '', phone: '', email: '', address: '', house: '', landmark: '', city: '',
  state: 'Kerala', pin: '',
};

export function Checkout() {
  const cart = useCart();
  const { L } = useViewport();
  const gift = useShop((s) => s.gift);
  const flash = useUi((s) => s.flash);

  const [form, setForm] = useState<OrderCustomer>(BLANK);
  const [errs, setErrs] = useState<OrderErrors>({});
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<{ orderId: string; payStatus: string } | null>(null);

  const set = (k: keyof OrderCustomer, value: string) => {
    setForm((f) => ({ ...f, [k]: value }));
    setErrs((e) => ({ ...e, [k]: '' }));
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateOrder(form);
    setErrs(found);
    if (Object.keys(found).some((k) => found[k as keyof OrderCustomer])) return;

    setPlacing(true);
    try {
      const created = await api.createOrder({
        customer: form,
        items: cart.lines.map((l) => ({
          productId: l.pid,
          variantId: l.vid,
          qty: l.qty,
        })),
        subtotal: cart.raw.subtotal,
        shipping: cart.raw.shipping,
        giftWrap: gift,
        giftFee: cart.raw.giftFee,
        total: cart.raw.total,
      });
      // In production, open the Razorpay/Cashfree checkout here with this payload and
      // handle its success and failure callbacks.
      const pay = await api.createPayment({ orderId: created.orderId, amount: cart.raw.total });
      setOrder({ orderId: created.orderId, payStatus: pay.status });
      setPlacing(false);
      window.scrollTo(0, 0);
    } catch {
      setPlacing(false);
      flash('Something went wrong. Please try again.');
    }
  };

  const hasErrors = Object.values(errs).some(Boolean);

  const renderField = (fd: FieldDef) => {
    const id = 'co-' + fd.k;
    const err = errs[fd.k];
    return (
      <div key={fd.k} className={cls.field} style={{ gridColumn: fd.full ? '1 / -1' : 'auto' }}>
        <label htmlFor={id} className={cls.label}>
          {fd.label}
        </label>
        {fd.select ? (
          <select
            id={id}
            name={fd.k}
            autoComplete="address-level1"
            value={form[fd.k]}
            onChange={(e) => set(fd.k, e.target.value)}
            aria-invalid={err ? true : undefined}
            className={cls.select}
            style={{ border: `1px solid ${err ? '#8D3545' : '#E3CFC8'}` }}
          >
            {STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            name={fd.k}
            type={fd.type ?? 'text'}
            inputMode={fd.inputMode}
            autoComplete={fd.autoComplete}
            value={form[fd.k]}
            onChange={(e) => set(fd.k, e.target.value)}
            aria-invalid={err ? true : undefined}
            className={cls.input}
            style={{ border: `1px solid ${err ? '#8D3545' : '#E3CFC8'}` }}
          />
        )}
        {err && (
          <span role="alert" className={cls.err}>
            {err}
          </span>
        )}
      </div>
    );
  };

  return (
    <section style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,40px) clamp(56px,8vw,96px)' }}>
      <Seo title="Checkout" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 'clamp(18px,3vw,30px)' }}>
        <h1 style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(34px,5vw,52px)', lineHeight: 1.05 }}>
          Checkout
        </h1>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#756964' }}>
          <LockIcon />
          Secure checkout
        </span>
      </div>

      {!order && cart.empty && (
        <div className={cls.emptyCard}>
          <p style={{ margin: 0, fontFamily: "'Jost',sans-serif", fontSize: 20, fontWeight: 500 }}>
            Your bag is empty
          </p>
          <Link to="/shop" className={pill.primary} style={{ marginTop: 8 }}>
            Shop Now
          </Link>
        </div>
      )}

      {order && (
        <div role="status" className={cls.doneCard}>
          <span style={{ fontFamily: "'Jost',sans-serif", fontStyle: 'italic', fontSize: 15, color: '#8D3545', fontWeight: 500, letterSpacing: '.04em' }}>
            Thank you ♡
          </span>
          <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(28px,4vw,38px)' }}>
            Order {order.orderId} is ready for payment
          </h2>
          <p style={{ margin: 0, fontSize: 14.5, color: '#756964', lineHeight: 1.65, maxWidth: '30em' }}>
            Total {cart.total}. The secure online payment window will open here once the payment
            gateway is connected.
          </p>
          <code className={cls.payCode}>POST /payments/create → {order.payStatus}</code>
          <Link
            to="/shop"
            style={{ marginTop: 6, minHeight: 50, display: 'inline-flex', alignItems: 'center', padding: '0 28px', borderRadius: 999, border: '1px solid #C79A45', color: '#302722', textDecoration: 'none', fontSize: 14 }}
          >
            Back to shop
          </Link>
        </div>
      )}

      {!order && cart.has && (
        <div className={cls.grid} style={{ gridTemplateColumns: L.cartCols }}>
          <form onSubmit={placeOrder} noValidate className={cls.form}>
            <fieldset className={cls.fieldset} style={{ gridTemplateColumns: L.fCols }}>
              <legend className={cls.legend}>Contact</legend>
              {CONTACT.map(renderField)}
            </fieldset>

            <fieldset className={cls.fieldset} style={{ gridTemplateColumns: L.fCols }}>
              <legend className={cls.legend}>Delivery address</legend>
              {ADDRESS.map(renderField)}
            </fieldset>

            <fieldset className={cls.fieldset} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <legend className={cls.legend}>Payment</legend>
              <label className={cls.payCard}>
                <input type="radio" name="pay" checked readOnly style={{ width: 18, height: 18, accentColor: '#8D3545', margin: '2px 0 0' }} />
                <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 15 }}>Online Payment</span>
                  <span style={{ fontSize: 13, color: '#756964', lineHeight: 1.5 }}>
                    UPI, cards, net banking and wallets, through our secure payment partner.
                  </span>
                </span>
              </label>
            </fieldset>

            {hasErrors && (
              <p role="alert" style={{ margin: 0, fontSize: 13, color: '#8D3545' }}>
                Please check the highlighted fields.
              </p>
            )}

            <button type="submit" disabled={placing} className={cls.submit} style={{ opacity: placing ? 0.6 : 1 }}>
              {placing ? 'Placing order…' : `Place Order · ${cart.total}`}
            </button>
          </form>

          <aside
            aria-label="Order summary"
            className={cls.summary}
            style={{ order: L.sumOrder, position: L.sumPos, top: 104 }}
          >
            <h2 style={{ margin: 0, fontFamily: "'Jost',sans-serif", fontWeight: 500, fontSize: 18, letterSpacing: '.01em' }}>
              Order summary
            </h2>
            {cart.lines.map((l) => (
              <div key={l.key} className={cls.sumLine}>
                <div className={cls.sumThumb} style={{ background: l.bg }}>
                  <span className={cls.qtyBadge}>{l.qty}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <span style={{ fontSize: 13.5, lineHeight: 1.3 }}>{l.name}</span>
                  <span style={{ fontSize: 12, color: '#756964' }}>{l.color}</span>
                </div>
                <span style={{ fontSize: 13.5 }}>{l.total}</span>
              </div>
            ))}
            <div className={cls.divider} />
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
            <p style={{ margin: 0, fontSize: 12.5, color: '#756964', background: '#FBEFEF', borderRadius: 10, padding: '10px 12px' }}>
              {cart.shipMsg}
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
