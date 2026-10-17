import { useEffect, useState } from 'react';
import { cols } from '@/lib/format';

/** Breakpoint flags and the grid-template strings the prototype derived from window width.
 *  Mirrors the `L` object and `isDesktop` / `isMobile` / `n` in the prototype's renderVals(). */
export interface Viewport {
  w: number;
  isDesktop: boolean;
  isMobile: boolean;
  notDesktop: boolean;
  /** Product columns: 2 under 600, 3 under 1024, else 4. */
  n: number;
  L: Layout;
}

export interface Layout {
  prodCols: string;
  otCols: string;
  trustCols: string;
  trustJustify: string;
  rowCols: string;
  catCols: string;
  gridCats: string;
  whyCols: string;
  igCols: string;
  footCols: string;
  footBrand: string;
  two: string;
  cartCols: string;
  sumPos: 'sticky' | 'static';
  sumOrder: number;
  fCols: string;
}

function compute(w: number): Viewport {
  const isDesktop = w >= 1024;
  const isMobile = w < 768;
  const n = w < 600 ? 2 : w < 1024 ? 3 : 4;
  const L: Layout = {
    prodCols: cols(n),
    otCols: w >= 860 ? cols(4) : cols(2),
    trustCols: isDesktop ? cols(4) : cols(2),
    trustJustify: isDesktop ? 'center' : 'flex-start',
    rowCols: cols(n),
    catCols: cols(w >= 1180 ? 8 : w >= 600 ? 4 : 3),
    gridCats: cols(w < 600 ? 2 : w < 1024 ? 3 : 4),
    whyCols: cols(w < 900 ? 2 : 4),
    igCols: cols(isMobile ? 3 : 6),
    footCols: isDesktop ? '1.5fr 1fr 1fr 1fr' : '1fr 1fr',
    footBrand: isDesktop ? 'auto' : '1 / -1',
    two: w >= 860 ? 'minmax(0,1fr) minmax(0,1fr)' : '1fr',
    cartCols: w >= 900 ? 'minmax(0,1.5fr) minmax(300px,1fr)' : '1fr',
    sumPos: w >= 900 ? 'sticky' : 'static',
    sumOrder: w >= 900 ? 0 : -1,
    fCols: w >= 600 ? '1fr 1fr' : '1fr',
  };
  return { w, isDesktop, isMobile, notDesktop: !isDesktop, n, L };
}

export function useViewport(): Viewport {
  const [vp, setVp] = useState(() =>
    compute(typeof window === 'undefined' ? 1280 : window.innerWidth),
  );
  useEffect(() => {
    const onResize = () => setVp((prev) => (prev.w === window.innerWidth ? prev : compute(window.innerWidth)));
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return vp;
}
