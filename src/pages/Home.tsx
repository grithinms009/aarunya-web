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

export function Home() {
  const { products } = useCatalog();
  const { n } = useViewport();

  // Four cards normally, six when the grid is three-up, then trimmed to fill whole rows.
  const homeCount = n === 3 ? 6 : 4;
  const best = fitRows(products.filter((p) => p.featured).slice(0, homeCount), n);
  const fresh = fitRows(
    products
      .filter((p) => p.isNew)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, homeCount),
    n,
  );

  return (
    <>
      <Seo
        description="Aarunya Jewels by Veena: anti-tarnish necklaces, bangles, earrings, rings and more, chosen with love in Kerala. Pan India shipping, free above ₹499."
      />
      <Hero />
      <TrustStrip />
      <ShopByCategory />

      <section data-fade style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(48px,7vw,88px) clamp(16px,4vw,40px) 0' }}>
        <ProductRow items={best} viewAllHref="/shop" heading={<SectionTitle>Best Sellers</SectionTitle>} />
      </section>

      <LuxuryGiftingReveal />

      <section data-fade style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(48px,7vw,88px) clamp(16px,4vw,40px) 0' }}>
        <ProductRow
          items={fresh}
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
