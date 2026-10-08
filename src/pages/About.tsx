import { Seo } from '@/components/ui/Seo';
import { useViewport } from '@/hooks/useViewport';
import { Eyebrow } from '@/components/ui/SectionTitle';

/** Illustration + the brand story. Copy is final (prototype ~line 990). */
export function About() {
  const { w } = useViewport();
  // The illustration is shown at its natural size on wide screens, as on the home hero.
  const imgStyle: React.CSSProperties =
    w >= 900
      ? { display: 'block', width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: 'max(460px, calc(100vh - 150px))' }
      : { width: '100%', height: 'auto', display: 'block' };

  return (
    <section
      style={{
        maxWidth: 1180, margin: '0 auto',
        padding: 'clamp(24px,5vw,64px) clamp(16px,4vw,40px) clamp(56px,8vw,96px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(28px,4vw,48px)',
      }}
    >
      <Seo title="About Us" />
      <div style={{ width: '100%', borderRadius: 'clamp(16px,2.4vw,28px)', overflow: 'hidden', background: '#FCF0EE', display: 'flex', justifyContent: 'center' }}>
        <img src="/assets/aarunya-hero-pastel.jpg" alt="Illustration of Aarunya" loading="lazy" style={imgStyle} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 680, textAlign: 'center', alignItems: 'center' }}>
        <Eyebrow>About us</Eyebrow>
        <h1 style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(34px,4.6vw,54px)', lineHeight: 1.05, textWrap: 'balance' }}>
          A little jewellery box from Kerala
        </h1>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.75, color: '#756964' }}>
          Aarunya Jewels by Veena began at home, with a simple wish: jewellery that looks lovely,
          feels light and stays bright through everyday wear.
        </p>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.75, color: '#756964' }}>
          Every piece is picked by Veena and is anti-tarnish, so you can wear it to college, to
          work, to a cousin’s wedding, or simply because you feel like it.
        </p>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.75, color: '#756964' }}>
          Aarunya is the little girl in our story: a small heart with a big love for beautiful
          things.
        </p>
        <p style={{ margin: '6px 0 0', fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 24, color: '#8D3545' }}>
          With love, Veena ♡
        </p>
      </div>
    </section>
  );
}
