import { Helmet } from 'react-helmet-async';
import { pageTitle } from '@/lib/route';
import { canonicalUrl } from '@/config/businessInfo';
import type { Product } from '@/data/types';

/** Per-route title and meta description. `title` omitted means the home page's full title. */
export function Seo({
  title,
  description,
  product,
  path,
}: {
  title?: string;
  description?: string;
  /** When set, also emits Product JSON-LD. */
  product?: Product;
  /** Route path, e.g. "/shipping-policy", used for the canonical URL. Emitted only
   *  once a primary domain is configured, so the two domains never both claim it. */
  path?: string;
}) {
  const canonical = path ? canonicalUrl(path) : null;
  const jsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.variants[0]?.images ?? [],
        brand: { '@type': 'Brand', name: 'Aarunya Jewels by Veena' },
        material: product.material,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: product.price,
          availability: product.variants.some((v) => v.stock > 0)
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          seller: { '@type': 'Organization', name: 'Aarunya Jewels by Veena' },
        },
        ...(product.rating && product.reviewCount
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: product.reviewCount,
              },
            }
          : {}),
      }
    : null;

  return (
    <Helmet>
      <title>{pageTitle(title)}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {canonical && <meta property="og:url" content={canonical} />}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      <meta property="og:title" content={title ? `${title} | Aarunya Jewels by Veena` : 'Aarunya Jewels by Veena'} />
      {description && <meta property="og:description" content={description} />}
    </Helmet>
  );
}
