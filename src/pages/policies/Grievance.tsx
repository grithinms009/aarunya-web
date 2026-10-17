/* Customer Grievance Redressal.
 *
 * The officer's name, designation and contact details are not invented: until the
 * merchant names a real person, those fields render as pending and the page says so.
 * The acknowledgement and resolution commitments are left for the merchant to set,
 * because they are promises, not boilerplate.
 */
import { List, P, PolicyLink, PolicyPage, Section, Detail } from '@/components/ui/Policy';
import { BRAND_NAME, GRIEVANCE, SUPPORT, addressLine } from '@/config/businessInfo';

export function Grievance() {
  return (
    <PolicyPage
      title="Customer Grievance Redressal"
      path="/grievance-redressal"
      description={`How to raise a complaint with ${BRAND_NAME} and who handles it.`}
      intro={
        <P>
          If something has gone wrong and the usual support channel has not fixed it, this
          page tells you exactly who to go to and how.
        </P>
      }
    >
      <Section h="Try support first">
        <P>
          Most problems — a late parcel, a damaged piece, a refund that has not arrived —
          are resolved fastest by writing to{' '}
          <Detail value={SUPPORT.email} what="support email" /> with your order number.
          Please start there, so we have a chance to put it right.
        </P>
      </Section>

      <Section h="Our grievance contact">
        <P>If support has not resolved it, escalate to:</P>
        <List
          items={[
            <>
              <strong>Name:</strong>{' '}
              <Detail value={GRIEVANCE.name} what="grievance officer's name" />
            </>,
            <>
              <strong>Designation:</strong>{' '}
              <Detail value={GRIEVANCE.designation} what="grievance officer's designation" />
            </>,
            <>
              <strong>Email:</strong>{' '}
              <Detail value={GRIEVANCE.email} what="grievance email" />
            </>,
            <>
              <strong>Phone:</strong>{' '}
              <Detail value={GRIEVANCE.phone} what="grievance phone number" />
            </>,
            <>
              <strong>Address:</strong>{' '}
              <Detail value={addressLine()} what="full operating address" />
            </>,
          ]}
        />
      </Section>

      <Section h="What to include">
        <P>So it can be dealt with without going back and forth, please send:</P>
        <List
          items={[
            'Your order number and the date you ordered.',
            'The name and phone number on the order.',
            'What went wrong, and what you have already been told.',
            'Photographs, if the complaint is about the piece itself.',
            'What you would like us to do about it.',
          ]}
        />
      </Section>

      <Section h="What happens next">
        <P>
          {GRIEVANCE.name ?? 'The owner'} reads the complaint personally, looks into what
          happened, and writes back to you with an outcome and an explanation. Aarunya is
          a small shop: the person who answers your complaint is the person who runs it.
        </P>
        <P>
          We have not published a fixed acknowledgement or resolution deadline, because we
          would rather not commit to a timescale we cannot be certain of keeping. We aim to
          come back to you quickly, and we will tell you if something is going to take
          longer than expected.
        </P>
      </Section>

      <Section h="If you are still not satisfied">
        <P>
          You keep every right you have under Indian consumer law, including approaching the
          National Consumer Helpline or the consumer forum for your district. Nothing on
          this site takes those rights away.
        </P>
        <P>
          Related reading:{' '}
          <PolicyLink to="/refund-and-cancellation-policy">Refunds and Cancellations</PolicyLink>,{' '}
          <PolicyLink to="/returns-and-replacements">Returns and Replacements</PolicyLink>, and{' '}
          <PolicyLink to="/terms-and-conditions">Terms and Conditions</PolicyLink>.
        </P>
      </Section>
    </PolicyPage>
  );
}
