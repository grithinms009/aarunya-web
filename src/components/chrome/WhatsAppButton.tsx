import { whatsappUrl } from '@/lib/format';
import { useViewport } from '@/hooks/useViewport';
import { WhatsAppIcon } from '@/components/ui/icons';
import s from './WhatsAppButton.module.css';

/** Bottom-right floating button. The "Chat with us" label shows on desktop only, and the
 *  button lifts above the sticky PDP bar on mobile product pages. */
export function WhatsAppButton({ liftedForStickyBar }: { liftedForStickyBar: boolean }) {
  const { isDesktop } = useViewport();
  const showLabel = isDesktop;

  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener"
      aria-label="Chat with Aarunya Jewels on WhatsApp"
      className={s.fab}
      style={{
        bottom: liftedForStickyBar
          ? 'calc(84px + env(safe-area-inset-bottom))'
          : 'calc(16px + env(safe-area-inset-bottom))',
        padding: showLabel ? '0 20px' : '0',
      }}
    >
      <WhatsAppIcon />
      {showLabel && <span style={{ fontSize: 14, letterSpacing: '.02em' }}>Chat with us</span>}
    </a>
  );
}
