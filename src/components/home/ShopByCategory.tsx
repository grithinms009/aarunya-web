import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '@/hooks/useCatalog';
import { categoryHref } from '@/lib/catalog';
import { SectionTitle } from '@/components/ui/SectionTitle';
import s from './ShopByCategory.module.css';

/** How fast the row drifts when it has to, in pixels a second. A shop sign, not a ticker. */
const SPEED = 22;

/** How long after a touch or a drag before it picks the drift back up. */
const RESUME_AFTER = 2500;

/**
 * Circular category tiles, always on one line.
 *
 * The tiles keep one size and sit in a single row. While they fit, the row is centred and
 * perfectly still. Once there are more than the window holds, the row doubles itself and
 * drifts slowly from right to left, so the ones off the edge come round rather than
 * wrapping onto a second line.
 *
 * The drift is done by moving the row's own scroll position rather than by transforming
 * it, so a finger or a trackpad can push it about at any point and the drift simply
 * carries on from wherever it was left.
 */
export function ShopByCategory() {
  const { categories } = useCatalog();
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  /* Off until measuring says the tiles do not fit; it is what puts the second copy in. */
  const [looping, setLooping] = useState(false);

  /* Does the row overflow? Measured against the first copy only, so the answer does not
     change when the second copy is added underneath it. */
  useEffect(() => {
    const box = viewport.current;
    const row = track.current;
    if (!box || !row) return;

    const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const measure = () => {
      const first = row.firstElementChild as HTMLElement | null;
      if (!first) return;
      setLooping(motionOk && first.scrollWidth > box.clientWidth + 4);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, [categories.length]);

  /* The drift itself. Only ever runs while the row is both looping and on screen. */
  useEffect(() => {
    const box = viewport.current;
    const row = track.current;
    if (!looping || !box || !row) return;

    let raf = 0;
    let last = performance.now();
    let pos = box.scrollLeft;
    let onScreen = true;
    let holdUntil = 0;
    let hovering = false;
    let focused = false;

    /* The exact distance between the two copies, taken from the DOM rather than worked
       out from widths and gaps, so the wrap lands on the same pixel every time. */
    const period = () => {
      const [a, b] = [row.children[0], row.children[1]] as HTMLElement[];
      return b ? b.offsetLeft - a.offsetLeft : 0;
    };

    const frame = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      const p = period();

      if (p > 0 && onScreen && !hovering && !focused && now > holdUntil
          && !document.hidden) {
        pos += (SPEED * dt) / 1000;
        if (pos >= p) pos -= p;
        box.scrollLeft = pos;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    /* A push from the reader. Our own writes stay within a frame of `pos`, so anything
       further out than that came from a finger, a trackpad or a keyboard. */
    const onScroll = () => {
      if (Math.abs(box.scrollLeft - pos) < 2) return;
      const p = period();
      pos = box.scrollLeft;
      /* Keep the position inside one period, whichever way it was pushed. */
      if (p > 0) {
        if (pos >= p) pos -= p;
        else if (pos < 0) pos += p;
        box.scrollLeft = pos;
      }
      holdUntil = performance.now() + RESUME_AFTER;
    };

    const enter = () => { hovering = true; };
    const leave = () => { hovering = false; };
    const focusIn = () => { focused = true; };
    const focusOut = () => { focused = false; };

    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; });
    io.observe(box);

    box.addEventListener('scroll', onScroll, { passive: true });
    box.addEventListener('pointerenter', enter);
    box.addEventListener('pointerleave', leave);
    box.addEventListener('focusin', focusIn);
    box.addEventListener('focusout', focusOut);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      box.removeEventListener('scroll', onScroll);
      box.removeEventListener('pointerenter', enter);
      box.removeEventListener('pointerleave', leave);
      box.removeEventListener('focusin', focusIn);
      box.removeEventListener('focusout', focusOut);
    };
  }, [looping]);

  /* `copy` is the trailing duplicate: the same tiles again, kept away from the reader and
     out of the tab order so nothing is announced or landed on twice. */
  const group = (copy: boolean) => (
    <div className={s.group} aria-hidden={copy || undefined}>
      {categories.map((c) => (
        <Link
          key={c.slug}
          to={categoryHref(c)}
          className={s.tile}
          tabIndex={copy ? -1 : undefined}
        >
          <div className={s.ring}>
            <div className={s.clip} style={{ background: c.tint }}>
              <div
                role="img"
                aria-label={c.name}
                className={s.image}
                style={{
                  background: c.image
                    ? `center/cover no-repeat url("${c.image}")`
                    : 'repeating-linear-gradient(135deg,rgba(255,255,255,.55) 0 9px,rgba(255,255,255,0) 9px 18px)',
                }}
              />
            </div>
          </div>
          <span className={s.label}>{c.short}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <section data-fade className={s.section}>
      <div className={s.head}>
        <SectionTitle>Shop by Category</SectionTitle>
      </div>
      <div
        ref={viewport}
        className={looping ? `${s.viewport} ${s.masked}` : s.viewport}
      >
        <div ref={track} className={looping ? s.track : `${s.track} ${s.centred}`}>
          {group(false)}
          {looping && group(true)}
        </div>
      </div>
    </section>
  );
}
