import { useLocation } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
import { POLICIES } from '@/data/config';

/** Title, "Last updated", then the sections from POLICIES. */
export function PolicyPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/+/, '');
  const policy = POLICIES[slug] ?? { title: '', updated: '', sections: [] };

  return (
    <article style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(28px,5vw,64px) clamp(16px,4vw,40px) clamp(56px,8vw,96px)' }}>
      <Seo title={policy.title} />
      <h1 style={{ margin: '0 0 8px', fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(34px,5vw,50px)', lineHeight: 1.08 }}>
        {policy.title}
      </h1>
      <p style={{ margin: '0 0 clamp(24px,4vw,40px)', fontSize: 12.5, color: '#756964' }}>
        Last updated {policy.updated}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {policy.sections.map((sec) => (
          <section key={sec.h} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h2 style={{ margin: 0, fontFamily: "'Jost',sans-serif", fontWeight: 500, fontSize: 18, letterSpacing: '.01em' }}>
              {sec.h}
            </h2>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: '#756964' }}>{sec.p}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
