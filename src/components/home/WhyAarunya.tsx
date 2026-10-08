import { useViewport } from '@/hooks/useViewport';
import { Diamond, EyebrowTitle } from '@/components/ui/SectionTitle';

const CARDS = [
  { title: 'Anti-tarnish selections', text: 'Pieces that keep their shine through daily wear, with a little care.' },
  { title: 'Carefully chosen designs', text: 'Every design is picked by Veena, one by one.' },
  { title: 'Everyday-friendly pieces', text: 'Light and comfortable, for college, work and family functions.' },
  { title: 'Packed with love', text: 'Wrapped by hand and ready to gift.' },
];

/** Four white cards with a diamond, a Jost title and a muted line.
 *  Four columns at >=900, otherwise two. */
export function WhyAarunya() {
  const { L } = useViewport();
  return (
    <section data-fade style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(56px,8vw,100px) clamp(16px,4vw,40px) 0' }}>
      <EyebrowTitle eyebrow="Why Aarunya">Small brand, a lot of care</EyebrowTitle>
      <div style={{ display: 'grid', gridTemplateColumns: L.whyCols, gap: 'clamp(14px,2vw,24px)' }}>
        {CARDS.map((c) => (
          <div
            key={c.title}
            style={{
              background: '#FFFFFF', border: '1px solid #F0E2DE', borderRadius: 20,
              padding: 'clamp(20px,2.5vw,30px)', display: 'flex', flexDirection: 'column', gap: 12,
              boxShadow: '0 1px 2px rgba(48,39,34,.03)',
            }}
          >
            <Diamond size={8} style={{ margin: '4px 0 2px 2px' }} />
            <h3 style={{ margin: 0, fontFamily: "'Jost',sans-serif", fontWeight: 500, fontSize: 'clamp(16px,1.4vw,18px)', lineHeight: 1.2, letterSpacing: '.01em' }}>
              {c.title}
            </h3>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: '#756964' }}>{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
