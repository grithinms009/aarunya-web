import { Helmet } from 'react-helmet-async';
import { pageTitle } from '@/lib/route';
import type { Product } from '@/data/types';

/** Per-route title and meta description. `title` omitted means the home page's full title. */
export function Seo({
  title,
  description,
  product,
}: {
  title?: string;
  description?: string;
  /** When set, also emits Product JSON-LD. */
  product?: Product;
}) {
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
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      <meta property="og:title" content={title ? `${title} | Aarunya Jewels by Veena` : 'Aarunya Jewels by Veena'} />
      {description && <meta property="og:description" content={description} />}
    </Helmet>
  );
}
