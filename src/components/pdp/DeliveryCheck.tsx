import { CONFIG } from '@/data/config';
import { useDelivery } from '@/hooks/useDelivery';
import { deliveryCopy } from '@/lib/delivery';
import { fmt } from '@/lib/format';
import { Diamond } from '@/components/ui/SectionTitle';
import { PinIcon } from '@/components/ui/icons';

/** PIN-code delivery estimate, plus the standing shipping lines. */
export function DeliveryCheck() {
  const d = useDelivery();
  const copy = d.result?.maxDays !== undefined ? deliveryCopy(d.result.maxDays) : null;

  const thr = CONFIG.FREE_SHIPPING_THRESHOLD;
  const fee = CONFIG.SHIPPING_FEE;
  const shipLines = [
    `${fmt(fee)} shipping on orders below ${fmt(thr)}`,
    `FREE shipping on orders ${fmt(thr)} and above`,
    'Pan India Delivery',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 18px 18px', border: '1px solid rgba(199,154,69,.45)', background: '#FFFCF8' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 12, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', color: '#756964' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"
          style={{ flex: 'none', fill: 'none', stroke: '#8A6527', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
          <path d="M2.5 6.5h11v9h-11z M13.5 9.5h4l3 3v3h-7z" />
          <circle cx="6.5" cy="17" r="1.6" />
          <circle cx="17" cy="17" r="1.6" />
        </svg>
        Check delivery
      </span>

      {!d.result ? (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void d.check(d.pin);
            }}
            style={{ display: 'flex', alignItems: 'stretch', height: 46, borderBottom: `1px solid ${d.error ? '#8D3545' : '#E7D3AE'}` }}
          >
            <label htmlFor="pdp-pin" className="sr-only">
              PIN code
            </label>
            <input
              id="pdp-pin"
              inputMode="numeric"
              maxLength={6}
              autoComplete="postal-code"
              placeholder="Enter your PIN code"
              value={d.pin}
              onChange={(e) => d.onPinChange(e.target.value)}
              aria-invalid={d.error ? true : undefined}
              style={{
                flex: 1, minWidth: 0, border: 'none', background: 'transparent', padding: '0 2px',
                fontFamily: 'inherit', fontSize: 15, color: '#302722', outline: 'none', letterSpacing: '.04em',
              }}
            />
            <button
              type="submit"
              style={{
                flex: 'none', border: 'none', padding: '0 2px 0 16px', background: 'none',
                color: '#8D3545', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600,
                letterSpacing: '.14em', textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              {d.busy ? '…' : 'Check'}
            </button>
          </form>
          {d.error && (
            <span role="alert" style={{ fontSize: 13, color: '#8D3545' }}>
              {d.error}
            </span>
          )}
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, fontSize: 14 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <PinIcon />
              Delivering to <strong style={{ fontWeight: 600 }}>{d.result.pin}</strong>
            </span>
            <button
              type="button"
              onClick={d.change}
              style={{
                border: 'none', background: 'none', padding: '6px 0', fontFamily: 'inherit',
                fontSize: 13, fontWeight: 500, color: '#8D3545', borderBottom: '1px solid #C79A45', cursor: 'pointer',
              }}
            >
              Change
            </button>
          </div>
          {copy && (
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#4A3F3A' }}>
              Arrives by <strong style={{ fontWeight: 600, color: '#8D3545' }}>{copy.date}</strong>. {copy.cut}
            </p>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', fontSize: 12.5, color: '#756964' }}>
        {shipLines.map((line) => (
          <span key={line} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Diamond size={5} />
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
