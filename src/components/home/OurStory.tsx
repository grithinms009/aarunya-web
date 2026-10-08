import { Link } from 'react-router-dom';
import { useViewport } from '@/hooks/useViewport';
import { Eyebrow } from '@/components/ui/SectionTitle';
import pill from '@/components/ui/Pill.module.css';

const IMG_1 = '/assets/demo/1601121141418-c1caa10a2a0b.jpg';
const IMG_2 = '/assets/demo/1701450723521-788008974862.jpg';

/** Two offset 3:4 images with asymmetric radii, beside the brand story and a gold pill CTA. */
export function OurStory() {
  const { w } = useViewport();
  const cols = w >= 900 ? 'minmax(0,1fr) minmax(0,1fr)' : '1fr';

  return (
    <section data-fade aria-label="Our story" style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(64px,9vw,120px) clamp(16px,4vw,40px) 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 'clamp(32px,6vw,88px)', alignItems: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'clamp(10px,1.4vw,16px)', alignItems: 'start' }}>
          <div style={{ aspectRatio: '3/4', borderRadius: '20px 20px 20px 80px', overflow: 'hidden', background: '#F5E8CD', border: '1px solid #F0E2DE' }}>
            <div
              role="img"
              aria-label="Gold necklace set laid on fabric"
              style={{ width: '100%', height: '100%', background: `center/cover no-repeat url("${IMG_1}")` }}
            />
          </div>
          <div style={{ marginTop: 'clamp(36px,6vw,72px)', aspectRatio: '3/4', borderRadius: '80px 20px 20px 20px', overflow: 'hidden', background: '#F7E4E4', border: '1px solid #F0E2DE' }}>
            <div
              role="img"
              aria-label="Jhumka earrings styled with a saree"
              style={{ width: '100%', height: '100%', background: `center/cover no-repeat url("${IMG_2}")` }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18, maxWidth: 520 }}>
          <Eyebrow letterSpacing=".24em">Our story</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(34px,4.6vw,56px)', lineHeight: 1.02 }}>
            Where tradition
            <br />
            <em style={{ color: '#8D3545' }}>meets everyday</em>
          </h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.85, color: '#5E534E', fontWeight: 300 }}>
            At <strong style={{ fontWeight: 500, color: '#8D3545' }}>Aarunya Jewels by Veena</strong>, we
            believe the little pieces you wear every day should feel just as special as the ones saved
            for festivals. Every design is chosen by Veena, one by one, from our home in Kerala.
          </p>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.85, color: '#5E534E', fontWeight: 300 }}>
            From temple-inspired motifs and mango malas to delicate everyday chains, each piece
            carries a little of <strong style={{ fontWeight: 500, color: '#302722' }}>South India’s love for gold</strong>,
            made anti-tarnish so it keeps its shine.
          </p>
          <Link to="/about" className={pill.goldGradient}>
            Discover our story →
          </Link>
        </div>
      </div>
    </section>
  );
}
