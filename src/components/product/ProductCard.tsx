import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '@/hooks/useCatalog';
import { discountOf, fmt } from '@/lib/format';
import { categoryOf, productHref, resolveVariants } from '@/lib/catalog';
import { useShop, useUi } from '@/store/useStore';
import { BagIcon, HeartIcon } from '@/components/ui/icons';
import type { ColorKey, Product } from '@/data/types';
import s from './ProductCard.module.css';

export interface ProductCardProps {
  product: Product;
  /** Colours the shopper filtered by; matching variants are shown first. */
  preferredColors?: ColorKey[];
  /** Image aspect ratio; 4/5 everywhere in the current design. */
  ratio?: string;
}

export function ProductCard({ product, preferredColors, ratio = '4 / 5' }: ProductCardProps) {
  const { categories } = useCatalog();
  const wish = useShop((st) => st.wish);
  const toggleWish = useShop((st) => st.toggleWish);
  const add = useShop((st) => st.add);
  const { openCart, flash } = useUi();

  const variants = useMemo(() => {
    const all = resolveVariants(product);
    if (!preferredColors?.length) return all;
    // When a colour filter is on, matching variants come first.
    return [
      ...all.filter((v) => preferredColors.includes(v.color)),
      ...all.filter((v) => !preferredColors.includes(v.color)),
    ];
  }, [product, preferredColors]);

  const [vi, setVi] = useState(0);
  // Reset the shown colour when the card is reused for a different product.
  useEffect(() => setVi(0), [product.id]);

  const index = Math.min(vi, Math.max(variants.length - 1, 0));
  const variant = variants[index];
  const img = variant?.images?.[0];
  const img2 = variant?.images?.[1];
  const sold = variant?.stock === 0;
  const off = discountOf(product.price, product.mrp);
  const wished = wish.includes(product.id);
  const href = productHref(product);
  const phType = categoryOf(categories, product.category).ph;
  const alt = `${product.name} in ${variant?.label ?? ''}`;

  const onWish = (e: React.MouseEvent) => {
    e.preventDefault();
    const had = toggleWish(product.id);
    flash(had ? 'Removed from wishlist' : 'Saved to your wishlist ♡');
  };

  /** Quick add: qty 1 of the shown variant, then open the bag. */
  const onAdd = () => {
    if (sold || !variant) return;
    add(product, variant.id, 1);
    openCart();
  };

  return (
    <div className={s.card}>
      <div className={s.media} style={{ aspectRatio: ratio, background: variant?.tint ?? '#FBEFEF' }}>
        <Link to={href} aria-label={`View ${product.name}`} className={s.mediaLink}>
          {img ? (
            <div className={s.zoom}>
              <img src={img} alt={alt} loading="lazy" decoding="async" className={s.img} />
              {img2 && (
                <img
                  src={img2}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className={`${s.img} ${s.img2}`}
                />
              )}
            </div>
          ) : (
            <div role="img" aria-label={alt} className={s.placeholder}>
              <span className={s.phLabel}>
                {phType} · {(variant?.label ?? '').toLowerCase()}
              </span>
            </div>
          )}
        </Link>

        <span aria-hidden="true" className={s.frame} />

        <div className={s.badges}>
          {off > 0 && <span className={s.badgeOff}>{off}% off</span>}
          {product.isNew && <span className={s.badgeNew}>New</span>}
        </div>

        <button
          type="button"
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wished}
          onClick={onWish}
          className={s.wishBtn}
        >
          <HeartIcon
            size={17}
            fill={wished ? '#8D3545' : 'none'}
            stroke={wished ? '#8D3545' : '#302722'}
            strokeWidth={1.5}
          />
        </button>

        {sold && <span className={s.soldOut}>Sold out</span>}
      </div>

      <div className={s.body}>
        <div className={s.swatchRow}>
          <div role="group" aria-label="Colours" className={s.swatchGroup}>
            {variants.map((sw, i) => (
              <button
                key={sw.id}
                type="button"
                title={sw.label}
                aria-label={`${sw.label}${sw.stock === 0 ? ' (sold out)' : ''}`}
                aria-pressed={i === index}
                onClick={() => setVi(i)}
                className={s.swatch}
                style={{
                  background: sw.hex,
                  boxShadow:
                    i === index
                      ? '0 0 0 2px #FFF9F6, 0 0 0 3px #9D762F'
                      : 'inset 0 0 0 1px rgba(48,39,34,.18)',
                }}
              />
            ))}
          </div>
          <span className={s.colorText}>
            {variants.length > 1 ? `${variants.length} colours` : (variant?.label ?? '')}
          </span>
        </div>

        <Link to={href} className={s.name}>
          {product.name}
        </Link>

        <div className={s.priceRow}>
          <span className={s.price}>{fmt(product.price)}</span>
          {off > 0 && <s className={s.mrp}>{fmt(product.mrp)}</s>}
        </div>
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={sold}
        className={s.addBtn}
        style={{ opacity: sold ? 0.5 : 1 }}
      >
        <BagIcon size={15} strokeWidth={1.5} />
        {sold ? 'Sold out' : 'Add to Cart'}
      </button>
    </div>
  );
}
