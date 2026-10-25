import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { CONFIG } from '@/data/config';
import { instagramUrl } from '@/lib/format';
import { useViewport } from '@/hooks/useViewport';
import { Eyebrow } from '@/components/ui/SectionTitle';
import type { FlexCarouselItem } from '@/components/vendor/FlexCarousel/FlexCarousel';
import s from './InstagramGrid.module.css';

/* The carousel draws with WebGL, which means a shader module and `ogl` behind it — about
   25 kB gzipped that the rest of the page has no use for. It is split into its own chunk
   and fetched only once the reader is near this section, so the first screen never pays
   for a strip that sits below the story. */
const FlexCarousel = lazy(() => import('@/components/vendor/FlexCarousel/FlexCarousel'));

/* The posts, in the order they run. Each alt line says what is actually pictured, since
   this is the only description a screen reader gets for the whole strip. */
const POSTS = [
  ['ig-01', 'An Aarunya gift box, ribboned, holding a stone-set necklace and matching jhumkas'],
  ['ig-02', 'A tray of gold-tone nose pins and hoops, some stone-set, some plain'],
  ['ig-03', 'Three stone-set bangles resting on ivory silk'],
  ['ig-04', 'A stone-set bracelet and ring worn with an embroidered ivory saree'],
  ['ig-05', 'Pearl-drop chandelier earrings beside a peacock feather'],
  ['ig-06', 'A choker and matching drop earrings worn with a rose-pink saree'],
  ['ig-07', 'A chunky link chain and matching bracelet worn with ivory'],
  ['ig-08', 'A long stone necklace with bangles and jhumkas, laid on pink silk'],
  ['ig-09', 'An emerald and pearl necklace set shown on a display bust'],
  ['ig-10', 'A pearl and stone necklace with drop earrings, worn with an ivory saree'],
] as const;

const TINTS = ['#F7E4E4', '#F5ECDD', '#F3E1D7'];

/* Module-level, so the carousel is never handed a new array and never re-reads its
   textures on a parent re-render. */
const ITEMS: FlexCarouselItem[] = POSTS.map(([file, alt]) => ({
  src: `/assets/instagram/${file}.jpg`,
  alt,
}));

/**
 * Whether this browser can give us a WebGL context at all.
 *
 * The carousel draws to a canvas, so on a device that cannot it would render an empty
 * box. Asked once, at mount, and the answer decides which of the two layouts below runs.
 */
function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/** The six square tiles, for anything that cannot run the carousel. */
function PostGrid({ href }: { href: string }) {
  const { L } = useViewport();

  return (
    <div className={s.grid} style={{ gridTemplateColumns: L.igCols }}>
      {POSTS.map(([file, alt], i) => (
        <a
          key={file}
          href={href}
          target="_blank"
          rel="noopener"
          aria-label="View Aarunya on Instagram"
          className={s.tile}
          style={{ background: TINTS[i % 3] }}
        >
          <div
            role="img"
            aria-label={alt}
            className={s.image}
            style={{ background: `center/cover no-repeat url("/assets/instagram/${file}.jpg")` }}
          />
        </a>
      ))}
    </div>
  );
}

export function InstagramGrid() {
  const href = instagramUrl();
  const [webgl] = useState(supportsWebGL);
  const section = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);

  /* Starts the chunk downloading a screen before the section arrives, so by the time it
     is on screen the carousel is there to play its reveal. */
  useEffect(() => {
    const el = section.current;
    if (!el || !webgl) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [webgl]);

  return (
    <section data-fade ref={section} className={s.section}>
      <div className={s.head}>
        <Eyebrow>On Instagram</Eyebrow>
        <h2 className={s.title}>
          Follow{' '}
          <a href={href} target="_blank" rel="noopener" className={s.handle}>
            @{CONFIG.INSTAGRAM_HANDLE}
          </a>
        </h2>
      </div>

      {webgl ? (
        /* The cards run the full width of the window so they can flow away through the
           glass at each edge; the heading above keeps the page's reading width.

           The box is always here and always this tall, so the page settles at its final
           height on first paint and nothing shifts when the chunk lands inside it.

           captureWheel is off because this sits mid-page: a wheel over the carousel has
           to keep scrolling the page, and only a horizontal one moves the cards. Clicking
           a card goes to the profile, as tapping a tile used to, so focusOnClick is off
           too — one click, one outcome. */
        <div className={s.stage}>
          {near && (
            <Suspense fallback={null}>
              <FlexCarousel
                items={ITEMS}
                preset="liquid"
                intro="rise"
                fit="natural"
                cardHeight={0.62}
                gap={14}
                radius={14}
                autoplay
                interval={5}
                captions={false}
                captureWheel={false}
                focusOnClick={false}
                onSelect={() => window.open(href, '_blank', 'noopener')}
              />
            </Suspense>
          )}
        </div>
      ) : (
        <PostGrid href={href} />
      )}
    </section>
  );
}
