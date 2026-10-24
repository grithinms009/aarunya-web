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

/** Six posts. Placeholder photos — swap for real posts (or an Instagram feed) later. */
const POST_IDS = [
  '1688382654723-a7366006519b',
  '1722410180687-b05b50922362',
  '1721206625226-c064ff8d92a7',
  '1633810542706-90e5ff7557be',
  '1652374968229-a66a1c170c04',
  '1701450723521-788008974862',
];

const TINTS = ['#F7E4E4', '#F5ECDD', '#F3E1D7'];

/* Module-level, so the carousel is never handed a new array and never re-reads its
   textures on a parent re-render. */
const ITEMS: FlexCarouselItem[] = POST_IDS.map((id) => ({
  src: `/assets/demo/${id}.jpg`,
  alt: 'Aarunya Instagram post',
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
