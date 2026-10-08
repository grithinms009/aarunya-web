import { useEffect, useMemo, useRef } from 'react';
import { ANNOUNCEMENTS } from '@/data/config';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import { useViewport } from '@/hooks/useViewport';
import s from './AnnouncementBar.module.css';

/** Scroll speed of the marquee, in px per second. */
const SPEED = 45;

/** Wine bar with an infinite horizontal marquee of ANNOUNCEMENTS, separated by gold outline
 *  diamonds. The list is duplicated so translating by -50% loops seamlessly; only the first
 *  copy is exposed to assistive tech. Pauses on hover and does not run under reduced motion. */
export function AnnouncementBar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);
  const { w } = useViewport();

  const { items, announceCount } = useMemo(() => {
    const list = ANNOUNCEMENTS.length ? ANNOUNCEMENTS : [''];
    // Repeat the set enough times to overflow the widest likely viewport before duplicating.
    const reps = Math.max(
      1,
      Math.ceil(Math.max(w, 1280) / (list.join('').length * 7.5 + list.length * 40)),
    );
    const oneSet = Array.from({ length: reps }, () => list).flat();
    return { items: [...oneSet, ...oneSet], announceCount: list.length };
  }, [w]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el?.animate || prefersReducedMotion()) return;
    const half = el.scrollWidth / 2;
    if (!half) return;
    const anim = el.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }],
      { duration: (half / SPEED) * 1000, iterations: Infinity, easing: 'linear' },
    );
    animRef.current = anim;
    return () => anim.cancel();
  }, [items]);

  return (
    <div
      role="region"
      aria-label="Offers"
      className={s.bar}
      onMouseEnter={() => animRef.current?.pause()}
      onMouseLeave={() => animRef.current?.play()}
    >
      <div ref={trackRef} className={s.track}>
        {items.map((text, i) => (
          <span key={i} aria-hidden={i < announceCount ? undefined : true} className={s.item}>
            {text}
            <span aria-hidden="true" className={s.diamond} />
          </span>
        ))}
      </div>
    </div>
  );
}
