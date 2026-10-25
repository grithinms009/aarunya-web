import { Seo } from '@/components/ui/Seo';
import { Hero } from '@/components/home/Hero';
import { TrustStrip } from '@/components/home/TrustStrip';
import { ShopByCategory } from '@/components/home/ShopByCategory';
import { LuxuryGiftingReveal } from '@/components/home/LuxuryGiftingReveal';
import { SaleOffers } from '@/components/home/SaleOffers';
import { WhyAarunya } from '@/components/home/WhyAarunya';
import { OurStory } from '@/components/home/OurStory';
import { InstagramGrid } from '@/components/home/InstagramGrid';
import { Newsletter } from '@/components/home/Newsletter';
import { ProductRow, fitRows } from '@/components/home/ProductRow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useCatalog } from '@/hooks/useCatalog';
import { useViewport } from '@/hooks/useViewport';

/* The two product rows share the one page width, so every section on the page lines up
   on the same left and right edge. */
const ROW_SECTION = {
  maxWidth: 'var(--max-w)',
  margin: '0 auto',
  /* Twice the side margin the rest of the page uses. The product cards are the densest
     thing on the page, so they need more air at the edges than a heading or a band of
     text does; everything else keeps the page's normal gutter. */
  padding: 'clamp(48px,7vw,88px) clamp(32px,6vw,120px) 0',
} as const;

export function Home() {
  const { products } = useCatalog();
  const { homeN, L } = useViewport();

  // One full row — five across on a laptop — except at three-up, where two rows of three
  // read better than one short one. Trimmed afterwards so a row is never left ragged.
  const homeCount = homeN === 3 ? 6 : homeN;
  const best = fitRows(products.filter((p) => p.featured).slice(0, homeCount), homeN);
  const fresh = fitRows(
    products
      .filter((p) => p.isNew)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, homeCount),
    homeN,
  );

  return (
    <>
      <Seo
        description="Aarunya Jewels by Veena: anti-tarnish necklaces, bangles, earrings, rings and more, chosen with love in Kerala. Pan India shipping, free above ₹499."
      />
      <Hero />
      <TrustStrip />
      <ShopByCategory />

      <section data-fade style={ROW_SECTION}>
        <ProductRow
          items={best}
          cols={L.homeRowCols}
          viewAllHref="/shop"
          heading={<SectionTitle>Best Sellers</SectionTitle>}
        />
      </section>

      <LuxuryGiftingReveal />

      <section data-fade style={ROW_SECTION}>
        <ProductRow
          items={fresh}
          cols={L.homeRowCols}
          viewAllHref="/shop?sort=newest"
          heading={<SectionTitle>New Arrivals</SectionTitle>}
        />
      </section>

      <SaleOffers />
      <WhyAarunya />
      <OurStory />
      <InstagramGrid />
      <Newsletter />
    </>
  );
}
