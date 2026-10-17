import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import { useViewport } from '@/hooks/useViewport';
import { HeartIcon } from '@/components/ui/icons';
import s from './Gallery.module.css';

export interface GalleryView {
  img?: string;
  alt: string;
  label: string;
  tint: string;
  /** Background shorthand for the thumbnail. */
  bg: string;
}

/** Main image with prev/next arrows and a thumbnail row beneath, then the three
 *  highlights, which are derived from the piece itself rather than asserted for every
 *  product. Image changes crossfade with a
 *  1.035 scale. */
export function Gallery({
  views,
  index,
  onIndex,
  off,
  wished,
  onWish,
  wishLabel,
  /** Changes whenever the colour variant changes, so the crossfade also runs then. */
  variantKey,
  /** Only the highlights this piece actually supports are shown. */
  highlights,
}: {
  views: GalleryView[];
  index: number;
  onIndex: (i: number) => void;
  off: number;
  wished: boolean;
  onWish: () => void;
  wishLabel: string;
  variantKey: string;
  highlights: { label: string; d: string }[];
}) {
  const { w } = useViewport();
  const frameRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  const main = views[index] ?? views[0];
  const thumbSize = w >= 480 ? '68px' : '56px';

  // Crossfade the main image whenever the view or the colour changes.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = frameRef.current?.querySelector('img,[role=img]');
    if (!el || !('animate' in el) || prefersReducedMotion()) return;
    (el as HTMLElement).animate(
      [
        { opacity: 0, transform: 'scale(1.035)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      { duration: 620, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' },
    );
  }, [index, variantKey]);

  const step = (delta: number) => onIndex((index + delta + views.length) % views.length);

  return (
    <div className={s.column}>
      <div ref={frameRef} className={s.frame} style={{ background: main?.tint }}>
        {main?.img ? (
          <img key={main.img} src={main.img} alt={main.alt} className={s.mainImg} />
        ) : (
          <div role="img" aria-label={main?.alt} className={s.placeholder}>
            <span className={s.phLabel}>{main?.label}</span>
          </div>
        )}

        {off > 0 && <span className={s.offBadge}>{off}% off</span>}

        <button
          type="button"
          onClick={onWish}
          aria-pressed={wished}
          aria-label={wishLabel}
          className={s.wishBtn}
        >
          <HeartIcon
            size={22}
            fill={wished ? '#8D3545' : 'none'}
            stroke="#8D3545"
            strokeWidth={1.5}
          />
        </button>
      </div>

      <div className={s.navRow}>
        {views.length > 1 && (
          <button type="button" aria-label="Previous image" onClick={() => step(-1)} className={s.arrowBtn}>
            <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden="true"
              style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
              <path d="M25 6H1M6 1L1 6l5 5" />
            </svg>
          </button>
        )}

        <div
          role="group"
          aria-label="Product images"
          className={s.thumbs}
          style={{ gridTemplateColumns: `repeat(${views.length},${thumbSize})` }}
        >
          {views.map((v, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show ${v.label.split('·').pop()?.trim() ?? 'view'}`}
              aria-pressed={i === index}
              onClick={() => onIndex(i)}
              className={s.thumb}
              style={{
                border: `1px solid ${i === index ? '#C79A45' : 'rgba(199,154,69,.22)'}`,
                background: v.bg,
                opacity: i === index ? 1 : 0.7,
                boxShadow: i === index ? '0 0 0 1px #9D762F' : 'none',
              }}
            />
          ))}
        </div>

        {views.length > 1 && (
          <button type="button" aria-label="Next image" onClick={() => step(1)} className={s.arrowBtn}>
            <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden="true"
              style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
              <path d="M1 6h24M20 1l5 5-5 5" />
            </svg>
          </button>
        )}
      </div>

      {highlights.length > 0 && (
      <ul aria-label="Highlights" className={s.features}>
        {highlights.map((ft, i) => (
          <li key={ft.label} className={s.feature} style={{ borderLeft: i ? '1px solid #DCC7A6' : 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"
              style={{ flex: 'none', fill: 'none', stroke: '#8A6527', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
              <path d={ft.d} />
            </svg>
            {ft.label}
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}
