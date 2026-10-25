/* Terms and Conditions.
 *
 * These are the shop's own terms with its customers. They are deliberately not a copy of
 * Razorpay's merchant agreement, which governs a different relationship. The wording
 * describes how this shop actually operates and still needs the merchant's sign-off, and
 * legal review of the governing-law section, before it is relied on.
 */
import { List, P, PolicyLink, PolicyPage, Section, Detail } from '@/components/ui/Policy';
import { fmt } from '@/lib/format';
import {
  ADDRESS, BRAND_NAME, MERCHANT, PAYMENTS, RETURNS, SHIPPING, SUPPORT, addressLine,
} from '@/config/businessInfo';

export function Terms() {
  return (
    <PolicyPage
      title="Terms and Conditions"
      path="/terms-and-conditions"
      description={`The terms on which ${BRAND_NAME} sells jewellery and accessories online in India.`}
      intro={
        <P>
          These terms apply when you browse or buy from {BRAND_NAME}. Please read them
          before placing an order. By completing a purchase you accept them.
        </P>
      }
      contents={[
        { id: 'who-we-are', label: 'Who we are' },
        { id: 'eligibility', label: 'Eligibility' },
        { id: 'products', label: 'Products' },
        { id: 'prices', label: 'Prices' },
        { id: 'orders', label: 'Orders' },
        { id: 'payment', label: 'Payment' },
        { id: 'delivery', label: 'Delivery' },
        { id: 'problems', label: 'If something is wrong' },
        { id: 'your-part', label: 'Your part' },
        { id: 'ip', label: 'Our content' },
        { id: 'liability', label: 'Liability' },
        { id: 'law', label: 'Governing law' },
      ]}
    >
      <Section h="Who we are" id="who-we-are">
        <P>
          This website is owned and operated by{' '}
          <Detail value={MERCHANT.legalName} what="owner's name" />, trading as {BRAND_NAME}
          {MERCHANT.constitution ? `, a ${MERCHANT.constitution},` : ','} based in{' '}
          {ADDRESS.state}, {ADDRESS.country}.
        </P>
        <P>
          We operate from <Detail value={addressLine()} what="operating address" />.
          You can reach us at{' '}
          <Detail value={SUPPORT.email} what="support email" /> or{' '}
          <Detail value={SUPPORT.phone} what="support phone" />.
        </P>
      </Section>

      <Section h="Eligibility" id="eligibility">
        <P>
          You may buy from us if you can enter a binding contract under Indian law. If you
          are under 18, please have a parent or guardian place the order. We sell and ship
          within India only.
        </P>
      </Section>

      <Section h="Products, colours and variations" id="products">
        <P>
          We sell fashion jewellery and accessories. Unless a product page says otherwise,
          our pieces are fashion jewellery and are not solid gold, solid silver or
          hallmarked precious metal.
        </P>
        <P>
          Each piece is photographed as carefully as we can, but screens vary and small
          differences in shade, finish and size are normal, particularly on handmade and
          plated items. The details on the product page describe that specific piece.
        </P>
      </Section>

      <Section h="Prices" id="prices">
        <P>
          All prices are in Indian Rupees and include applicable taxes. Delivery charges,
          where they apply, are shown separately at checkout before you pay.
        </P>
        <P>
          We may change prices or run offers at any time. The price that applies to your
          order is the one shown when you place it.
        </P>
      </Section>

      <Section h="Placing an order" id="orders">
        <P>
          Placing an order is an offer to buy. We confirm it once payment is received and
          the items are available. If a piece turns out to be unavailable after you have
          paid, we will tell you and refund that part of the order in full.
        </P>
        <P>
          Stock shown on the site is live, but two people can order the last piece at the
          same moment; where that happens we honour the order we confirm first.
        </P>
      </Section>

      <Section h="Payment" id="payment">
        <P>
          Online payments are processed by {PAYMENTS.gateway}. Your card, UPI and banking
          credentials are entered with {PAYMENTS.gateway} and are never seen or stored by
          us. We record only the result of the payment and a reference for it.
        </P>
        <P>
          An order is treated as paid only once {PAYMENTS.gateway} confirms it to us. If a
          payment is debited but the order does not confirm, see our{' '}
          <PolicyLink to="/refund-and-cancellation-policy">
            Refund and Cancellation Policy
          </PolicyLink>
          .
        </P>
      </Section>

      <Section h="Shipping and delivery" id="delivery">
        <P>
          We ship across India with {SHIPPING.courier}. Delivery is {fmt(SHIPPING.feeBelowThreshold)}{' '}
          on orders below {fmt(SHIPPING.freeAbove)} and free at {fmt(SHIPPING.freeAbove)} and
          above, measured on {SHIPPING.thresholdBasis}.
        </P>
        <P>
          Timelines given on the site are estimates, not guarantees: once a parcel is with{' '}
          {SHIPPING.courier} its progress is outside our control. Full details are in our{' '}
          <PolicyLink to="/shipping-policy">Shipping and Delivery Policy</PolicyLink>.
        </P>
      </Section>

      <Section h="If something is wrong with your order" id="problems">
        <P>
          If a piece arrives damaged, faulty, or is not what you ordered, tell us within{' '}
          {RETURNS.windowDays > 0 ? `${RETURNS.windowDays} days` : 'the stated return window'}{' '}
          of delivery and we will put it right. What we can offer, and what we need from
          you, is set out in{' '}
          <PolicyLink to="/returns-and-replacements">Returns and Replacements</PolicyLink>.
        </P>
        <P>Nothing in these terms limits your rights under Indian consumer law.</P>
      </Section>

      <Section h="Your part" id="your-part">
        <List
          items={[
            'Give us a correct delivery address and a phone number that reaches you.',
            'Use the site honestly, and not to interfere with it or with other customers.',
            'Do not resell our pieces as something they are not.',
          ]}
        />
      </Section>

      <Section h="Our content" id="ip">
        <P>
          The photographs, text, logo and design on this site belong to us. Please do not
          copy or reuse them commercially without our written permission.
        </P>
      </Section>

      <Section h="Liability" id="liability">
        <P>
          We take care over every order, but we are not responsible for losses we could not
          reasonably have foreseen, or for delays caused by events outside our control such
          as courier disruption, weather or public holidays. Where we are liable, our
          liability is limited to the value of the order concerned.
        </P>
      </Section>

      <Section h="Support, complaints and governing law" id="law">
        <P>
          For anything at all, write to{' '}
          <Detail value={SUPPORT.email} what="support email" />. If a reply has not resolved
          matters, our{' '}
          <PolicyLink to="/grievance-redressal">Grievance Redressal</PolicyLink> page explains
          how to escalate.
        </P>
        <P>
          These terms are governed by the laws of India, and the courts at{' '}
          <Detail value={ADDRESS.city} what="city for jurisdiction" />, {ADDRESS.state} have
          jurisdiction over disputes arising from them.
        </P>
      </Section>
    </PolicyPage>
  );
}
