/* Refund and Cancellation Policy.
 *
 * Each case a payment gateway expects to see answered is answered separately, including
 * the awkward ones: money debited but no order, and duplicate payments. Timelines are
 * left for the merchant to confirm rather than guessed at, because a refund promise is
 * a commitment, not copy.
 *
 * Nothing here says "all jewellery is non-returnable" or "no refunds": the shop does take
 * items back in the cases listed, and a blanket exclusion would contradict both the
 * admin's own return flow and Indian consumer law.
 */
import { P, PolicyLink, PolicyPage, Section, Detail } from '@/components/ui/Policy';
import { PAYMENTS, RETURNS, SHIPPING, SUPPORT } from '@/config/businessInfo';

export function RefundCancellation() {
  const window =
    RETURNS.windowDays > 0 ? `${RETURNS.windowDays} days of delivery` : 'the return window';

  return (
    <PolicyPage
      title="Refund and Cancellation Policy"
      path="/refund-and-cancellation-policy"
      description="When you can cancel an order, when a refund is due, how it is paid back and how long it takes."
      intro={
        <P>
          This page covers cancellations and money going back to you. For sending an item
          back or swapping it, see{' '}
          <PolicyLink to="/returns-and-replacements">Returns and Replacements</PolicyLink>.
        </P>
      }
      contents={[
        { id: 'before', label: 'Cancelling before dispatch' },
        { id: 'after', label: 'Cancelling after dispatch' },
        { id: 'we-cancel', label: 'If we cancel' },
        { id: 'no-order', label: 'Money taken, no order' },
        { id: 'duplicate', label: 'Paid twice' },
        { id: 'faulty', label: 'Wrong, damaged or missing' },
        { id: 'how', label: 'How refunds are paid' },
        { id: 'timeline', label: 'How long it takes' },
      ]}
    >
      <Section h="Cancelling before dispatch" id="before">
        <P>
          You can ask us to cancel{' '}
          <strong>
            <Detail value={RETURNS.cancellationCutoff} what="cancellation cut-off" />
          </strong>
          .
        </P>
        <P>
          Cancellation is by request, not a button: email{' '}
          <Detail value={SUPPORT.email} what="support email" /> — or use the{' '}
          <PolicyLink to="/contact-us">contact form</PolicyLink> — with your order number
          and a line saying you would like to cancel. We will reply to confirm whether the
          order was stopped in time.
        </P>
        <P>
          Once we confirm the cancellation, we refund you in full, including any delivery
          charge, by the route described below. Until you have that confirmation from us,
          please assume the order is still on its way.
        </P>
      </Section>

      <Section h="Cancelling after dispatch" id="after">
        <P>
          Once a parcel has been handed to {SHIPPING.courier} we cannot recall it, even
          within the cancellation window. At that point the{' '}
          <PolicyLink to="/returns-and-replacements">
            returns and replacement process
          </PolicyLink>{' '}
          applies instead, where it is applicable to your situation.
        </P>
        <P>
          Where an order is sent back because you changed your mind rather than because
          anything was wrong with it, the original delivery charge is not refunded.
        </P>
      </Section>

      <Section h="If we cancel your order" id="we-cancel">
        <P>
          Occasionally a piece sells out between your order and our packing it. If that
          happens we will tell you, and refund that item in full. If it makes the rest of
          the order not worth sending, we will cancel and refund all of it, delivery charge
          included. You are never left out of pocket for our stock error.
        </P>
      </Section>

      <Section h="Money taken but the order did not confirm" id="no-order">
        <P>
          If your payment was debited but you did not receive an order confirmation, the
          payment has usually not been captured and your bank will reverse it automatically,
          typically within a few working days.
        </P>
        <P>
          If it has not come back, send us the amount, the date and the {PAYMENTS.gateway}{' '}
          or bank reference at <Detail value={SUPPORT.email} what="support email" />. We will
          check it against our records and, if we hold the money, refund it. We treat an
          order as paid only once {PAYMENTS.gateway} confirms it to us.
        </P>
      </Section>

      <Section h="If you were charged twice" id="duplicate">
        <P>
          Send us both references. Where a duplicate payment reaches us for the same order,
          we refund the extra one in full. No part of a duplicate payment is kept.
        </P>
      </Section>

      <Section h="Wrong, damaged, defective or missing items" id="faulty">
        <P>
          Tell us within {window}. Depending on what you prefer and what we have in stock,
          we will send a replacement or refund you. Where the fault is ours, you pay nothing
          — not for the return, and not for resending.
        </P>
        <P>
          What we need from you, including photographs, is listed in{' '}
          <PolicyLink to="/returns-and-replacements">Returns and Replacements</PolicyLink>.
        </P>
      </Section>

      <Section h="How refunds are paid" id="how">
        <P>
          Refunds go back the way you paid, through {PAYMENTS.gateway}, to the same card,
          UPI ID or bank account. We cannot redirect a refund to a different account, and we
          do not refund in cash or vouchers unless you ask for a voucher and we agree.
        </P>
        <P>A partial refund is possible where only part of an order is affected.</P>
      </Section>

      <Section h="How long a refund takes" id="timeline">
        <P>
          Once the conditions for a refund are met and we have approved it, our target is
          to start processing it within{' '}
          <strong>
            <Detail value={RETURNS.refundInitiationDays} what="refund initiation time" />
          </strong>
          .
        </P>
        <P>
          Crediting it back to you is then down to {PAYMENTS.gateway}, the payment method
          you used and your bank — typically{' '}
          <Detail value={RETURNS.refundCompletionDays} what="typical bank credit time" />.
          We cannot give you an exact date for that step, because it is not ours to give.
          We will always send you the refund reference so you can trace it with your bank.
        </P>
        <P>
          If a refund has not arrived after that, contact us at{' '}
          <Detail value={SUPPORT.email} what="support email" /> and we will follow it up with{' '}
          {PAYMENTS.gateway}. Unresolved issues can be escalated through{' '}
          <PolicyLink to="/grievance-redressal">Grievance Redressal</PolicyLink>.
        </P>
      </Section>
    </PolicyPage>
  );
}
