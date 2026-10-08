import { useEffect } from 'react';
import { prefersReducedMotion } from './useReducedMotion';

/** Sections marked `data-fade` animate opacity 0→1 and translateY 18px→0 over 700ms when they
 *  enter the viewport — once each. Only elements starting below the fold are observed, so
 *  what is already on screen is never hidden. Re-runs on `key` (the route). */
export function useScrollReveal(key: unknown) {
  useEffect(() => {
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.animate(
            [
              { opacity: 0, transform: 'translateY(18px)' },
              { opacity: 1, transform: 'none' },
            ],
            { duration: 700, easing: 'cubic-bezier(.2,.7,.2,1)' },
          );
          io.unobserve(e.target);
        }),
      { rootMargin: '0px 0px -6% 0px' },
    );
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll('[data-fade]').forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight) io.observe(el);
      });
    });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [key]);
}
