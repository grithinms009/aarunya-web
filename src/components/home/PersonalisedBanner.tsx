import { useViewport } from '@/hooks/useViewport';
import { whatsappUrl } from '@/lib/format';
import { BANNERS } from '@/data/config';
import { SUPPORT } from '@/config/businessInfo';
import s from './PersonalisedBanner.module.css';

const FALLBACK_ALT =
  'Made just for you. Personalised Gift, anti-tarnish jewellery, personalised with love. Cream jewellery box engraved with Aarunya, holding gold necklaces and rings.';

/** At >=760px the banner is the supplied artwork (heading baked in) with a live, positioned
 *  WhatsApp CTA sized in container units so it tracks the image. Below 760px the same content
 *  is rebuilt in HTML next to a photo.
 *
 *  The baked-in text is acceptable for launch; see the handoff note about asking the designer
 *  for text-free artwork later so the heading can be real markup. */
export function PersonalisedBanner() {
  const image = BANNERS.personalised || '/assets/personalised-banner.jpg';
  const mobile = BANNERS.personalisedMobile || '/assets/personalised-gift-box-v2.jpg';
  const alt = BANNERS.personalisedAlt || FALLBACK_ALT;
  const cta = BANNERS.personalisedCta || 'Personalise Your Gift';
  const { w } = useViewport();
  /* Until WhatsApp is confirmed, the CTA goes to Contact Us rather than a dead chat. */
  const href = SUPPORT.whatsapp ? whatsappUrl() : '/contact-us';

  return (
    <section data-fade style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(48px,7vw,88px) clamp(16px,4vw,40px) 0' }}>
      {w >= 760 ? (
        <div className={s.imageWrap}>
          <img src={image} alt={alt} loading="lazy" className={s.image} />
          <a href={href} target="_blank" rel="noopener" className={s.liveCta}>
            {cta}{' '}
            <span aria-hidden="true" className={s.arrow}>
              →
            </span>
          </a>
        </div>
      ) : (
        <div className={s.htmlWrap}>
          <div className={s.htmlText}>
            <span className={s.eyebrow}>Made just for you</span>
            <h2 className={s.heading}>
              Personalised <span className={s.headingAccent}>Gift</span>
            </h2>
            <span className={s.sub}>Anti-Tarnish Jewellery</span>
            <div aria-hidden="true" className={s.divider}>
              <span className={s.dividerLine} />
              <svg width="14" height="13" viewBox="0 0 24 22" style={{ fill: '#C79A45' }}>
                <path d="M12 21.5 10.3 20C4.2 14.5 0 10.8 0 6.3 0 2.7 2.8 0 6.4 0c2 0 4 .9 5.6 2.5C13.6.9 15.6 0 17.6 0 21.2 0 24 2.7 24 6.3c0 4.5-4.2 8.2-10.3 13.7L12 21.5z" />
              </svg>
              <span className={s.dividerLine} />
            </div>
            <span className={s.script}>Personalised with Love</span>
            <a href={href} target="_blank" rel="noopener" className={s.darkCta}>
              {cta}{' '}
              <span aria-hidden="true" style={{ fontSize: 16 }}>
                →
              </span>
            </a>
          </div>
          <div className={s.photo}>
            <img
              src={mobile}
              alt="Cream jewellery box engraved with Aarunya, holding gold necklaces and rings"
              loading="lazy"
              className={s.photoImg}
            />
          </div>
        </div>
      )}
    </section>
  );
}
