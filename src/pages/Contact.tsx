import { useState } from 'react';
import { Seo } from '@/components/ui/Seo';
import { CONFIG } from '@/data/config';
import { instagramUrl, whatsappUrl } from '@/lib/format';
import { useViewport } from '@/hooks/useViewport';
import cls from './Contact.module.css';

/** WhatsApp / Instagram / Email cards, plus a message form that opens WhatsApp. */
export function Contact() {
  const { L } = useViewport();
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const cards = [
    { label: 'WhatsApp', value: 'Chat with us', href: whatsappUrl(), target: '_blank' },
    { label: 'Instagram', value: '@' + CONFIG.INSTAGRAM_HANDLE, href: instagramUrl(), target: '_blank' },
    { label: 'Email', value: CONFIG.EMAIL, href: 'mailto:' + CONFIG.EMAIL, target: '_self' },
  ];

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi Aarunya Jewels by Veena, I'm ${name || 'a customer'}. ${msg}`.trim();
    window.open(whatsappUrl(text), '_blank', 'noopener');
  };

  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: 'clamp(24px,5vw,64px) clamp(16px,4vw,40px) clamp(56px,8vw,96px)' }}>
      <Seo title="Contact Us" />
      <h1 style={{ margin: '0 0 8px', fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(34px,5vw,52px)', lineHeight: 1.05 }}>
        Contact Us
      </h1>
      <p style={{ margin: '0 0 clamp(24px,4vw,40px)', fontSize: 15, color: '#756964' }}>
        The quickest way to reach us is WhatsApp. We usually reply within a few hours.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: L.two, gap: 'clamp(20px,4vw,48px)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cards.map((c) => (
            <a key={c.label} href={c.href} target={c.target} rel="noopener" className={cls.card}>
              <span className={cls.cardLabel}>{c.label}</span>
              <span style={{ fontSize: 15.5 }}>{c.value}</span>
            </a>
          ))}
        </div>

        <form onSubmit={send} className={cls.form}>
          <h2 style={{ margin: 0, fontFamily: "'Jost',sans-serif", fontWeight: 500, fontSize: 18, letterSpacing: '.01em' }}>
            Send a message
          </h2>
          <div className={cls.field}>
            <label htmlFor="ct-name" className={cls.label}>
              Your name
            </label>
            <input
              id="ct-name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cls.input}
            />
          </div>
          <div className={cls.field}>
            <label htmlFor="ct-msg" className={cls.label}>
              Message
            </label>
            <textarea
              id="ct-msg"
              rows={5}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className={cls.textarea}
            />
          </div>
          <button type="submit" className={cls.submit}>
            Send on WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}
