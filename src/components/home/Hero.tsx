import { Link } from 'react-router-dom';
import { useViewport } from '@/hooks/useViewport';
import { HeroOrnament } from '@/components/ui/SectionTitle';
import { BANNERS } from '@/data/config';
import s from './Hero.module.css';

/* Used only until the admin uploads its own artwork. */
const FALLBACK_SRC = '/assets/aarunya-hero-pastel.jpg';
const FALLBACK_ALT =
  'Hi, I am Aarunya. A little heart with a big love for beautiful things. Illustration of a little girl in a magenta silk pavada with gold bangles, beside a jewellery box of jasmine.';

/** At >=900px the artwork shows at natural size with the CTAs overlaid on it and a visually
 *  hidden H1. Below that the image is full-width and heading, intro and buttons stack under it. */
export function Hero() {
  const { w } = useViewport();
  const overlay = w >= 900;
  /* The phone image is optional; the desktop one stands in when it is not set. */
  const src = (!overlay && BANNERS.heroMobile) || BANNERS.heroDesktop || FALLBACK_SRC;
  const alt = BANNERS.heroAlt || FALLBACK_ALT;

  const imgStyle: React.CSSProperties = overlay
    ? {
        display: 'block', width: 'auto', height: 'auto', maxWidth: '100%',
        maxHeight: 'max(460px, calc(100vh - 150px))',
      }
    : { width: '100%', height: 'auto', display: 'block' };

  return (
    <section aria-label="Welcome" className={s.section}>
      <div className={s.frame}>
        <div className={s.inner}>
          <img src={src} alt={alt} style={imgStyle} />
          <div aria-hidden="true" className={s.fadeLeft} />
          <div aria-hidden="true" className={s.fadeRight} />
          <div aria-hidden="true" className={s.fadeBottom} />

          {overlay && (
            <>
              <h1 className="sr-only">
                Aarunya Jewels by Veena: little treasures, chosen with love.
              </h1>
              <div className={s.overlayCtas}>
                <Link to="/shop" className={`${s.pill} ${s.primary}`}>
                  Shop Now
                </Link>
                <Link to="/collections" className={`${s.pill} ${s.outline}`}>
                  Explore Collections
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {!overlay && (
        <div className={s.below}>
          <HeroOrnament />
          <h1 style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(32px,7vw,46px)', lineHeight: 1.05, textWrap: 'balance', maxWidth: '12em' }}>
            Little treasures, chosen with love.
          </h1>
          <p style={{ margin: 0, maxWidth: '30em', fontSize: 15, lineHeight: 1.7, color: '#756964', fontWeight: 300 }}>
            Aarunya Jewels by Veena brings you beautiful anti-tarnish jewellery made for everyday
            moments, little celebrations and everything in between.
          </p>
          <div className={s.belowCtas}>
            <Link to="/shop" className={`${s.pill} ${s.primary} ${s.belowPill} ${s.belowPrimary}`}>
              Shop Now
            </Link>
            <Link to="/collections" className={`${s.pill} ${s.outline} ${s.belowPill} ${s.belowOutline}`}>
              Explore Collections
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
