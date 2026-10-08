import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';

/** Easings used by the loader: E for entrances, I for the fill sweep. */
const E = 'cubic-bezier(.16,1,.3,1)';
const I = 'cubic-bezier(.65,0,.35,1)';

/** Minimum time the loader stays up, and the hard fallback if data never arrives. */
const MIN_MS = 2150;
const REDUCED_MIN_MS = 300;
const FALLBACK_MS = 6000;

/** First-load curtain:
 *  1. the logo mark fills bottom-to-top (clip-path) while a 72px gold progress line scales in,
 *  2. the wordmark fades up,
 *  3. once data is ready a shine sweep and gold glint play, the stage blurs and scales to 0.97,
 *     and the panel fades out.
 *  `onDone` fires as the panel fades so the page's own entrance can overlap it. */
export function Loader({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const panel = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLImageElement>(null);
  const shine = useRef<HTMLSpanElement>(null);
  const glint = useRef<SVGSVGElement>(null);
  const word = useRef<HTMLImageElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  const fillAnim = useRef<Animation | null>(null);
  const startedAt = useRef(Date.now());
  const closing = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Intro animations.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const m = mark.current;
    const fl = fill.current;
    const w = word.current;
    const b = bar.current;
    if (!fl?.animate || !m || !w || !b) return;

    m.animate(
      [{ opacity: 0, transform: 'translate3d(0,8px,0)' }, { opacity: 1, transform: 'none' }],
      { duration: 900, easing: E, fill: 'forwards' },
    );
    fillAnim.current = fl.animate(
      [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }],
      { duration: 1900, delay: 250, easing: I, fill: 'forwards' },
    );
    b.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
      duration: 1900, delay: 250, easing: I, fill: 'forwards',
    });
    w.animate(
      [{ opacity: 0, transform: 'translate3d(0,6px,0)' }, { opacity: 1, transform: 'none' }],
      { duration: 1000, delay: 450, easing: E, fill: 'forwards' },
    );
  }, []);

  // Exit, once data is ready and the minimum display time has elapsed.
  useEffect(() => {
    if (!ready || closing.current) return;
    const reduced = prefersReducedMotion();
    const minMs = reduced ? REDUCED_MIN_MS : MIN_MS;
    const wait = Math.max(0, minMs - (Date.now() - startedAt.current));

    const t = setTimeout(() => {
      if (closing.current) return;
      closing.current = true;
      const p = panel.current;
      const st = stage.current;
      if (reduced || !p?.animate || !st) {
        onDone();
        setVisible(false);
        return;
      }
      const finish = () => {
        glint.current?.animate(
          [
            { opacity: 0, transform: 'scale(0) rotate(-30deg)' },
            { opacity: 1, transform: 'scale(1) rotate(15deg)', offset: 0.4 },
            { opacity: 0, transform: 'scale(.3) rotate(50deg)' },
          ],
          { duration: 900, easing: 'ease-out', fill: 'forwards' },
        );
        shine.current?.animate(
          [{ backgroundPosition: '150% 0' }, { backgroundPosition: '-50% 0' }],
          { duration: 900, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' },
        );
        timers.current.push(
          setTimeout(() => {
            st.animate(
              [
                { opacity: 1, transform: 'scale(1)', filter: 'blur(0)' },
                { opacity: 0, transform: 'scale(.97)', filter: 'blur(4px)' },
              ],
              { duration: 700, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' },
            );
            const fade = p.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: 900, delay: 350, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards',
            });
            timers.current.push(setTimeout(onDone, 450));
            fade.finished.then(() => setVisible(false), () => setVisible(false));
          }, 750),
        );
      };
      // Let the fill sweep complete before the exit, so the mark is never cut off mid-fill.
      const fa = fillAnim.current;
      if (fa && fa.playState !== 'finished') fa.finished.then(finish, finish);
      else finish();
    }, wait);

    timers.current.push(t);
  }, [ready, onDone]);

  // Hard fallback, so a failed request can never trap the shopper behind the curtain.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!closing.current) {
        closing.current = true;
        onDone();
        setVisible(false);
      }
    }, FALLBACK_MS);
    timers.current.push(t);
    return () => timers.current.forEach(clearTimeout);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      ref={panel}
      role="status"
      aria-label="Loading Aarunya by Veena"
      style={{
        position: 'fixed', inset: 0, zIndex: 200, background: '#FFF9F6',
        display: 'flex', alignItems: 'center', justifyContent: 'center', willChange: 'transform',
      }}
    >
      <div ref={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <div ref={mark} style={{ position: 'relative', width: 'clamp(84px,22vw,108px)', opacity: prefersReducedMotion() ? 1 : 0 }}>
          <img src="/assets/aarunya-mark-sm.png" alt="" style={{ display: 'block', width: '100%', height: 'auto', opacity: 0.14 }} />
          <img
            ref={fill}
            src="/assets/aarunya-mark-sm.png"
            alt=""
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              clipPath: prefersReducedMotion() ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
            }}
          />
          <span
            ref={shine}
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              background:
                'linear-gradient(110deg,rgba(255,250,235,0) 40%,rgba(255,250,235,.95) 50%,rgba(255,250,235,0) 60%)',
              backgroundSize: '300% 100%',
              backgroundPosition: '150% 0',
              WebkitMask: 'url(/assets/aarunya-mark-sm.png) center/100% 100% no-repeat',
              mask: 'url(/assets/aarunya-mark-sm.png) center/100% 100% no-repeat',
            }}
          />
          <svg
            ref={glint}
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{ position: 'absolute', right: '-12%', top: '-10%', width: 16, height: 16, opacity: 0, overflow: 'visible' }}
          >
            <path
              d="M12 0C12.7 7.2 16.8 11.3 24 12C16.8 12.7 12.7 16.8 12 24C11.3 16.8 7.2 12.7 0 12C7.2 11.3 11.3 7.2 12 0Z"
              style={{ fill: '#C79A45' }}
            />
          </svg>
        </div>
        <img
          ref={word}
          src="/assets/aarunya-wordmark-sm.png"
          alt=""
          style={{
            display: 'block', height: 'clamp(18px,3.2vw,22px)', width: 'auto',
            marginTop: 6, opacity: prefersReducedMotion() ? 1 : 0,
          }}
        />
        <span aria-hidden="true" style={{ position: 'relative', display: 'block', width: 72, height: 1, background: '#EFE3D3', overflow: 'hidden' }}>
          <span
            ref={bar}
            style={{
              position: 'absolute', inset: 0, background: '#C79A45',
              transform: prefersReducedMotion() ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'left center',
            }}
          />
        </span>
      </div>
      <span
        aria-hidden="true"
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: 1,
          background: 'linear-gradient(90deg,rgba(199,154,69,0),rgba(199,154,69,.55),rgba(199,154,69,0))',
        }}
      />
    </div>
  );
}
