/* Privacy Policy.
 *
 * Written against what the site and the API actually do: the checkout collects a name,
 * phone, optional email and a delivery address; Razorpay handles the payment; India Post
 * gets what it needs to deliver. There is no analytics, advertising or tracking script in
 * this codebase, so none is claimed here — add a section if one is ever introduced.
 */
import { List, P, PolicyLink, PolicyPage, Section, Detail } from '@/components/ui/Policy';
import {
  BRAND_NAME, GRIEVANCE, MERCHANT, PAYMENTS, SHIPPING, SUPPORT, addressLine,
} from '@/config/businessInfo';

export function Privacy() {
  return (
    <PolicyPage
      title="Privacy Policy"
      path="/privacy-policy"
      description={`How ${BRAND_NAME} collects, uses and protects your personal information.`}
      intro={
        <P>
          This policy explains what we collect when you shop with us, why we need it, and
          what you can ask us to do with it. We collect as little as we can and we do not
          sell it to anyone.
        </P>
      }
      contents={[
        { id: 'what', label: 'What we collect' },
        { id: 'why', label: 'Why we need it' },
        { id: 'payments', label: 'Payments' },
        { id: 'sharing', label: 'Who we share it with' },
        { id: 'cookies', label: 'Cookies' },
        { id: 'keeping', label: 'How long we keep it' },
        { id: 'rights', label: 'Your choices' },
        { id: 'security', label: 'Security' },
        { id: 'contact', label: 'Contact' },
      ]}
    >
      <Section h="What we collect" id="what">
        <P>When you place an order we ask for:</P>
        <List
          items={[
            'Your name.',
            'A mobile number, so we and the courier can reach you about the delivery.',
            'An email address, if you give one, for order updates.',
            'The delivery address, including city, state and PIN code.',
            'What you ordered, and the amount paid.',
          ]}
        />
        <P>
          We also keep a record of messages you send us, so we can follow up on them. If you
          browse without ordering, your basket and wishlist are stored only in your own
          browser and are not sent to us.
        </P>
      </Section>

      <Section h="Why we need it" id="why">
        <List
          items={[
            'To confirm, pack and deliver your order.',
            'To contact you about that order, including delivery problems.',
            'To handle returns, replacements and refunds.',
            'To keep the business records we are required to keep.',
          ]}
        />
        <P>We do not use your details for marketing unless you ask us to.</P>
      </Section>

      <Section h="Payments" id="payments">
        <P>
          Payments are processed by {PAYMENTS.gateway}. You enter your card, UPI or banking
          details with {PAYMENTS.gateway} directly.
        </P>
        <P>
          <strong>
            We never see or store your card number, CVV, UPI PIN, passwords or any other
            payment credential.
          </strong>{' '}
          What reaches us is the outcome of the payment and a reference number so we can
          match it to your order and process a refund if one is due. {PAYMENTS.gateway}{' '}
          handles that data under its own privacy policy.
        </P>
      </Section>

      <Section h="Who we share it with" id="sharing">
        <List
          items={[
            <>
              <strong>{SHIPPING.courier}</strong>, our delivery partner, receives your name,
              address and phone number so your parcel can be delivered and tracked.
            </>,
            <>
              <strong>{PAYMENTS.gateway}</strong>, our payment gateway, receives what it
              needs to process the payment.
            </>,
            'Government authorities, where the law requires it.',
          ]}
        />
        <P>That is the whole list. We do not sell or rent your information.</P>
      </Section>

      <Section h="Cookies and analytics" id="cookies">
        <P>
          This site does not run advertising trackers or third-party analytics. It stores a
          small amount of information in your own browser — your basket, wishlist and
          saved PIN code — so the shop remembers them between visits. Clearing your browser
          data removes them.
        </P>
      </Section>

      <Section h="How long we keep it" id="keeping">
        <P>
          Order records are kept for as long as we need them for accounting, tax and
          warranty purposes. Messages you send us are kept while the matter is open and for
          a reasonable period afterwards.
        </P>
      </Section>

      <Section h="Your choices" id="rights">
        <P>You can ask us to:</P>
        <List
          items={[
            'Tell you what information we hold about you.',
            'Correct anything that is wrong.',
            'Delete your details, where we are not required to keep them.',
            'Stop contacting you other than about an open order.',
          ]}
        />
        <P>
          Write to <Detail value={SUPPORT.email} what="support email" /> and we will respond.
          We may need to confirm who you are first.
        </P>
      </Section>

      <Section h="Security" id="security">
        <P>
          The site is served over HTTPS, payments go directly to {PAYMENTS.gateway}, and
          access to order records is limited to the people who run the shop. We take this
          seriously, but no method of transmission or storage can be called completely
          secure, and we will not claim otherwise.
        </P>
      </Section>

      <Section h="Contact" id="contact">
        <P>
          For any privacy question or request, contact{' '}
          <Detail value={MERCHANT.legalName} what="proprietor's legal name" /> at{' '}
          <Detail value={SUPPORT.email} what="support email" />, or by post at{' '}
          <Detail value={addressLine()} what="full operating address" />.
        </P>
        <P>
          If you are not satisfied with our response, our grievance contact is{' '}
          <Detail value={GRIEVANCE.name} what="grievance officer name" /> —{' '}
          <PolicyLink to="/grievance-redressal">how to escalate</PolicyLink>.
        </P>
      </Section>
    </PolicyPage>
  );
}
