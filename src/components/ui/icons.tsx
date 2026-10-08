/** SVG path data lifted verbatim from the prototype, so icon shapes match exactly. */
export const ICON_PATHS = {
  shield: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z M9 12l2 2 4-4',
  truck: 'M3 6.5h11v9.5H3z M14 10h4l3 3v3h-7 M6.5 18.5a1.5 1.5 0 1 0 0 .01 M17 18.5a1.5 1.5 0 1 0 0 .01',
  gift: 'M4 11h16v9H4z M3 7.5h18V11H3z M12 7.5V20 M12 7.5C10.5 4.5 7 4.5 7 6.3S10 7.5 12 7.5 M12 7.5c1.5-3 5-3 5-1.2S14 7.5 12 7.5',
  lock: 'M5 10.5h14V20H5z M8 10.5V8a4 4 0 0 1 8 0v2.5',
} as const;

/** The three highlight features shown under the PDP gallery and in the promise strip. */
export const FEATURE_ICONS = [
  {
    label: 'Anti-Tarnish',
    d: 'M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z',
  },
  {
    label: 'Skin Safe',
    d: 'M12 3c3 2.5 6 3 7.5 3 0 8-3.5 12.5-7.5 15C8 18.5 4.5 14 4.5 6 6 6 9 5.5 12 3z M8.8 12.2l2.2 2.2 4.2-4.4',
  },
  {
    label: 'Gift Ready',
    d: 'M4 10h16v10H4z M3 7h18v3H3z M12 7v13 M12 7c-1.5-3-5-3.5-5-1.2C7 7 9.5 7 12 7z M12 7c1.5-3 5-3.5 5-1.2C17 7 14.5 7 12 7z',
  },
] as const;

type IconProps = { size?: number; className?: string };

export const SearchIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}
    style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' }}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </svg>
);

export const AccountIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}
    style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' }}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" />
  </svg>
);

export const HeartIcon = ({ size = 24, className, fill = 'none', stroke = 'currentColor', strokeWidth = 1.9 }:
  IconProps & { fill?: string; stroke?: string; strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}
    style={{ fill, stroke, strokeWidth, strokeLinejoin: 'round' }}>
    <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" />
  </svg>
);

export const BagIcon = ({ size = 24, className, strokeWidth = 1.9 }: IconProps & { strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}
    style={{ fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinejoin: 'round' }}>
    <path d="M5.5 8h13l-1 12.5h-11z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
);

export const MenuIcon = ({ size = 25, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}
    style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' }}>
    <path d="M3.5 7h17M3.5 12h17M3.5 17h11" />
  </svg>
);

export const CloseIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}
    style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ChevronIcon = ({ size = 12, className, strokeWidth = 2.2, open = false, style }:
  IconProps & { strokeWidth?: number; open?: boolean; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}
    style={{
      fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
      transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s', ...style,
    }}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const LockIcon = ({ size = 16, className, stroke = '#9D762F', strokeWidth = 1.4 }:
  IconProps & { stroke?: string; strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}
    style={{ fill: 'none', stroke, strokeWidth, strokeLinecap: 'round' }}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </svg>
);

export const WhatsAppIcon = ({ size = 26, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}
    style={{ fill: 'none', stroke: '#FFFFFF', strokeWidth: 1.6, strokeLinejoin: 'round', strokeLinecap: 'round' }}>
    <path d="M4 20l1.3-3.9A8 8 0 1 1 8.2 19z" />
    <path d="M9.2 9.3c.3 2.2 2.3 4.2 4.5 4.6l1-1.1 1.6.7-.3 1.5c-3.3.3-7-3.3-6.7-6.6l1.5-.3.7 1.6z" />
  </svg>
);

export const PinIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}
    style={{ fill: 'none', stroke: '#8D3545', strokeWidth: 1.6, strokeLinejoin: 'round' }}>
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);

export const ArrowRightIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 16 10" aria-hidden="true" className={className}
    style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round', ...style }}>
    <path d="M1 5h14M11 1l4 4-4 4" />
  </svg>
);
