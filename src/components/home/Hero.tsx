import { Link } from 'react-router-dom';
import { useViewport } from '@/hooks/useViewport';
import { BANNERS } from '@/data/config';
import s from './Hero.module.css';

/* The shipped artwork, in two cuts.
 *
 * Wide: 2:1, the girl right of centre, a floral spray at each edge, and a clear blush
 * field between the left spray and her, which is where the wording sits. Phone: 1:1, the
 * girl centred and framed by the florals. Neither has any wording painted into it. */
const ARTWORK = '/assets/hero-desktop.jpg';
const ARTWORK_MOBILE = '/assets/hero-mobile.jpg';
const ARTWORK_ALT =
  'Aarunya, a little girl in a magenta silk pavada with gold bangles, among jasmine '
  + 'and blossom.';

/**
 * The hero.
 *
 * The artwork is always shown whole. Its frame keeps the picture's own shape (2:1 wide,
 * 1:1 on a phone) and only changes size, so nothing is cropped away and she is never
 * blown up past the first screen. Its edges fade into the paper colour around it.
 *
 * The heading, sentence and buttons are real HTML. On a wide screen they sit in the
 * picture's clear field, placed and sized in proportion to the picture, so they stay in
 * that field at every width. On a phone they sit below the picture.
 */
export function Hero() {
  const { w } = useViewport();
  /* Below the desktop width the clear field is too narrow for the words. */
  const stacked = w < 1024;

  /* Anything the shop uploads through Banners & homepage replaces the artwork. Uploads
     should keep the same shapes and the same clear field on the left of the wide cut. */
  const custom = (stacked && BANNERS.heroMobile) || BANNERS.heroDesktop || '';
  const src = custom || (stacked ? ARTWORK_MOBILE : ARTWORK);
  const alt = BANNERS.heroAlt || ARTWORK_ALT;

  const copy = (
    <div className={s.copy}>
      <p className={s.eyebrow}>Handpicked in Kerala</p>

      <h1 className={s.heading}>
        Little treasures, <em>chosen with love.</em>
      </h1>

      <p className={s.sub}>
        Anti-tarnish jewellery that keeps its shine — for festivals, gifting and every day.
      </p>

      <div className={s.actions}>
        <Link to="/shop" className={s.primary}>
          Shop now
        </Link>
        <Link to="/collections" className={s.quiet}>
          Explore collections
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className={s.arrow}>
            <path
              d="M5 12h14M13 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );

  return (
    <section aria-label="Welcome" className={stacked ? `${s.section} ${s.stacked}` : s.section}>
      <div className={s.art}>
        <img src={src} alt={alt} className={s.image} />
        <div aria-hidden="true" className={s.fade} />
        {/* Wide: the words over the clear field of the picture */}
        {!stacked && copy}
      </div>
      {/* Phone: the words below the picture */}
      {stacked && copy}
    </section>
  );
}
