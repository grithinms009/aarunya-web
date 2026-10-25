import { useViewport } from '@/hooks/useViewport';
import s from './WhyAarunya.module.css';

/* All the line work below is drawn at 24x24 on a 1.4px stroke, so the four icons share a
   weight and sit evenly inside their medallions. */
const icon = (d: React.ReactNode) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);

const SPARKLE = icon(<>
  <path d="M12 3.2 13.7 9l5.8 1.7-5.8 1.7L12 18.2 10.3 12.4 4.5 10.7 10.3 9z" />
  <path d="M18.4 3.4 19 5.3l1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z" />
</>);

const LOTUS = icon(<>
  <path d="M12 5.2c1.7 1.7 2.6 3.6 2.6 5.8 0 2.1-.9 4-2.6 5.6-1.7-1.6-2.6-3.5-2.6-5.6 0-2.2.9-4.1 2.6-5.8z" />
  <path d="M12 16.6c-2.6 1-5 .6-7.2-1.2 1.1-2.5 2.9-3.9 5.4-4.2" />
  <path d="M12 16.6c2.6 1 5 .6 7.2-1.2-1.1-2.5-2.9-3.9-5.4-4.2" />
</>);

const LEAF = icon(<>
  <path d="M19 4.6c.8 5.6-1 9.4-5.3 11.3-2.8 1.2-5.3.7-6.8-1-1.6-1.8-1.4-4.3.4-6.3C9.6 6 13.7 4.7 19 4.6z" />
  <path d="M6.2 19.4c1.8-3.4 4.3-6 7.6-7.8" />
</>);

const GIFT = icon(<>
  <rect x="3.6" y="10.4" width="16.8" height="9.2" rx="1.4" />
  <path d="M2.8 7.2h18.4v3.2H2.8zM12 7.2v12.4" />
  <path d="M12 7.2C10.8 5 9.6 4 8.4 4a2 2 0 0 0 0 4h3.6z" />
  <path d="M12 7.2C13.2 5 14.4 4 15.6 4a2 2 0 0 1 0 4H12z" />
</>);

/* Two corner motifs, alternating down the row so the set has rhythm without repeating. */
const SPRIG = (
  <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.3"
    strokeLinecap="round" className={s.flourish} aria-hidden="true">
    <path d="M18 112C38 86 62 66 104 54" />
    <path d="M46 84c-6-9-5-18 2-25 6 7 6 16-2 25zM68 70c-4-10-1-19 7-24 4 9 1 18-7 24z" />
    <path d="M58 77c9-4 18-2 24 5-9 4-18 2-24-5zM80 64c9-5 18-3 24 4-9 5-18 3-24-4z" />
  </svg>
);

const BOW = (
  <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.3"
    strokeLinecap="round" className={s.flourish} aria-hidden="true">
    <path d="M60 60c-10-12-22-16-30-9s-3 19 11 22c10 2 15-4 19-13z" />
    <path d="M60 60c10-12 22-16 30-9s3 19-11 22c-10 2-15-4-19-13z" />
    <circle cx="60" cy="61" r="4.5" />
    <path d="M54 68 42 96M66 68l12 28" />
  </svg>
);

const CARDS = [
  { title: 'Anti-tarnish selections', text: 'Pieces that keep their shine through daily wear, with a little care.', mark: SPARKLE, flourish: SPRIG },
  { title: 'Carefully chosen designs', text: 'Every design is picked by Veena, one by one.', mark: LOTUS, flourish: BOW },
  { title: 'Everyday-friendly pieces', text: 'Light and comfortable, for college, work and family functions.', mark: LEAF, flourish: SPRIG },
  { title: 'Packed with love', text: 'Wrapped by hand and ready to gift.', mark: GIFT, flourish: BOW },
];

/** Four medallion cards: a tinted icon, a serif title over a gold rule, and a sentence.
 *  Four columns at >=900, otherwise two. */
export function WhyAarunya() {
  const { L } = useViewport();

  return (
    <section data-fade aria-label="Why Aarunya" className={s.section}>
      <div className={s.head}>
        <span className={s.eyebrow}>Why Aarunya</span>
        <h2 className={s.title}>Small brand, a lot of care</h2>
        <span className={s.ornament} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0c.7 2.6 1.6 3.5 4.2 4.2C9.6 4.9 8.7 5.8 8 8.4 7.3 5.8 6.4 4.9 3.8 4.2 6.4 3.5 7.3 2.6 8 0z" />
            <path d="M8 7.6c.7 2.6 1.6 3.5 4.2 4.2C9.6 12.5 8.7 13.4 8 16c-.7-2.6-1.6-3.5-4.2-4.2 2.6-.7 3.5-1.6 4.2-4.2z" />
          </svg>
        </span>
      </div>

      <div className={s.grid} style={{ gridTemplateColumns: L.whyCols }}>
        {CARDS.map((c) => (
          <div key={c.title} className={s.card}>
            <span className={s.badge}>{c.mark}</span>
            <h3 className={s.cardTitle}>{c.title}</h3>
            <span className={s.cardRule} aria-hidden="true" />
            <p className={s.cardText}>{c.text}</p>
            {c.flourish}
          </div>
        ))}
      </div>
    </section>
  );
}
