/* Returns, Exchanges and Replacements.
 *
 * The rules here mirror what the admin's returns workflow actually enforces: a window
 * measured from delivery, an unboxing video where the policy requires one, and categories
 * the merchant has marked exchange-only. Those settings are read live, so this page
 * follows the shop rather than drifting from it.
 *
 * The hygiene exclusion is stated as what it is — a restriction on change-of-mind returns
 * for pierced jewellery — and explicitly does not apply when an item arrives damaged or
 * wrong, which is where a blanket exclusion would overreach.
 */
import { List, P, PolicyLink, PolicyPage, Section, Detail } from '@/components/ui/Policy';
import { CATEGORIES, CONFIG } from '@/data/config';
import { RETURNS, SHIPPING, SUPPORT, addressLine } from '@/config/businessInfo';

export function Returns() {
  const days = RETURNS.windowDays;
  /* Categories the merchant has marked as exchange-only unless the piece is damaged. */
  const restricted = (CONFIG.nonEligible ?? [])
    .map((slug) => CATEGORIES.find((c) => c.slug === slug)?.name ?? slug)
    .filter(Boolean);

  return (
    <PolicyPage
      title="Returns, Exchanges and Replacements"
      path="/returns-and-replacements"
      description="How to return or exchange a piece, what we need from you, and how replacements are sent."
      intro={
        <P>
          We want you to be happy with what arrives. If something is wrong, tell us quickly
          and we will sort it out. For how the money comes back, see{' '}
          <PolicyLink to="/refund-and-cancellation-policy">
            Refund and Cancellation Policy
          </PolicyLink>
          .
        </P>
      }
      contents={[
        { id: 'window', label: 'How long you have' },
        { id: 'covered', label: 'What we cover' },
        { id: 'evidence', label: 'What we need from you' },
        { id: 'condition', label: 'Condition of the item' },
        { id: 'hygiene', label: 'Pierced jewellery' },
        { id: 'how', label: 'How to raise a request' },
        { id: 'postage', label: 'Return postage' },
        { id: 'inspection', label: 'Inspection and approval' },
        { id: 'replacement', label: 'Replacements' },
      ]}
    >
      <Section h="How long you have" id="window">
        <P>
          Raise a request within{' '}
          {days > 0 ? <strong>{days} days of delivery</strong> : <Detail value={null} what="return window in days" />}
          . We measure it from the date the courier records delivery. After that we may not
          be able to help, though we will always look at a genuine fault.
        </P>
      </Section>

      <Section h="What we cover" id="covered">
        <P>We will replace or refund a piece when:</P>
        <List
          items={[
            'It arrived damaged or broken.',
            'It is faulty — a clasp that will not close, a stone missing, plating flaking on arrival.',
            'You received the wrong item or the wrong colour.',
            'Something listed on your invoice is missing from the parcel.',
          ]}
        />
        <P>
          Small variations in shade, finish and size between the photograph and the piece
          are normal for plated fashion jewellery and are not treated as faults. Wear and
          tear, damage from perfume, water or sanitiser, and accidental damage after
          delivery are not covered.
        </P>
      </Section>

      <Section h="What we need from you" id="evidence">
        <P>Please send us:</P>
        <List
          items={[
            'Your order number.',
            'Which piece it is, and how many.',
            'What the problem is, in your own words.',
            'Clear photographs showing it, including the packaging if the parcel arrived damaged.',
            <>
              An <strong>unedited video of the parcel being opened</strong>, where you have
              one — a single continuous recording started before the seal is broken.
            </>,
          ]}
        />
        <P>
          The opening video is the single most useful thing you can send, especially for a
          damaged, missing or incorrect item: it is how we tell a transit problem from a
          packing one, and it lets us settle a claim with {SHIPPING.courier} quickly. We
          ask for it strongly, and getting into the habit of recording is worth it.
        </P>
        <P>
          Not having one does not automatically end the matter, and it does not take away
          any right you have under consumer law. We will still look at your request on
          what you can show us — it may simply take longer to resolve.
        </P>
      </Section>

      <Section h="Condition of the item" id="condition">
        <P>
          Send the piece back unworn, with its tags, pouch and any packaging it came in.
          We cannot accept a piece that has been worn, resized, altered or cleaned with
          chemicals, except where that is what caused the fault.
        </P>
      </Section>

      {restricted.length > 0 && (
        <Section h="Pierced jewellery and hygiene" id="hygiene">
          <P>
            For hygiene reasons we cannot take back{' '}
            <strong>{restricted.join(' and ')}</strong> simply because you changed your mind.
          </P>
          <P>
            This does <strong>not</strong> apply if the piece arrived damaged, faulty or was
            not what you ordered — those are always covered, whatever the category.
          </P>
        </Section>
      )}

      <Section h="How to raise a request" id="how">
        <P>
          Email <Detail value={SUPPORT.email} what="support email" />, use the{' '}
          <PolicyLink to="/contact-us">contact form</PolicyLink>, or use the Request
          Replacement button on your order in{' '}
          <PolicyLink to="/track-order">Track Order</PolicyLink> — whichever is easiest.
        </P>
        <P>
          We review every request ourselves, against what you have sent us, and write back
          to tell you the outcome and what happens next. Please wait for that before
          posting anything back to us.
        </P>
      </Section>

      <Section h="Return postage" id="postage">
        <P>
          <Detail value={RETURNS.returnShipping} what="who pays return postage, and when" />
        </P>
        <P>
          Our return address is <Detail value={addressLine()} what="full return address" />.
          Please do not send anything to any other address.
        </P>
      </Section>

      <Section h="Inspection and approval" id="inspection">
        <P>
          Once the piece reaches us we check it against what was reported. If it is as
          described, we approve the replacement or refund straight away and tell you which
          is happening. If it is not, we will explain why and send the piece back to you at
          our cost.
        </P>
      </Section>

      <Section h="Replacements" id="replacement">
        <P>
          A replacement is sent once the return is approved, with {SHIPPING.courier} tracking
          you can follow on <PolicyLink to="/track-order">Track Order</PolicyLink>.
        </P>
        <P>
          If the same piece in the same colour is out of stock, we will offer you an
          alternative or a full refund — your choice. We will not hold your money while we
          wait for stock.
        </P>
      </Section>
    </PolicyPage>
  );
}
