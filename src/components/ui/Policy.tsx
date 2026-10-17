/* The shell every policy and information page is built from.
 *
 * It keeps the look the site already had on /shipping-policy — Cormorant heading, a
 * "Last updated" line, comfortable measure — so these pages read as part of the shop
 * rather than bolted on. Nothing here introduces new design language.
 */
import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
import { POLICIES_UPDATED } from '@/config/businessInfo';

const INK = '#2E2826';
const MUTED = '#756964';

export function PolicyPage({
  title,
  intro,
  description,
  path,
  children,
  /** Section headings to list as in-page links, for the longer documents. */
  contents,
}: {
  title: string;
  intro?: ReactNode;
  description?: string;
  path: string;
  children: ReactNode;
  contents?: { id: string; label: string }[];
}) {
  return (
    <article
      style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: 'clamp(28px,5vw,64px) clamp(16px,4vw,40px) clamp(56px,8vw,96px)',
      }}
    >
      <Seo title={title} description={description} path={path} />

      <h1
        style={{
          margin: '0 0 8px',
          fontFamily: "'Cormorant Garamond',serif",
          fontWeight: 500,
          fontSize: 'clamp(34px,5vw,50px)',
          lineHeight: 1.08,
          color: INK,
        }}
      >
        {title}
      </h1>

      <p style={{ margin: '0 0 clamp(20px,3vw,28px)', fontSize: 12.5, color: MUTED }}>
        {POLICIES_UPDATED
          ? `Last updated ${POLICIES_UPDATED}`
          : 'This page is being finalised and has not been dated yet.'}
      </p>

      {intro && (
        <div style={{ margin: '0 0 clamp(24px,4vw,36px)', fontSize: 15, lineHeight: 1.75, color: MUTED }}>
          {intro}
        </div>
      )}

      {contents && contents.length > 0 && (
        <nav
          aria-label="On this page"
          style={{
            margin: '0 0 clamp(28px,4vw,40px)',
            padding: '16px 18px',
            background: '#FBF7F4',
            border: '1px solid #EFE6DF',
            borderRadius: 10,
          }}
        >
          <span style={{ display: 'block', fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>
            On this page
          </span>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '6px 18px' }}>
            {contents.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} style={{ fontSize: 14, color: INK, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>{children}</div>
    </article>
  );
}

/** One titled section. `id` makes it linkable from the contents list. */
export function Section({
  h,
  id,
  children,
}: {
  h: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} style={{ display: 'flex', flexDirection: 'column', gap: 10, scrollMarginTop: 90 }}>
      <h2
        style={{
          margin: 0,
          fontFamily: "'Jost',sans-serif",
          fontWeight: 500,
          fontSize: 18,
          letterSpacing: '.01em',
          color: INK,
        }}
      >
        {h}
      </h2>
      <div style={{ fontSize: 15, lineHeight: 1.75, color: MUTED, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
    </section>
  );
}

export function P({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <p style={{ margin: 0, ...style }}>{children}</p>;
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

export function PolicyLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} style={{ color: INK, textDecoration: 'underline', textUnderlineOffset: 3 }}>
      {children}
    </Link>
  );
}

/**
 * Stands in for a detail the merchant has not confirmed yet.
 *
 * It never invents a value. In development it is loud, so an unfilled field cannot be
 * missed; in production it reads as a neutral note, because a vague line is far better
 * than a plausible-looking but wrong phone number or delivery promise.
 */
export function Pending({ what }: { what: string }) {
  if (import.meta.env.DEV) {
    return (
      <mark
        title={`Unconfirmed business detail: ${what}`}
        style={{ background: '#FBE9E7', color: '#8A2E22', padding: '1px 6px', borderRadius: 4, fontSize: 13 }}
      >
        [to confirm: {what}]
      </mark>
    );
  }
  return <span style={{ color: MUTED }}>(being updated)</span>;
}

/** Renders a supplied value, or the Pending note when it is still null. */
export function Detail({ value, what }: { value: string | null; what: string }) {
  return value ? <>{value}</> : <Pending what={what} />;
}
