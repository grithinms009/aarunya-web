import { Link } from 'react-router-dom';
import { instagramUrl, whatsappUrl } from '@/lib/format';
import { useViewport } from '@/hooks/useViewport';
import { LockIcon } from '@/components/ui/icons';
import { SUPPORT, addressLine } from '@/config/businessInfo';
import s from './Footer.module.css';

const SHOP_LINKS = [
  { label: 'All Jewellery', href: '/shop' },
  { label: 'New Arrivals', href: '/shop?sort=new' },
  { label: 'Collections', href: '/collections' },
  { label: 'Offers', href: '/shop?sale=1' },
];

const CARE_LINKS = [
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'FAQs', href: '/faq' },
  { label: 'Track Order', href: '/track-order' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Returns & Replacements', href: '/returns-and-replacements' },
  { label: 'Refund & Cancellation', href: '/refund-and-cancellation-policy' },
];

const INFO_LINKS = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Grievance Redressal', href: '/grievance-redressal' },
];

const PAY_MARKS = ['UPI', 'RuPay', 'Visa', 'Mastercard', 'Net Banking'];

export function Footer() {
  const { L } = useViewport();

  return (
    <footer className={s.footer}>
      <div className={s.top} style={{ gridTemplateColumns: L.footCols }}>
        <div className={s.brand} style={{ gridColumn: L.footBrand }}>
          <Link to="/" aria-label="Aarunya by Veena, home" style={{ display: 'block', alignSelf: 'flex-start' }}>
            <img
              src="/assets/aarunya-logo-full-sm.png"
              alt="Aarunya by Veena"
              loading="lazy"
              style={{ display: 'block', width: 180, height: 'auto' }}
            />
          </Link>
          <p className={s.tagline}>Little treasures, chosen with love.</p>
          <div className={s.socialRow}>
            <a href={instagramUrl()} target="_blank" rel="noopener" className={s.social}>
              Instagram
            </a>
            {SUPPORT.whatsapp && (
              <a href={whatsappUrl()} target="_blank" rel="noopener" className={s.social}>
                WhatsApp
              </a>
            )}
          </div>
        </div>

        <nav aria-label="Shop" className={s.col}>
          <span className={s.colTitle}>Shop</span>
          {SHOP_LINKS.map((l) => (
            <Link key={l.href} to={l.href} className={s.colLink}>
              {l.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Customer care" className={s.col}>
          <span className={s.colTitle}>Customer Care</span>
          {CARE_LINKS.map((l) => (
            <Link key={l.href} to={l.href} className={s.colLink}>
              {l.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Information" className={s.col}>
          <span className={s.colTitle}>Information</span>
          {INFO_LINKS.map((l) => (
            <Link key={l.href} to={l.href} className={s.colLink}>
              {l.label}
            </Link>
          ))}
          <span className={s.colTitle} style={{ marginTop: 14 }}>Reach us</span>
          {SUPPORT.email && (
            <a href={`mailto:${SUPPORT.email}`} className={s.colLink}>{SUPPORT.email}</a>
          )}
          {SUPPORT.phone && (
            <a href={`tel:${SUPPORT.phoneHref}`} className={s.colLink}>{SUPPORT.phone}</a>
          )}
          {addressLine() && (
            <span className={s.colLink} style={{ cursor: 'default', lineHeight: 1.6 }}>
              {addressLine()}
            </span>
          )}
        </nav>
      </div>

      <div className={s.bottom}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#756964', marginRight: 4 }}>
            <LockIcon size={14} strokeWidth={1.5} />
            Secure payments
          </span>
          {PAY_MARKS.map((m) => (
            <span key={m} className={s.payMark}>
              {m}
            </span>
          ))}
        </div>
        <span style={{ fontSize: 12, color: '#756964' }}>
          © 2026 Aarunya Jewels by Veena. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
