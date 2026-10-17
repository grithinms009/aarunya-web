/* Frequently Asked Questions.
 *
 * Answers are accordions built on <details>, so they work without JavaScript, are
 * keyboard-navigable for free, and need no new dependency.
 *
 * The material answers are careful: this shop sells plated fashion jewellery, so the
 * page says that rather than claiming every piece is anti-tarnish, hypoallergenic or
 * gold. Shipping figures come from the live store settings, so they match the checkout.
 */
import { useState } from 'react';
import { P, PolicyLink, PolicyPage, Section, Detail } from '@/components/ui/Policy';
import { fmt } from '@/lib/format';
import { PAYMENTS, RETURNS, SHIPPING, SUPPORT } from '@/config/businessInfo';
import { CONTENT } from '@/data/config';

function Faq1({ q, children }: { q: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      style={{ borderBottom: '1px solid #EFE6DF', padding: '14px 0' }}
    >
      <summary
        style={{
          cursor: 'pointer',
          listStyle: 'none',
          fontFamily: "'Jost',sans-serif",
          fontSize: 16,
          color: '#2E2826',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          alignItems: 'baseline',
        }}
      >
        {q}
        <span aria-hidden="true" style={{ color: '#B08D57', fontSize: 18, lineHeight: 1 }}>
          {open ? '–' : '+'}
        </span>
      </summary>
      <div style={{ marginTop: 10, fontSize: 15, lineHeight: 1.75, color: '#756964', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {children}
      </div>
    </details>
  );
}

export function Faq() {
  const fee = fmt(SHIPPING.feeBelowThreshold);
  const free = fmt(SHIPPING.freeAbove);
  const window =
    RETURNS.windowDays > 0 ? `${RETURNS.windowDays} days of delivery` : 'the return window';

  return (
    <PolicyPage
      title="Frequently Asked Questions"
      path="/faq"
      description="Materials, care, shipping charges, delivery times, cancellations, replacements and payment methods."
      intro={<P>The things customers ask us most. If yours is not here, just message us.</P>}
    >
      <Section h="Our jewellery">
        <Faq1 q="Are your products anti-tarnish?">
          <P>
            Most of our pieces are made with an anti-tarnish finish, which is why they keep
            their colour far longer than ordinary fashion jewellery. It is a finish, not a
            permanent property: it slows tarnishing, it does not make a piece immune to it.
          </P>
          <P>
            Rather than claim it for everything, we describe the material and finish on each
            product page. If a piece does not say it, please assume it is not.
          </P>
        </Faq1>

        <Faq1 q="What materials do you use?">
          <P>
            Our pieces are typically a brass or alloy base with a plated finish, and stones
            or pearls where the design calls for them. The exact material is written on each
            product page under its description.
          </P>
        </Faq1>

        <Faq1 q="Is this real gold?">
          <P>
            No. We sell fashion jewellery, not precious metal. Nothing in our shop is solid
            gold, solid silver or hallmarked, and "gold" in a product name describes the
            colour and finish, not the metal.
          </P>
          <P>
            We would rather be plain about this than have you discover it after buying.
          </P>
        </Faq1>

        <Faq1 q="How should I look after my jewellery?">
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {CONTENT.care.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <P>
            Plated finishes dislike perfume, sanitiser, sweat and water. Putting jewellery on
            last, after perfume and hairspray, makes a real difference.
          </P>
        </Faq1>
      </Section>

      <Section h="Orders and delivery">
        <Faq1 q="What are the shipping charges?">
          <P>
            {fee} on orders below {free}, and free delivery on orders of {free} and above,
            measured on {SHIPPING.thresholdBasis}. The exact charge is shown in your cart
            before you pay.
          </P>
        </Faq1>

        <Faq1 q="How long does delivery take?">
          <P>
            We dispatch within{' '}
            <Detail value={SHIPPING.processingDays} what="processing time" /> and{' '}
            {SHIPPING.courier} usually delivers within{' '}
            <Detail value={SHIPPING.deliveryWindow} what="delivery window" />, depending on
            your PIN code.
          </P>
          <P>
            These are estimates. Festivals, holidays and weather can add a few days — see
            our <PolicyLink to="/shipping-policy">Shipping Policy</PolicyLink>.
          </P>
        </Faq1>

        <Faq1 q="How do I track my order?">
          <P>
            We send you the {SHIPPING.courier} consignment number when your parcel is
            dispatched. Enter your order number on the{' '}
            <PolicyLink to="/track-order">Track Order</PolicyLink> page, or use it directly
            on the India Post website.
          </P>
        </Faq1>

        <Faq1 q="Can I cancel an order?">
          <P>
            Yes — <Detail value={RETURNS.cancellationCutoff} what="cancellation cut-off" />.
            Message us with your order number and we will stop it and refund you in full.
            Once a parcel has been handed to the courier we cannot recall it.
          </P>
        </Faq1>
      </Section>

      <Section h="Problems, returns and refunds">
        <Faq1 q="What if I receive a damaged item?">
          <P>
            Tell us within {window}, with photographs
            {RETURNS.requiresUnboxingVideo ? ' and your unboxing video' : ''}. We will send a
            replacement or refund you, and you will not be out of pocket for the return.
          </P>
        </Faq1>

        <Faq1 q="How do I request a replacement?">
          <P>
            Message us at <Detail value={SUPPORT.email} what="support email" /> with your
            order number and photographs, or use the Request Replacement button on your
            order in <PolicyLink to="/track-order">Track Order</PolicyLink>. Please wait for
            our confirmation before posting anything back.
          </P>
          <P>
            The full process is in{' '}
            <PolicyLink to="/returns-and-replacements">Returns and Replacements</PolicyLink>.
          </P>
        </Faq1>

        <Faq1 q="When will I get my refund?">
          <P>
            We initiate approved refunds within{' '}
            <Detail value={RETURNS.refundInitiationDays} what="refund initiation time" />,
            back to the way you paid. Your bank or UPI app then takes{' '}
            <Detail value={RETURNS.refundCompletionDays} what="bank credit time" /> to show
            it.
          </P>
        </Faq1>
      </Section>

      <Section h="Payment and support">
        <Faq1 q="Which payment methods do you accept?">
          <P>
            Payments are handled by {PAYMENTS.gateway}, which supports UPI, debit and credit
            cards, net banking and wallets. You enter those details with {PAYMENTS.gateway}{' '}
            — we never see or store your card number, CVV or UPI PIN.
          </P>
        </Faq1>

        <Faq1 q="Do I need an account to order?">
          <P>
            No. You can check out as a guest; we only ask for the details needed to deliver
            your order.
          </P>
        </Faq1>

        <Faq1 q="How do I contact you?">
          <P>
            Email <Detail value={SUPPORT.email} what="support email" />, call{' '}
            <Detail value={SUPPORT.phone} what="support phone" />, or use the contact form.
            The full address is on{' '}
            <PolicyLink to="/contact-us">Contact Us</PolicyLink>.
          </P>
        </Faq1>
      </Section>
    </PolicyPage>
  );
}
