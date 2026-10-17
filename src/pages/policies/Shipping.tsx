/* Shipping and Delivery Policy.
 *
 * The two money figures are read from the live store settings, which is the same source
 * the backend charges from, so this page and the checkout cannot quote different numbers.
 * Timelines are stated as estimates and stay blank until the merchant confirms them —
 * a delivery promise is exactly the kind of thing that must not be invented.
 */
import { List, P, PolicyLink, PolicyPage, Section, Detail } from '@/components/ui/Policy';
import { fmt } from '@/lib/format';
import { SHIPPING, SUPPORT, addressLine } from '@/config/businessInfo';

export function Shipping() {
  const fee = fmt(SHIPPING.feeBelowThreshold);
  const free = fmt(SHIPPING.freeAbove);

  return (
    <PolicyPage
      title="Shipping and Delivery Policy"
      path="/shipping-policy"
      description={`Delivery charges, dispatch times and ${SHIPPING.courier} tracking for orders from Aarunya Jewels by Veena.`}
      intro={<P>How your order reaches you, what it costs, and how long it usually takes.</P>}
      contents={[
        { id: 'where', label: 'Where we deliver' },
        { id: 'charges', label: 'Delivery charges' },
        { id: 'dispatch', label: 'Dispatch and delivery times' },
        { id: 'tracking', label: 'Tracking' },
        { id: 'address', label: 'Address problems' },
        { id: 'undelivered', label: 'Undelivered parcels' },
        { id: 'help', label: 'Delayed or missing orders' },
      ]}
    >
      <Section h="Where we deliver" id="where">
        <P>
          We deliver across India through {SHIPPING.courier}, subject to their serviceability
          at your PIN code. We do not ship outside India at present.
        </P>
        <P>
          Parcels are posted from <Detail value={SHIPPING.origin} what="shipping origin city" />
          , Kerala.
        </P>
      </Section>

      <Section h="Delivery charges" id="charges">
        <List
          items={[
            <>
              Orders below {free}: <strong>{fee} delivery</strong>.
            </>,
            <>
              Orders of {free} and above: <strong>free delivery</strong>.
            </>,
          ]}
        />
        <P>
          The threshold is measured on {SHIPPING.thresholdBasis}. The exact delivery charge
          for your order is shown in the cart and again at checkout, before you pay.
        </P>
      </Section>

      <Section h="Dispatch and delivery times" id="dispatch">
        <P>
          These are two separate things, and we quote them separately rather than adding
          them into one number.
        </P>
        <P>
          <strong>Dispatch.</strong> We pack your order and hand it to {SHIPPING.courier}{' '}
          within <strong>{SHIPPING.processingDays}</strong> of the order being confirmed.
        </P>
        <P>
          <strong>Delivery.</strong> After dispatch, {SHIPPING.courier} typically takes:
        </P>
        <List
          items={[
            <>
              <strong>{SHIPPING.transit.local}</strong> within {SHIPPING.transit.localLabel}.
            </>,
            <>
              <strong>{SHIPPING.transit.rest}</strong> elsewhere in India.
            </>,
          ]}
        />
        <P>
          Both are estimates, not guaranteed delivery dates. Serviceability at your PIN
          code, public holidays, festival periods, weather and postal backlogs can all add
          time, and once a parcel is with {SHIPPING.courier} its progress is outside our
          control.
        </P>
      </Section>

      <Section h="Tracking" id="tracking">
        <P>
          When your order is dispatched we send you the {SHIPPING.courier} consignment
          number. You can follow it on our{' '}
          <PolicyLink to="/track-order">Track Order</PolicyLink> page, or directly on the{' '}
          <a
            href="https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2E2826', textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            India Post tracking service
          </a>
          .
        </P>
        <P>
          Tracking can take a day or so to start updating after dispatch, which is normal.
        </P>
      </Section>

      <Section h="Incorrect or incomplete addresses" id="address">
        <P>
          Please check your address and phone number before paying. We print what you give
          us. If you spot a mistake, tell us straight away at{' '}
          <Detail value={SUPPORT.email} what="support email" /> — we can usually correct it
          before dispatch, but not after.
        </P>
        <P>
          If a parcel is returned to us because the address was wrong or incomplete, or
          nobody was available to receive it, we will contact you to arrange redelivery.
          Redelivery may be chargeable.
        </P>
      </Section>

      <Section h="Undelivered and returned parcels" id="undelivered">
        <P>
          If {SHIPPING.courier} returns a parcel to us as undelivered, we will let you know
          at the number or email on the order. You can choose redelivery or a refund of the
          items; see our{' '}
          <PolicyLink to="/refund-and-cancellation-policy">
            Refund and Cancellation Policy
          </PolicyLink>{' '}
          for how refunds are handled.
        </P>
        <P>
          Our return address is <Detail value={addressLine()} what="full return address" />.
        </P>
      </Section>

      <Section h="Delayed or missing orders" id="help">
        <P>
          If your tracking has not moved for several days, or the expected window has
          passed, message us at <Detail value={SUPPORT.email} what="support email" /> with
          your order number and we will chase it with {SHIPPING.courier} on your behalf.
        </P>
      </Section>
    </PolicyPage>
  );
}
