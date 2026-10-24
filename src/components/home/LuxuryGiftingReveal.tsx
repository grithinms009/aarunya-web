import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BANNERS } from '@/data/config';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import s from './LuxuryGiftingReveal.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* The campaign artwork, used exactly as supplied: full frame, native ratio, never cropped
   and never stretched. The admin's Banners & homepage images take precedence when set. */
const ARTWORK = '/assets/gift-full.jpg';
const ARTWORK_W = 1983;
const ARTWORK_H = 793;
const ARTWORK_ALT =
  'The Art of Gifting — a little box of love. An open jewellery box of fine gold chains '
  + 'and rings, with satin ribbon, spring flowers and a wrapped gift.';

/** Gifting has no collection of its own yet, so this points at a route that exists. */
const CTA_HREF = '/collections';
const CTA_LABEL = 'Explore Gifting';

/**
 * Where the printed button sits on the artwork, as a share of its 1983 × 793 frame.
 *
 * Percentages rather than pixels on purpose: the frame scales with the viewport and with
 * the reveal itself, and a proportional hotspot stays locked to the printed button
 * through both. Re-measure only if the artwork is redrawn.
 */
const CTA_HOTSPOT = { left: '16.6%', top: '67.8%', width: '17.2%', height: '8.8%' };

/**
 * LuxuryGiftingReveal — an editorial unveil for the gifting campaign.
 *
 * The artwork does not move; the frame around it does. It arrives at 80% width with a
 * 24px radius and a soft shadow, as though matted in a gallery, then widens to the full
 * column as you scroll while the radius tightens to 10px and the shadow draws in. The
 * expansion is scrubbed against scroll position rather than fired once, so it tracks the
 * reader rather than playing at them, and it settles with no overshoot.
 *
 * The picture is laid out with its intrinsic ratio and `height: auto`, so it is never
 * cropped or distorted at any width — the reveal is entirely in the framing.
 */
export function LuxuryGiftingReveal() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      /* Measurements are only meaningful once the artwork has laid out. */
      if (!ready || prefersReducedMotion()) return;

      const mm = gsap.matchMedia();

      /* Desktop and tablet differ only in how far the frame travels: a tablet starts
         closer to full width, so the move stays proportionate on a smaller canvas. */
      const expand = (from: string) => () => {
        gsap.fromTo(
          frame.current,
          { width: from, borderRadius: 24, scale: 0.97, opacity: 0.92, y: 18 },
          {
            width: '100%',
            borderRadius: 10,
            scale: 1,
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section.current,
              start: 'top 85%',
              end: 'center 45%',
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );
      };

      mm.add('(min-width: 1280px)', expand('80%'));
      mm.add('(min-width: 768px) and (max-width: 1279px)', expand('90%'));

      /* Below 768px the frame is already full width, so there is nothing to expand. A
         short lift as it comes into view is the whole gesture. */
      mm.add('(max-width: 767px)', () => {
        gsap.fromTo(
          frame.current,
          { opacity: 0.92, scale: 0.985, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: section.current, start: 'top 88%', once: true },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: section, dependencies: [ready] },
  );

  const desktopSrc = BANNERS.giftingDesktop || ARTWORK;
  const mobileSrc = BANNERS.giftingMobile || desktopSrc;
  const href = BANNERS.giftingCtaHref || CTA_HREF;

  return (
    <section ref={section} aria-labelledby="gifting-heading" className={s.section}>
      <div className={s.inner}>
        <div ref={frame} className={s.frame}>
          <picture>
            {/* A dedicated phone image is used when the shop supplies one. */}
            {BANNERS.giftingMobile && (
              <source media="(max-width: 767px)" srcSet={mobileSrc} />
            )}
            <img
              src={desktopSrc}
              alt={BANNERS.giftingAlt || ARTWORK_ALT}
              width={ARTWORK_W}
              height={ARTWORK_H}
              loading="lazy"
              decoding="async"
              onLoad={() => setReady(true)}
              className={s.art}
            />
          </picture>

          {/* The wording is printed into the artwork, so it is given to search engines,
              screen readers and translation here rather than drawn over the picture. */}
          <div className="sr-only">
            <h2 id="gifting-heading">The Art of Gifting: A Little Box of Love</h2>
            <p>Thoughtful jewellery, beautifully chosen for someone special.</p>
          </div>

          {/* The printed button, made real. Proportional, so it holds through the reveal. */}
          <Link
            to={href}
            aria-label={CTA_LABEL}
            className={s.hotspot}
            style={CTA_HOTSPOT}
          />
        </div>

        {/* On a phone the printed button is too small to be a reliable target, so a real
            one sits beneath the artwork. Hidden from assistive tech above that width,
            where the hotspot already provides the link. */}
        <Link to={href} className={s.mobileCta}>
          {CTA_LABEL}
          <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" className={s.arrow}>
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
    </section>
  );
}
