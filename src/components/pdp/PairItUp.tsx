import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PAIRINGS } from '@/data/config';
import { useCatalog } from '@/hooks/useCatalog';
import { useViewport } from '@/hooks/useViewport';
import { bgOf, fmt } from '@/lib/format';
import { productHref, resolveVariants } from '@/lib/catalog';
import { useShop, useUi } from '@/store/useStore';
import { EyebrowTitle } from '@/components/ui/SectionTitle';
import type { Product, ResolvedVariant } from '@/data/types';
import s from './PairItUp.module.css';

/** "Pair it up — complete the look": the current piece plus the top in-stock product from
 *  each paired category. Extras can be toggled out of the set; the button adds everything
 *  that is still ticked. */
export function PairItUp({
  product,
  currentVariant,
}: {
  product: Product;
  currentVariant: ResolvedVariant | undefined;
}) {
  const { products } = useCatalog();
  const { w } = useViewport();
  const add = useShop((st) => st.add);
  const openCart = useUi((st) => st.openCart);
  const [off, setOff] = useState<string[]>([]);

  const picks = useMemo(() => {
    const top = (cat: string) =>
      products
        .filter((x) => x.category === cat && x.id !== product.id && x.variants.some((v) => v.stock > 0))
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))[0];
    return (PAIRINGS[product.category] ?? []).map(top).filter((p): p is Product => !!p);
  }, [products, product]);

  if (!picks.length || !currentVariant) return null;

  const list = [
    { p: product, v: currentVariant, current: true },
    ...picks.map((x) => {
      const vs = resolveVariants(x);
      return { p: x, v: vs.find((y) => y.stock > 0) ?? vs[0], current: false };
    }),
  ];

  // The current piece is always included; extras follow their toggle.
  const included = list.filter((x) => x.current || !off.includes(x.p.id));
  const sum = included.reduce((a, x) => a + x.p.price, 0);
  const mrpSum = included.reduce((a, x) => a + Math.max(x.p.mrp, x.p.price), 0);
  const saves = mrpSum > sum;

  const row = w >= 768;

  const addAll = () => {
    included.forEach((x) => add(x.p, x.v.id, 1));
    openCart();
  };

  return (
    <section data-fade aria-label="Complete the look" style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(48px,7vw,88px) clamp(16px,4vw,40px) 0' }}>
      <div className={s.wrap}>
        <EyebrowTitle eyebrow="Styled together" size="clamp(28px,3.6vw,40px)" marginBottom="clamp(20px,3vw,32px)">
          Pair it up to <em style={{ color: '#8D3545' }}>complete the look</em>
        </EyebrowTitle>

        <div className={s.row} style={{ flexDirection: row ? 'row' : 'column', gap: row ? 12 : 10 }}>
          {list.map((x, i) => {
            const checked = x.current || !off.includes(x.p.id);
            return (
              <div key={x.p.id} style={{ display: 'contents' }}>
                {i > 0 && row && (
                  <span aria-hidden="true" className={s.plus}>
                    +
                  </span>
                )}
                <div
                  className={s.card}
                  style={{
                    flexDirection: row ? 'column' : 'row',
                    border: `1px solid ${checked ? 'rgba(199,154,69,.45)' : 'rgba(199,154,69,.2)'}`,
                    opacity: checked ? 1 : 0.6,
                  }}
                >
                  <Link
                    to={productHref(x.p)}
                    aria-label={x.p.name}
                    className={s.thumb}
                    style={{ width: row ? '100%' : 96, background: bgOf(x.v) }}
                  >
                    {x.current && <span className={s.thisPiece}>This piece</span>}
                  </Link>
                  <div className={s.meta}>
                    <Link to={productHref(x.p)} className={s.name}>
                      {x.p.name}
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 8px' }}>
                      <span style={{ fontSize: 15, fontWeight: 500 }}>{fmt(x.p.price)}</span>
                      {x.p.mrp > x.p.price && (
                        <s style={{ fontSize: 12.5, color: '#756964' }}>{fmt(x.p.mrp)}</s>
                      )}
                    </div>
                    <label className={s.check} style={{ cursor: x.current ? 'default' : 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={x.current}
                        onChange={() =>
                          setOff((prev) =>
                            prev.includes(x.p.id) ? prev.filter((y) => y !== x.p.id) : [...prev, x.p.id],
                          )
                        }
                        style={{ width: 17, height: 17, accentColor: '#8D3545', margin: 0 }}
                      />
                      {x.current ? 'Included' : checked ? 'Added to set' : 'Add to set'}
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 'clamp(22px,3vw,30px)' }}>
          <button type="button" onClick={addAll} className={s.addAll}>
            {included.length > 1
              ? `Add all ${included.length} to Cart · ${fmt(sum)}`
              : `Add to Cart · ${fmt(sum)}`}
            {saves && <s style={{ fontSize: 12.5, opacity: 0.75 }}>{fmt(mrpSum)}</s>}
          </button>
          {saves && (
            <span style={{ fontSize: 12.5, color: '#756964' }}>
              You save {fmt(mrpSum - sum)} on this set
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
