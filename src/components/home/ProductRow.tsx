import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/product/ProductCard';
import { useViewport } from '@/hooks/useViewport';
import type { Product } from '@/data/types';
import pill from '@/components/ui/Pill.module.css';

/** Trims a list so it fills whole rows — but never drops below one row. */
export function fitRows(arr: Product[], n: number) {
  return arr.slice(0, Math.max(Math.min(n, arr.length), Math.floor(arr.length / n) * n));
}

/** A titled row of product cards with an optional "View All →" pill underneath.
 *  Used by Best Sellers, New Arrivals and "You May Also Love". */
export function ProductRow({
  items,
  viewAllHref,
  heading,
}: {
  items: Product[];
  viewAllHref?: string;
  /** Rendered above the grid; Best Sellers / New Arrivals pass an ornamented SectionTitle. */
  heading?: React.ReactNode;
}) {
  const { L } = useViewport();
  return (
    <>
      {heading}
      <div style={{ display: 'grid', gridTemplateColumns: L.rowCols, gap: 'clamp(12px,2vw,24px)' }}>
        {items.map((p) => (
          <div key={p.id} style={{ minWidth: 0 }}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      {viewAllHref && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(22px,3vw,32px)' }}>
          <ViewAllPill to={viewAllHref} />
        </div>
      )}
    </>
  );
}

export function ViewAllPill({ to }: { to: string }) {
  return (
    <Link to={to} className={pill.viewAll}>
      View All →
    </Link>
  );
}
