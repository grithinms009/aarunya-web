/* Contact Us.
 *
 * The form posts to POST /api/contact, which stores the message server-side. It reports
 * success only when the API returns one — a failure says so and points at the email and
 * phone instead, rather than showing a reassuring tick over a message that went nowhere.
 */
import { useState } from 'react';
import { P, PolicyLink, PolicyPage, Section, Detail } from '@/components/ui/Policy';
import { api } from '@/data/api';
import { instagramUrl, whatsappUrl } from '@/lib/format';
import {
  ADDRESS, BRAND_NAME, GRIEVANCE, SUPPORT, addressLine,
} from '@/config/businessInfo';

const INK = '#2E2826';
const MUTED = '#756964';

const field: React.CSSProperties = {
  width: '100%',
  padding: '11px 13px',
  border: '1px solid #E3D9D2',
  borderRadius: 8,
  background: '#fff',
  font: 'inherit',
  fontSize: 15,
  color: INK,
};

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  fontSize: 13.5,
  color: MUTED,
};

type State = 'idle' | 'sending' | 'sent' | 'failed';

export function ContactUs() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', orderNo: '', subject: '', message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<State>('idle');
  const [failure, setFailure] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: '' }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Please tell us your name.';
    if (!form.message.trim()) next.message = 'Please write your message.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = 'Enter a valid email address.';
    }
    if (form.phone && form.phone.replace(/\D/g, '').length < 10) {
      next.phone = 'Enter a 10-digit mobile number.';
    }
    if (!form.email.trim() && !form.phone.trim()) {
      next.email = 'Leave an email address or a phone number so we can reply.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setState('sending');
    try {
      await api.sendMessage(form);
      setState('sent');
    } catch (err) {
      setState('failed');
      setFailure(err instanceof Error ? err.message : 'Your message could not be sent.');
    }
  };

  return (
    <PolicyPage
      title="Contact Us"
      path="/contact-us"
      description={`Reach ${BRAND_NAME} by email or phone, and see our correspondence address and how we handle messages.`}
      intro={<P>Questions about an order, a piece, or anything else — we read everything ourselves.</P>}
    >
      <Section h="How to reach us">
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <li>
            <strong style={{ color: INK }}>Email</strong>
            <br />
            {SUPPORT.email ? (
              <a href={`mailto:${SUPPORT.email}`} style={{ color: MUTED }}>{SUPPORT.email}</a>
            ) : (
              <Detail value={null} what="support email" />
            )}
          </li>
          <li>
            <strong style={{ color: INK }}>Phone</strong>
            <br />
            {SUPPORT.phone ? (
              <a href={`tel:${SUPPORT.phoneHref}`} style={{ color: MUTED }}>{SUPPORT.phone}</a>
            ) : (
              <Detail value={null} what="support phone number" />
            )}
          </li>
          {SUPPORT.whatsapp && (
            <li>
              <strong style={{ color: INK }}>WhatsApp</strong>
              <br />
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" style={{ color: MUTED }}>
                Message us on WhatsApp
              </a>
            </li>
          )}
          {SUPPORT.instagram && (
            <li>
              <strong style={{ color: INK }}>Instagram</strong>
              <br />
              <a href={instagramUrl()} target="_blank" rel="noopener noreferrer" style={{ color: MUTED }}>
                @{SUPPORT.instagram}
              </a>
            </li>
          )}
        </ul>
      </Section>

      <Section h="When we are available">
        <P>{SUPPORT.responseNote}</P>
        <P style={{ fontSize: 13.5 }}>
          We are a small shop, so replies come from a person rather than a desk — we have
          not set a guaranteed response time we might not be able to keep.
        </P>
      </Section>

      <Section h="Our address">
        <P>
          <Detail value={addressLine()} what="full operating address" />
        </P>
        <P>
          This is also the address returns are sent to — please check with us before posting
          anything back, as set out in{' '}
          <PolicyLink to="/returns-and-replacements">Returns and Replacements</PolicyLink>.
        </P>
        <P style={{ fontSize: 13.5 }}>
          We are an online shop operating from {ADDRESS.state}; this is our correspondence
          and return address, not a walk-in showroom. Please do not post anything back
          before we have confirmed a return.
        </P>
      </Section>

      <Section h="Send us a message">
        {state === 'sent' ? (
          <div
            role="status"
            style={{ padding: '18px 20px', background: '#F3F7F1', border: '1px solid #D9E6D4', borderRadius: 10 }}
          >
            <strong style={{ color: INK, display: 'block', marginBottom: 4 }}>
              Thank you — your message has reached us.
            </strong>
            <span>We will reply on the email or number you gave us.</span>
          </div>
        ) : (
          <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={labelStyle}>
              Your name
              <input
                name="name" value={form.name} onChange={set('name')}
                aria-invalid={!!errors.name} style={field} autoComplete="name"
              />
              {errors.name && <span style={{ color: '#A33' }}>{errors.name}</span>}
            </label>

            <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
              <label style={labelStyle}>
                Email
                <input
                  name="email" type="email" value={form.email} onChange={set('email')}
                  aria-invalid={!!errors.email} style={field} autoComplete="email"
                />
                {errors.email && <span style={{ color: '#A33' }}>{errors.email}</span>}
              </label>
              <label style={labelStyle}>
                Phone
                <input
                  name="phone" type="tel" value={form.phone} onChange={set('phone')}
                  aria-invalid={!!errors.phone} style={field} autoComplete="tel"
                />
                {errors.phone && <span style={{ color: '#A33' }}>{errors.phone}</span>}
              </label>
            </div>

            <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
              <label style={labelStyle}>
                Order number <span style={{ opacity: 0.7 }}>(if your message is about one)</span>
                <input name="orderNo" value={form.orderNo} onChange={set('orderNo')} style={field} />
              </label>
              <label style={labelStyle}>
                Subject
                <input name="subject" value={form.subject} onChange={set('subject')} style={field} />
              </label>
            </div>

            <label style={labelStyle}>
              Message
              <textarea
                name="message" value={form.message} onChange={set('message')} rows={5}
                aria-invalid={!!errors.message} style={{ ...field, resize: 'vertical' }}
              />
              {errors.message && <span style={{ color: '#A33' }}>{errors.message}</span>}
            </label>

            {state === 'failed' && (
              <div role="alert" style={{ padding: '14px 16px', background: '#FBE9E7', border: '1px solid #F0CFC9', borderRadius: 10, fontSize: 14 }}>
                <strong style={{ color: '#8A2E22', display: 'block', marginBottom: 4 }}>
                  Your message was not sent.
                </strong>
                {failure} Please try again, or email or call us instead — the details are
                above.
              </div>
            )}

            <button
              type="submit"
              disabled={state === 'sending'}
              style={{
                alignSelf: 'flex-start', padding: '12px 26px', border: 'none', borderRadius: 999,
                background: INK, color: '#fff', font: 'inherit', fontSize: 14,
                letterSpacing: '.04em', cursor: state === 'sending' ? 'default' : 'pointer',
                opacity: state === 'sending' ? 0.65 : 1,
              }}
            >
              {state === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
      </Section>

      <Section h="Other useful pages">
        <P>
          <PolicyLink to="/shipping-policy">Shipping and Delivery</PolicyLink> ·{' '}
          <PolicyLink to="/refund-and-cancellation-policy">Refunds and Cancellations</PolicyLink> ·{' '}
          <PolicyLink to="/returns-and-replacements">Returns and Replacements</PolicyLink> ·{' '}
          <PolicyLink to="/track-order">Track Order</PolicyLink>
        </P>
        <P>
          If a reply has not resolved your issue, our grievance contact is{' '}
          <Detail value={GRIEVANCE.name} what="grievance officer name" /> —{' '}
          <PolicyLink to="/grievance-redressal">how to escalate</PolicyLink>.
        </P>
      </Section>
    </PolicyPage>
  );
}
