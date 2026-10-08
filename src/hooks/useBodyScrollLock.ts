import { useEffect } from 'react';

/** Locks body scroll while any overlay (or the loader) is open. */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [locked]);
}
