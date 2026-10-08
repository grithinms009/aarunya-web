import type { ReactNode } from 'react';

/** H2 centred between two 7×7 gold squares rotated 45°, with a 44×1px gold rule below. */
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 'clamp(20px,3vw,32px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond filled />
        <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(28px,3.6vw,40px)', lineHeight: 1.1, textAlign: 'center' }}>
          {children}
        </h2>
        <Diamond filled />
      </div>
      <GoldRule />
    </div>
  );
}

/** Eyebrow + H2 pair used by the Sale, Why Aarunya, Instagram and Pair-it-up sections. */
export function EyebrowTitle({
  eyebrow,
  children,
  size = 'clamp(30px,4vw,42px)',
  rule = false,
  gap = 8,
  marginBottom = 'clamp(24px,4vw,44px)',
  letterSpacing = '.22em',
  lineHeight = 1.1,
}: {
  eyebrow: string;
  children: ReactNode;
  size?: string;
  rule?: boolean;
  gap?: number;
  marginBottom?: string;
  letterSpacing?: string;
  lineHeight?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap, marginBottom }}>
      <Eyebrow letterSpacing={letterSpacing}>{eyebrow}</Eyebrow>
      <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: size, lineHeight }}>
        {children}
      </h2>
      {rule && <GoldRule marginTop={4} />}
    </div>
  );
}

export function Eyebrow({
  children,
  letterSpacing = '.22em',
  size = 11,
}: {
  children: ReactNode;
  letterSpacing?: string;
  size?: number;
}) {
  return (
    <span style={{ fontSize: size, letterSpacing, textTransform: 'uppercase', color: '#8A6527' }}>
      {children}
    </span>
  );
}

/** 44×1px gold rule. */
export function GoldRule({ marginTop = 0 }: { marginTop?: number }) {
  return <span aria-hidden="true" style={{ width: 44, height: 1, background: '#C79A45', marginTop }} />;
}

/** Small gold diamond — filled (section titles) or 1px outline (marquee, feature cards). */
export function Diamond({
  size = 7,
  filled = false,
  color = '#C79A45',
  style,
}: {
  size?: number;
  filled?: boolean;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        ...(filled ? { background: color } : { border: `1px solid ${color}` }),
        transform: 'rotate(45deg)',
        flex: 'none',
        ...style,
      }}
    />
  );
}

/** Rule · diamond · rule ornament above the mobile hero heading. */
export function HeroOrnament() {
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 34, height: 1, background: '#C79A45' }} />
      <Diamond size={6} />
      <span style={{ width: 34, height: 1, background: '#C79A45' }} />
    </div>
  );
}
