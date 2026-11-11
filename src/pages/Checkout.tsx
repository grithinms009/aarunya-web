import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
import { LockIcon } from '@/components/ui/icons';
import { api, ApiError } from '@/data/api';
import { rememberLastOrder } from '@/lib/lastOrder';
import { STATES } from '@/data/config';
import { useCart } from '@/hooks/useCart';
import { useViewport } from '@/hooks/useViewport';
import { validateBilling, validateOrder, type BillingErrors, type OrderErrors } from '@/lib/validateOrder';
import { isPin, matchState, placeLine } from '@/lib/pin';
import { fmt } from '@/lib/format';
import { fmtPaise } from '@/lib/money';
import { loadRazorpay } from '@/lib/razorpay';
import { BRAND_NAME } from '@/config/businessInfo';
import { useShop, useUi } from '@/store/useStore';
import type { BillingDetails, CartQuote, OrderCustomer } from '@/data/types';
import pill from '@/components/ui/Pill.module.css';
import cls from './Checkout.module.css';

interface FieldDef {
  k: Exclude<keyof OrderCustomer, 'billing'> | keyof BillingDetails;
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

const BILLING: FieldDef[] = [
  { k: 'name', label: 'Billing Name', full: true },
  { k: 'address', label: 'Billing Address', full: true },
  { k: 'city', label: 'City' },
  { k: 'state', label: 'State', select: true },
  { k: 'pin', label: 'PIN Code', inputMode: 'numeric' },
  { k: 'gstin', label: 'GSTIN (optional, for business purchases)', full: true },
];

const BLANK: OrderCustomer = {
  name: '', phone: '', email: '', address: '', house: '', landmark: '', city: '',
  state: 'Kerala', pin: '',
};

const BLANK_BILLING: BillingDetails = { name: '', address: '', city: '', state: 'Kerala', pin: '', gstin: '' };

/** Where a placed order stands. Only the server's answers move it to 'paid' or 'confirming'. */
type PayPhase =
  | 'not_configured' // no gateway keys yet: order placed, payment window opens once live
  | 'ready' // gateway order exists, window not open (dismissed, failed or just placed)
  | 'opening'
  | 'verifying'
  | 'paid'
  | 'confirming'; // verify said the payment is not captured yet

interface PlacedOrder {
  orderId: string;
  token?: string;
  /** Rupees, from the server. */
  amount: number;
  phase: PayPhase;
  payStatus: string;
  notice?: string;
}

const policyLink: React.CSSProperties = {
  color: '#2E2826',
  textDecoration: 'underline',
  textUnderlineOffset: 2,
};

export function Checkout() {
  const cart = useCart();
  const { L } = useViewport();
  const gift = useShop((s) => s.gift);
  const flash = useUi((s) => s.flash);

  const [form, setForm] = useState<OrderCustomer>(BLANK);
  const [errs, setErrs] = useState<OrderErrors>({});
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [billingOn, setBillingOn] = useState(false);
  const [billing, setBilling] = useState<BillingDetails>(BLANK_BILLING);
  const [bErrs, setBErrs] = useState<BillingErrors>({});
  /* The server's total and GST breakup for this bag + delivery state. */
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const customerRef = useRef(form);
  customerRef.current = form;

  const quoteKey = JSON.stringify([
    cart.lines.map((l) => [l.pid, l.vid, l.qty]),
    gift,
    form.state,
    isPin(form.pin) ? form.pin : '',
  ]);
  useEffect(() => {
    if (order || !cart.lines.length) return;
    let live = true;
    setQuoting(true);
    const t = setTimeout(() => {
      api
        .quoteCart(
          cart.lines.map((l) => ({ productId: l.pid, variantId: l.vid, qty: l.qty })),
          gift,
          form.state,
          isPin(form.pin) ? form.pin : undefined,
        )
        .then((q) => {
          if (!live) return;
          setQuote(q);
          /* The server derives the state from the PIN; show it in the dropdown. */
          const st = matchState(q.delivery?.state?.name, STATES);
          if (st) setForm((f) => (isPin(f.pin) && f.pin === q.delivery?.pin && f.state !== st ? { ...f, state: st } : f));
        })
        .catch(() => live && setQuote(null))
        .finally(() => live && setQuoting(false));
    }, 350);
    return () => {
      live = false;
      clearTimeout(t);
    };
    // quoteKey captures lines, gift and state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteKey, !!order]);

  const setB = (k: keyof BillingDetails, value: string) => {
    setBilling((b) => ({ ...b, [k]: k === 'gstin' ? value.toUpperCase() : value }));
    setBErrs((e) => ({ ...e, [k]: '' }));
  };

  const set = (k: keyof OrderCustomer, value: string) => {
    setForm((f) => ({ ...f, [k]: value }));
    setErrs((e) => ({ ...e, [k]: '' }));
  };

  /** Opens Razorpay for an order the server has priced. Amount, key and gateway order id all
   *  come from POST /payments/create; nothing here sets or changes an amount. */
  const startPayment = async (o: { orderId: string; token?: string }) => {
    setOrder((p) => (p ? { ...p, phase: 'opening', notice: undefined } : p));
    try {
      const pay = await api.createPayment({ orderId: o.orderId, token: o.token });
      if (pay.status !== 'CREATED') {
        setOrder((p) => (p ? { ...p, phase: 'not_configured', payStatus: pay.status } : p));
        return;
      }
      await loadRazorpay();
      const c = customerRef.current;
      const Razorpay = window.Razorpay!;
      const rzp = new Razorpay({
        key: pay.keyId,
        order_id: pay.gatewayOrderId,
        amount: pay.amountPaise,
        currency: pay.currency,
        name: BRAND_NAME,
        description: `Order ${pay.orderId}`,
        prefill: { name: c.name, email: c.email, contact: c.phone },
        theme: { color: '#8D3545' },
        handler: (r) => {
          setOrder((p) => (p ? { ...p, phase: 'verifying' } : p));
          api
            .verifyPayment({ orderId: pay.orderId, token: o.token ?? '', ...r })
            .then((v) => {
              if (v.paid) {
                setOrder((p) => (p ? { ...p, phase: 'paid', payStatus: 'paid' } : p));
                return;
              }
              setOrder((p) =>
                p
                  ? v.pending
                    ? { ...p, phase: 'confirming' }
                    : { ...p, phase: 'ready', notice: 'We could not confirm that payment. If money was debited, it will be reconciled or refunded; you can also try again below.' }
                  : p,
              );
            })
            .catch(() =>
              setOrder((p) =>
                p
                  ? { ...p, phase: 'confirming', notice: 'We could not reach our server to confirm your payment. If money was debited, your order will be confirmed shortly; check Track Order before paying again.' }
                  : p,
              ),
            );
        },
        modal: {
          ondismiss: () =>
            setOrder((p) =>
              p && p.phase === 'opening'
                ? { ...p, phase: 'ready', notice: 'The payment window was closed. Your order is saved and unpaid; you can pay now.' }
                : p,
            ),
        },
      });
      rzp.on('payment.failed', (r) =>
        setOrder((p) =>
          p
            ? { ...p, phase: 'ready', notice: `${r.error?.description ?? 'The payment did not go through.'} Your order is still unpaid; you can try again.` }
            : p,
        ),
      );
      rzp.open();
    } catch (err) {
      setOrder((p) =>
        p
          ? { ...p, phase: 'ready', notice: err instanceof Error ? err.message : 'The payment window could not open. Please try again.' }
          : p,
      );
    }
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateOrder(form);
    setErrs(found);
    const bFound = billingOn ? validateBilling(billing) : {};
    setBErrs(bFound);
    if (Object.values(found).some(Boolean) || Object.values(bFound).some(Boolean)) return;

    setPlacing(true);
    try {
      const created = await api.createOrder({
        customer: { ...form, ...(billingOn ? { billing: { ...billing, gstin: billing.gstin.trim() } } : {}) },
        items: cart.lines.map((l) => ({
          productId: l.pid,
          variantId: l.vid,
          qty: l.qty,
        })),
        giftWrap: gift,
      });
      /* Remember it so Track Order fills itself in on this device. */
      if (created.accessToken) {
        rememberLastOrder({ orderId: created.orderId, token: created.accessToken });
      }
      setOrder({ orderId: created.orderId, token: created.accessToken, amount: created.amount, phase: 'opening', payStatus: '' });
      setPlacing(false);
      window.scrollTo(0, 0);
      await startPayment({ orderId: created.orderId, token: created.accessToken });
    } catch (err) {
      setPlacing(false);
      if (err instanceof ApiError && err.fields) {
        const f = err.fields;
        if (f.pin) setErrs((x) => ({ ...x, pin: f.pin }));
        if (f.state) setErrs((x) => ({ ...x, state: f.state }));
        if (f.gstin) setBErrs((x) => ({ ...x, gstin: f.gstin }));
      }
      flash(err instanceof Error && err.message ? err.message : 'Something went wrong. Please try again.');
    }
  };

  /* PIN feedback from the quote, only while it still describes the PIN on screen. */
  const pinLive = isPin(form.pin) && quote?.delivery?.pin !== undefined;
  const pinError = isPin(form.pin) && quote?.delivery && !quoting ? quote.delivery.pinError : '';
  const pinPlace =
    pinLive && !pinError && quote?.delivery?.pin === form.pin
      ? placeLine(quote.delivery.district, quote.delivery.state?.name)
      : '';
  const pinBlocked = !isPin(form.pin) || !!pinError;

  const hasErrors = Object.values(errs).some(Boolean) || Object.values(bErrs).some(Boolean);

  /** One bound input. The delivery fields and the billing fields share this markup. */
  const renderField = (fd: FieldDef, billingField = false) => {
    const id = (billingField ? 'co-bill-' : 'co-') + fd.k;
    const fieldName = billingField ? 'billing_' + fd.k : fd.k;
    const baseErr = (billingField ? bErrs : errs)[fd.k as keyof BillingDetails & keyof OrderCustomer];
    const isDeliveryPin = !billingField && fd.k === 'pin';
    const err = baseErr || (isDeliveryPin ? pinError : '');
    const value = String((billingField ? billing : form)[fd.k as keyof BillingDetails & keyof OrderCustomer] ?? '');
    const onChange = (v: string) =>
      billingField ? setB(fd.k as keyof BillingDetails, v) : set(fd.k as keyof OrderCustomer, v);
    return (
      <div key={fd.k} className={cls.field} style={{ gridColumn: fd.full ? '1 / -1' : 'auto' }}>
        <label htmlFor={id} className={cls.label}>
          {fd.label}
        </label>
        {fd.select ? (
          <select
            id={id}
            name={fieldName}
            autoComplete={billingField ? 'off' : 'address-level1'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
            name={fieldName}
            type={fd.type ?? 'text'}
            inputMode={fd.inputMode}
            autoComplete={fd.autoComplete}
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
        {isDeliveryPin && !err && pinPlace && (
          <span style={{ fontSize: 12.5, color: '#756964' }}>{pinPlace}</span>
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
            {order.phase === 'paid'
              ? `Order ${order.orderId} is confirmed`
              : order.phase === 'confirming'
                ? `Order ${order.orderId}: payment is being confirmed`
                : `Order ${order.orderId} is ready for payment`}
          </h2>
          <p style={{ margin: 0, fontSize: 14.5, color: '#756964', lineHeight: 1.65, maxWidth: '30em' }}>
            {order.phase === 'paid' && `Payment successful. We received ${fmt(order.amount)}.`}
            {order.phase === 'confirming' && `Your payment of ${fmt(order.amount)} is being confirmed. This page does not need to stay open; Track Order will show the result.`}
            {order.phase === 'verifying' && 'Confirming your payment…'}
            {order.phase === 'opening' && `Total ${fmt(order.amount)}. Opening the secure payment window…`}
            {order.phase === 'ready' && `Total ${fmt(order.amount)}. Your order is saved and unpaid until payment is completed.`}
            {order.phase === 'not_configured' && `Total ${fmt(order.amount)}. The secure online payment window will open here once the payment gateway is connected.`}
          </p>
          {order.notice && (
            <p role="alert" style={{ margin: 0, fontSize: 13.5, color: '#8D3545', lineHeight: 1.6, maxWidth: '32em' }}>
              {order.notice}
            </p>
          )}
          {order.phase === 'not_configured' && (
            <code className={cls.payCode}>POST /payments/create → {order.payStatus}</code>
          )}
          {order.phase === 'ready' && (
            <button
              type="button"
              className={cls.submit}
              style={{ maxWidth: 320 }}
              onClick={() => void startPayment(order)}
            >
              Pay {fmt(order.amount)}
            </button>
          )}

          {order.token && (
            <div style={{ marginTop: 4, padding: '14px 16px', background: '#FBF7F4', border: '1px solid #EFE6DF', borderRadius: 10, maxWidth: '34em', textAlign: 'left' }}>
              <strong style={{ display: 'block', fontSize: 14, color: '#2E2826', marginBottom: 4 }}>
                Your tracking code
              </strong>
              <code style={{ display: 'block', wordBreak: 'break-all', fontSize: 13, color: '#2E2826' }}>
                {order.token}
              </code>
              <p style={{ margin: '8px 0 0', fontSize: 13, color: '#756964', lineHeight: 1.6 }}>
                Keep this with your order number — together they let you follow your parcel.
                We have saved them in this browser, so{' '}
                <Link to={`/track-order?order=${encodeURIComponent(order.orderId)}&token=${encodeURIComponent(order.token)}`} style={{ color: '#2E2826' }}>
                  Track Order
                </Link>{' '}
                will already know them here.
              </p>
            </div>
          )}
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
              {CONTACT.map((fd) => renderField(fd))}
            </fieldset>

            <fieldset className={cls.fieldset} style={{ gridTemplateColumns: L.fCols }}>
              <legend className={cls.legend}>Delivery address</legend>
              {ADDRESS.map((fd) => renderField(fd))}
            </fieldset>

            <fieldset className={cls.fieldset} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <legend className={cls.legend}>Billing</legend>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={billingOn}
                  onChange={(e) => {
                    setBillingOn(e.target.checked);
                    if (e.target.checked && !billing.name) {
                      setBilling({ ...BLANK_BILLING, name: form.name, state: form.state });
                    }
                  }}
                  style={{ width: 18, height: 18, accentColor: '#8D3545', margin: 0 }}
                />
                Billing address differs from delivery
              </label>
              {billingOn && (
                <div style={{ display: 'grid', gap: 16, gridTemplateColumns: L.fCols }}>
                  {BILLING.map((fd) => renderField(fd, true))}
                </div>
              )}
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

            <p style={{ margin: '4px 0 0', fontSize: 12.5, lineHeight: 1.7, color: '#756964' }}>
              By placing this order you agree to our{' '}
              <Link to="/terms-and-conditions" style={policyLink}>Terms and Conditions</Link>,{' '}
              <Link to="/privacy-policy" style={policyLink}>Privacy Policy</Link>,{' '}
              <Link to="/shipping-policy" style={policyLink}>Shipping Policy</Link> and{' '}
              <Link to="/refund-and-cancellation-policy" style={policyLink}>
                Refund and Cancellation Policy
              </Link>
              . Payments are processed securely by Razorpay; we never see or store your card
              or UPI details.
            </p>

            <button type="submit" disabled={placing || quoting || pinBlocked} className={cls.submit} style={{ opacity: placing || quoting || pinBlocked ? 0.6 : 1 }}>
              {placing ? 'Placing order…' : `Place Order · ${quote ? fmt(quote.total) : cart.total}`}
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
              <span>{quote ? fmt(quote.subtotal) : cart.subtotal}</span>
            </div>
            <div className={cls.row}>
              <span style={{ color: '#756964' }}>Shipping</span>
              <span style={{ color: cart.shipColor }}>
                {quote ? (quote.shipping === 0 ? 'FREE' : fmt(quote.shipping)) : cart.shipping}
              </span>
            </div>
            {(quote ? quote.giftFee > 0 : cart.gift) && (
              <div className={cls.row} style={{ fontSize: 13.5 }}>
                <span style={{ color: '#756964' }}>Gift wrap</span>
                <span>{quote ? fmt(quote.giftFee) : cart.giftFee}</span>
              </div>
            )}
            {quote?.tax.applied && (
              <>
                <div className={cls.divider} />
                <div className={cls.row} style={{ fontSize: 13, color: '#756964' }}>
                  <span>{quote.tax.priceMode === 'exclusive' ? 'GST added to your total' : 'Includes GST'}</span>
                  <span>{fmtPaise(quote.tax.taxPaise)}</span>
                </div>
                <div className={cls.row} style={{ fontSize: 12.5, color: '#756964' }}>
                  <span>Taxable value</span>
                  <span>{fmtPaise(quote.tax.taxablePaise)}</span>
                </div>
                {quote.tax.taxType === 'intra' ? (
                  <>
                    <div className={cls.row} style={{ fontSize: 12.5, color: '#756964' }}>
                      <span>CGST</span>
                      <span>{fmtPaise(quote.tax.cgstPaise)}</span>
                    </div>
                    <div className={cls.row} style={{ fontSize: 12.5, color: '#756964' }}>
                      <span>{quote.tax.stateTaxLabel}</span>
                      <span>{fmtPaise(quote.tax.sgstPaise)}</span>
                    </div>
                  </>
                ) : (
                  <div className={cls.row} style={{ fontSize: 12.5, color: '#756964' }}>
                    <span>IGST</span>
                    <span>{fmtPaise(quote.tax.igstPaise)}</span>
                  </div>
                )}
                {quote.tax.roundOffPaise !== 0 && (
                  <div className={cls.row} style={{ fontSize: 12.5, color: '#756964' }}>
                    <span>Round off</span>
                    <span>{fmtPaise(quote.tax.roundOffPaise)}</span>
                  </div>
                )}
                <div className={cls.row} style={{ fontSize: 12.5, color: '#756964' }}>
                  <span>Place of supply</span>
                  <span>{quote.tax.placeOfSupply.name} ({quote.tax.placeOfSupply.code})</span>
                </div>
              </>
            )}
            <div className={cls.divider} />
            <div className={cls.row} style={{ fontSize: 17, fontWeight: 500 }}>
              <span>Total</span>
              <span>{quote ? fmt(quote.total) : cart.total}</span>
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
