/* About Us.
 *
 * Deliberately modest. No founding year, no awards, no customer counts, no manufacturing
 * claims, no "certified" anything — none of that is documented, and a payment gateway
 * checking this page will compare it against what the business can actually evidence.
 */
import { List, P, PolicyLink, PolicyPage, Section, Detail } from '@/components/ui/Policy';
import { CATEGORIES } from '@/data/config';
import {
  ADDRESS, BRAND_NAME, MERCHANT, RETURNS, SHIPPING, SUPPORT,
} from '@/config/businessInfo';

export function AboutUs() {
  const categoryNames = CATEGORIES.map((c) => c.short || c.name).filter(Boolean);

  return (
    <PolicyPage
      title="About Us"
      path="/about-us"
      description={`${BRAND_NAME} is a small online jewellery shop from Kerala, selling anti-tarnish fashion jewellery across India.`}
      intro={
        <P>
          {BRAND_NAME} is a small online jewellery shop run from {ADDRESS.state}, India,
          selling everyday fashion jewellery and accessories across the country.
        </P>
      }
    >
      <Section h="What we sell">
        <P>
          Our pieces are fashion jewellery — designed to be worn often, priced to be
          affordable, and finished to resist tarnishing. They are not solid gold or
          hallmarked precious metal, and we say so plainly on every product page.
        </P>
        {categoryNames.length > 0 && (
          <P>You will find {categoryNames.join(', ')} in the shop.</P>
        )}
      </Section>

      <Section h="Who runs it">
        <P>
          The shop is run by{' '}
          <Detail value={MERCHANT.legalName} what="proprietor's legal name" />, trading as{' '}
          {BRAND_NAME} — a{' '}
          <Detail value={MERCHANT.constitution} what="business constitution" /> based in{' '}
          {ADDRESS.state}. Orders are packed and posted by the same small team that answers
          your messages.
        </P>
      </Section>

      <Section h="How we work">
        <List
          items={[
            `Every order is packed by hand and sent with ${SHIPPING.courier}.`,
            'What you see on the product page is what we send — the same piece, the same colour.',
            RETURNS.windowDays > 0
              ? `If something arrives damaged or wrong, tell us within ${RETURNS.windowDays} days and we will replace or refund it.`
              : 'If something arrives damaged or wrong, tell us and we will replace or refund it.',
            'We answer messages ourselves. There is no call-centre script here.',
          ]}
        />
      </Section>

      <Section h="Talk to us">
        <P>
          Questions about a piece, an order, or whether something will suit an occasion —
          write to <Detail value={SUPPORT.email} what="support email" /> or message us on
          WhatsApp. Full details are on our{' '}
          <PolicyLink to="/contact-us">Contact Us</PolicyLink> page.
        </P>
      </Section>
    </PolicyPage>
  );
}
