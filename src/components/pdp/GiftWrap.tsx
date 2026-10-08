import { CONFIG } from '@/data/config';
import { fmt } from '@/lib/format';
import { useViewport } from '@/hooks/useViewport';
import { useShop, useUi } from '@/store/useStore';

/** "Wrap it with love" — a dashed card that turns solid wine once gift wrap is on.
 *  The setting persists across the order. */
export function GiftWrap() {
  const { w } = useViewport();
  const gift = useShop((s) => s.gift);
  const setGift = useShop((s) => s.setGift);
  const flash = useUi((s) => s.flash);

  const fee = CONFIG.GIFT_WRAP_FEE;

  const toggle = () => {
    const on = !gift;
    setGift(on);
    flash(on ? 'Gift wrap added to your order ♡' : 'Gift wrap removed');
  };

  return (
    <div
      style={{
        position: 'relative', overflow: 'hidden', display: 'flex', flexWrap: 'wrap',
        alignItems: 'center', gap: '10px 12px', minHeight: 64, margin: '8px 0',
        padding: '14px 58px 14px 16px', border: '1px solid rgba(199,154,69,.45)', background: '#FFFCF8',
      }}
    >
      {/* Decorative ribbon spine and bow on the right edge of the card. */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, bottom: 0, right: 22, width: 10,
          background:
            'linear-gradient(90deg,#B9848D 0 1px,#F2DCDF 1px calc(100% - 1px),#B9848D calc(100% - 1px))',
        }}
      />
      <svg aria-hidden="true" width="34" height="26" viewBox="0 0 34 26"
        style={{ position: 'absolute', right: 10, top: '50%', marginTop: -13, overflow: 'visible' }}>
        <path
          d="M17 13C13 6.5 5 5 5 10.5S12.5 16 17 13Z M17 13C21 6.5 29 5 29 10.5S21.5 16 17 13Z"
          style={{ fill: '#FBEFEF', stroke: '#8D3545', strokeWidth: 1.2, strokeLinejoin: 'round' }}
        />
        <path d="M15.5 14.5L12 23 M18.5 14.5L22 23" style={{ fill: 'none', stroke: '#8D3545', strokeWidth: 1.2, strokeLinecap: 'round' }} />
        <rect x="15" y="11" width="4" height="4" rx="1" style={{ fill: '#8D3545' }} />
      </svg>

      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"
        style={{ flex: 'none', fill: 'none', stroke: '#8A6527', strokeWidth: 1.5, strokeLinejoin: 'round' }}>
        <path d="M4 10h16v10H4z M3 7h18v3H3z M12 7v13 M12 7c-1.5-3-5-3.5-5-1.2C7 7 9.5 7 12 7z M12 7c1.5-3 5-3.5 5-1.2C17 7 14.5 7 12 7z" />
      </svg>

      <div style={{ flex: '1 1 112px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ fontSize: 12.5, fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Wrap it with love
        </span>
        <span style={{ fontSize: 13, color: '#756964', lineHeight: 1.4 }}>
          {gift
            ? 'Your order will be gift-wrapped with a handwritten note.'
            : 'Hand-wrapped with a ribbon and a little note.'}
        </span>
      </div>

      <button
        type="button"
        aria-pressed={gift}
        onClick={toggle}
        style={{
          flex: 'none', marginLeft: w < 520 ? 30 : 0, display: 'inline-flex', alignItems: 'center',
          gap: 6, minHeight: 36, padding: '0 14px',
          border: `1px ${gift ? 'solid' : 'dashed'} ${gift ? '#8D3545' : '#D9A3AD'}`,
          background: gift ? '#8D3545' : 'rgba(255,255,255,.7)',
          color: gift ? '#FFF9F6' : '#8D3545',
          fontFamily: 'inherit', fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
          whiteSpace: 'nowrap', transition: 'background .25s, color .25s',
        }}
      >
        {gift ? '✓ Added' : fee ? `+ Gift wrap · ${fmt(fee)}` : '+ Gift wrap'}
      </button>
    </div>
  );
}
