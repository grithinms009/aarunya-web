import { Link } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';

export function NotFound() {
  return (
    <section style={{ maxWidth: 720, margin: '0 auto', padding: '96px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <Seo title="Page not found" />
      <h1 style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 40 }}>
        This page wandered off
      </h1>
      <Link
        to="/"
        style={{ minHeight: 48, display: 'inline-flex', alignItems: 'center', padding: '0 26px', borderRadius: 999, background: '#8D3545', color: '#FFF9F6', textDecoration: 'none', fontSize: 14 }}
      >
        Back home
      </Link>
    </section>
  );
}
