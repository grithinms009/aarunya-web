/* Track Your Order.
 *
 * Order numbers are sequential, so they are not a secret and are never enough on their own.
 * Looking up an order needs the access token issued at checkout, which the backend checks
 * in constant time. The token for the most recent order is remembered in this browser, so
 * the usual case is one click; anyone else needs the link from their confirmation.
 *
 * None of this security lives in the browser — the API refuses the request without a
 * matching token, and answers a wrong token exactly as it answers a missing order.
 */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { P, PolicyLink, PolicyPage, Section } from '@/components/ui/Policy';
import { api, type OrderTracking } from '@/data/api';
import { fmt } from '@/lib/format';
import { readLastOrder } from '@/lib/lastOrder';
import { RETURNS, SHIPPING, SUPPORT } from '@/config/businessInfo';

const INK = '#2E2826';
const MUTED = '#756964';

const field: React.CSSProperties = {
  width: '100%', padding: '11px 13px', border: '1px solid #E3D9D2', borderRadius: 8,
  background: '#fff', font: 'inherit', fontSize: 15, color: INK,
};

const STEPS: [string, string][] = [
  ['new', 'Order placed'],
  ['packed', 'Packed'],
  ['shipped', 'Shipped'],
  ['out', 'Out for delivery'],
  ['delivered', 'Delivered'],
];

export function TrackOrder() {
  const [params] = useSearchParams();
  const remembered = readLastOrder();

  const [orderNo, setOrderNo] = useState(params.get('order') ?? remembered?.orderId ?? '');
  const [token, setToken] = useState(params.get('token') ?? remembered?.token ?? '');
  const [data, setData] = useState<OrderTracking | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const look = async (no: string, tk: string) => {
    setBusy(true);
    setError('');
    try {
      setData(await api.trackOrder(no.trim(), tk.trim()));
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : 'We could not find that order.');
    } finally {
      setBusy(false);
    }
  };

  /* A link straight from the confirmation carries both parts, so look it up at once. */
  useEffect(() => {
    const o = params.get('order');
    const t = params.get('token');
    if (o && t) void look(o, t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stepIndex = data ? STEPS.findIndex(([s]) => s === data.status) : -1;
  const cancelled = data?.status === 'cancelled';

  return (
    <PolicyPage
      title="Track Your Order"
      path="/track-order"
      description="Follow your Aarunya order and its India Post tracking number."
      intro={
        <P>
          Enter your order number and the tracking code from your order confirmation. If you
          ordered on this device, we have filled them in for you.
        </P>
      }
    >
      <Section h="Find your order">
        <form
          onSubmit={(e) => { e.preventDefault(); void look(orderNo, token); }}
          style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', alignItems: 'end' }}
        >
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5, color: MUTED }}>
            Order number
            <input
              value={orderNo} onChange={(e) => setOrderNo(e.target.value)}
              placeholder="AJ1001" style={field} autoComplete="off"
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5, color: MUTED }}>
            Tracking code
            <input
              value={token} onChange={(e) => setToken(e.target.value)}
              placeholder="From your order confirmation" style={field} autoComplete="off"
            />
          </label>
          <button
            type="submit"
            disabled={busy || !orderNo.trim() || !token.trim()}
            style={{
              padding: '12px 26px', border: 'none', borderRadius: 999, background: INK,
              color: '#fff', font: 'inherit', fontSize: 14, letterSpacing: '.04em',
              cursor: busy ? 'default' : 'pointer',
              opacity: busy || !orderNo.trim() || !token.trim() ? 0.6 : 1,
            }}
          >
            {busy ? 'Checking…' : 'Track order'}
          </button>
        </form>

        {error && (
          <div role="alert" style={{ marginTop: 14, padding: '14px 16px', background: '#FBE9E7', border: '1px solid #F0CFC9', borderRadius: 10, fontSize: 14 }}>
            {error} Please check both values against your confirmation, or write to{' '}
            {SUPPORT.email ?? 'our support address'} and we will look it up for you.
          </div>
        )}
      </Section>

      {data && (
        <>
          <Section h={`Order ${data.orderId}`}>
            <P>
              Placed {new Date(data.placedAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
              })} · {fmt(data.total)} · payment {data.payment}
            </P>

            {cancelled ? (
              <P><strong style={{ color: INK }}>This order was cancelled.</strong></P>
            ) : (
              <ol style={{ margin: '6px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {STEPS.map(([key, label], i) => {
                  const done = i <= stepIndex;
                  return (
                    <li key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span
                        aria-hidden="true"
                        style={{
                          width: 10, height: 10, borderRadius: '50%', flex: '0 0 auto',
                          background: done ? '#B08D57' : '#E3D9D2',
                        }}
                      />
                      <span style={{ color: done ? INK : MUTED, fontSize: 15 }}>
                        {label}
                        {i === stepIndex && ' — current'}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </Section>

          <Section h="What is in it">
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {data.items.map((l, i) => (
                <li key={i}>
                  {l.name} · {l.color} × {l.qty} — {fmt(l.price * l.qty)}
                </li>
              ))}
            </ul>
          </Section>

          <Section h="Delivery">
            {data.shipment ? (
              <>
                <P>
                  Sent with {data.shipment.courier || SHIPPING.courier}. Consignment number{' '}
                  <strong style={{ color: INK }}>{data.shipment.awb}</strong>.
                </P>
                {data.shipment.trackingUrl && (
                  <P>
                    <a
                      href={data.shipment.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: INK, textDecoration: 'underline', textUnderlineOffset: 3 }}
                    >
                      Track it on the courier's website
                    </a>
                  </P>
                )}
                <P style={{ fontSize: 13.5 }}>
                  Tracking can take a day to start updating after dispatch, which is normal.
                </P>
              </>
            ) : (
              <P>
                Your parcel has not been handed to {SHIPPING.courier} yet. The consignment
                number appears here as soon as it is dispatched.
              </P>
            )}
          </Section>

          {data.returnRequest ? (
            <Section h="Your replacement request">
              <P>
                Request {data.returnRequest.id} — currently{' '}
                <strong style={{ color: INK }}>{data.returnRequest.status}</strong>. We will
                be in touch at the number on your order.
              </P>
            </Section>
          ) : (
            data.status === 'delivered' && (
              <ReplacementRequest orderNo={data.orderId} token={token} onDone={() => void look(orderNo, token)} />
            )
          )}
        </>
      )}

      <Section h="Lost your tracking code?">
        <P>
          It is in the confirmation we showed you after payment. If you cannot find it,
          write to {SUPPORT.email ?? 'our support address'} from the email address on the
          order, or call {SUPPORT.phone ?? 'our support number'}, and we will send it
          again. We cannot show order details to someone who only has an order number.
        </P>
      </Section>
    </PolicyPage>
  );
}

/** Raises a replacement request against a delivered order. */
function ReplacementRequest({
  orderNo, token, onDone,
}: {
  orderNo: string;
  token: string;
  onDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) { setError('Please tell us what went wrong.'); return; }
    setBusy(true);
    setError('');
    try {
      await api.requestReplacement(orderNo, token, { reason, note });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Your request could not be sent.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section h="Something wrong with this order?">
      {RETURNS.windowDays > 0 && (
        <P>
          Replacements can be requested within {RETURNS.windowDays} days of delivery. See{' '}
          <PolicyLink to="/returns-and-replacements">Returns and Replacements</PolicyLink> for
          what we will need from you.
        </P>
      )}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            alignSelf: 'flex-start', padding: '11px 22px', borderRadius: 999,
            border: '1px solid #2E2826', background: 'transparent', color: INK,
            font: 'inherit', fontSize: 14, cursor: 'pointer',
          }}
        >
          Request a replacement
        </button>
      ) : (
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5, color: MUTED }}>
            What went wrong?
            <input
              value={reason}
              onChange={(e) => { setReason(e.target.value); setError(''); }}
              placeholder="e.g. Arrived damaged"
              style={field}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5, color: MUTED }}>
            Anything else we should know?
            <textarea
              value={note} onChange={(e) => setNote(e.target.value)} rows={3}
              style={{ ...field, resize: 'vertical' }}
            />
          </label>
          <P style={{ fontSize: 13.5 }}>
            We will reply on the number on your order to ask for photographs
            {RETURNS.requiresUnboxingVideo ? ' and your unboxing video' : ''}. Please do not
            post anything back until we confirm.
          </P>
          {error && <span role="alert" style={{ color: '#A33', fontSize: 14 }}>{error}</span>}
          <button
            type="submit"
            disabled={busy}
            style={{
              alignSelf: 'flex-start', padding: '12px 26px', border: 'none', borderRadius: 999,
              background: INK, color: '#fff', font: 'inherit', fontSize: 14,
              cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.65 : 1,
            }}
          >
            {busy ? 'Sending…' : 'Send request'}
          </button>
        </form>
      )}
    </Section>
  );
}
