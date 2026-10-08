import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface Crumb {
  label: string;
  href?: string;
  /** Muted when a deeper crumb follows (the shop breadcrumb dims the category link). */
  muted?: boolean;
}

/** Home / Shop / … — slash separators, matching the shop and collections pages. */
export function Breadcrumb({ crumbs, marginBottom = 12 }: { crumbs: Crumb[]; marginBottom?: number }) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{ fontSize: 13, color: '#756964', display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom }}
    >
      {crumbs.map((c, i) => (
        <Fragment key={`${c.label}-${i}`}>
          {i > 0 && <span>/</span>}
          {c.href ? (
            <Link to={c.href} style={{ color: c.muted ? '#756964' : '#756964', textDecoration: 'none' }}>
              {c.label}
            </Link>
          ) : (
            <span style={{ color: '#302722' }}>{c.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}

/** Home ▸ Category ▸ Name — uppercase, gold carets. Used only on the product page. */
export function PdpBreadcrumb({ children }: { children: ReactNode }) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        fontSize: 12, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase',
        color: '#756964', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10,
        marginBottom: 'clamp(18px,2.6vw,30px)',
      }}
    >
      {children}
    </nav>
  );
}

export const Caret = () => (
  <span aria-hidden="true" style={{ color: '#C79A45', fontSize: 9 }}>
    ▸
  </span>
);
