import { useViewport } from '@/hooks/useViewport';
import { ICON_PATHS } from '@/components/ui/icons';

const ITEMS = [
  { d: ICON_PATHS.shield, label: 'Anti-Tarnish Jewellery' },
  { d: ICON_PATHS.truck, label: 'Pan India Delivery' },
  { d: ICON_PATHS.gift, label: 'Free Shipping Above ₹499' },
  { d: ICON_PATHS.lock, label: 'Secure Payments' },
];

/** Four reassurance items: a 40px gold-outlined circle icon + a 13px label.
 *  Four columns on desktop, two below. */
export function TrustStrip() {
  const { L } = useViewport();
  return (
    <section aria-label="Why shop with us" style={{ borderBottom: '1px solid #F0E2DE', background: 'var(--bg)' }}>
      <div
        style={{
          maxWidth: 1280, margin: '0 auto',
          padding: 'clamp(18px,3vw,26px) clamp(16px,4vw,40px)',
          display: 'grid', gridTemplateColumns: L.trustCols, gap: '16px 12px',
        }}
      >
        {ITEMS.map((t) => (
          <div
            key={t.label}
            style={{ display: 'flex', alignItems: 'center', justifyContent: L.trustJustify, gap: 12, minWidth: 0 }}
          >
            <span
              style={{
                flex: 'none', width: 40, height: 40, borderRadius: '50%',
                border: '1px solid #E7D3AE', display: 'grid', placeItems: 'center', color: '#9D762F',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"
                style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                <path d={t.d} />
              </svg>
            </span>
            <span style={{ fontSize: 13, lineHeight: 1.35, color: '#302722' }}>{t.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
