import { useUi } from '@/store/useStore';

/** Bottom-centre status toast: fades in, rises 10px, auto-hides after 2.2s (see store). */
export function Toast({ raised }: { raised: boolean }) {
  const toast = useUi((s) => s.toast);
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: raised ? 92 : 90,
        transform: `translateX(-50%) translateY(${toast ? '0' : '10px'})`,
        opacity: toast ? 1 : 0,
        transition: 'opacity .3s, transform .3s',
        zIndex: 95,
        background: '#302722',
        color: 'var(--bg)',
        fontSize: 13,
        padding: '12px 20px',
        borderRadius: 999,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {toast}
    </div>
  );
}
