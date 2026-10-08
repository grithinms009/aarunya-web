import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/** True when the viewer asked for reduced motion. Every animation in the app checks this. */
export function prefersReducedMotion() {
  return typeof window !== 'undefined' && !!window.matchMedia?.(QUERY).matches;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}
