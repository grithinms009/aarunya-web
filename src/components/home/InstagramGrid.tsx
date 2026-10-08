import { CONFIG } from '@/data/config';
import { instagramUrl } from '@/lib/format';
import { useViewport } from '@/hooks/useViewport';
import { Eyebrow } from '@/components/ui/SectionTitle';
import s from './InstagramGrid.module.css';

/** Six square tiles. Placeholder photos — swap for real posts (or an Instagram feed) later. */
const POST_IDS = [
  '1688382654723-a7366006519b',
  '1722410180687-b05b50922362',
  '1721206625226-c064ff8d92a7',
  '1633810542706-90e5ff7557be',
  '1652374968229-a66a1c170c04',
  '1701450723521-788008974862',
];

const TINTS = ['#F7E4E4', '#F5ECDD', '#F3E1D7'];

export function InstagramGrid() {
  const { L } = useViewport();
  const href = instagramUrl();

  return (
    <section data-fade style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(56px,8vw,100px) clamp(16px,4vw,40px) 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8, marginBottom: 'clamp(20px,3vw,32px)' }}>
        <Eyebrow>On Instagram</Eyebrow>
        <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(28px,3.6vw,40px)', lineHeight: 1.15 }}>
          Follow{' '}
          <a href={href} target="_blank" rel="noopener" className={s.handle}>
            @{CONFIG.INSTAGRAM_HANDLE}
          </a>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: L.igCols, gap: 'clamp(6px,1vw,14px)' }}>
        {POST_IDS.map((id, i) => (
          <a
            key={id}
            href={href}
            target="_blank"
            rel="noopener"
            aria-label="View Aarunya on Instagram"
            className={s.tile}
            style={{ background: TINTS[i % 3] }}
          >
            <div
              role="img"
              aria-label="Aarunya Instagram post"
              className={s.image}
              style={{ background: `center/cover no-repeat url("/assets/demo/${id}.jpg")` }}
            />
          </a>
        ))}
      </div>
    </section>
  );
}
