import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useCatalog } from '@/hooks/useCatalog';
import { useCartSync } from '@/hooks/useCart';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import { useUi } from '@/store/useStore';
import { AnnouncementBar } from './AnnouncementBar';
import { CartDrawer } from './CartDrawer';
import { Footer } from './Footer';
import { Header } from './Header';
import { Loader } from './Loader';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from './SearchOverlay';
import { Toast } from './Toast';
import { WhatsAppButton } from './WhatsAppButton';

export function Layout() {
  const location = useLocation();
  const { ready } = useCatalog();
  const { closeAll, cartOpen, menuOpen, searchOpen, stickyBar } = useUi();
  const mainRef = useRef<HTMLElement>(null);
  const pageAnim = useRef<Animation | null>(null);
  const [loaderDone, setLoaderDone] = useState(false);
  const firstPage = useRef(true);

  useCartSync();
  useScrollReveal(location.pathname);

  const anyOverlay = cartOpen || menuOpen || searchOpen;
  useBodyScrollLock(anyOverlay || !loaderDone);

  /** Main content fades in from translateY(18px) over 820ms. */
  const pageIn = useCallback(() => {
    const el = mainRef.current;
    if (!el?.animate || prefersReducedMotion()) return;
    pageAnim.current?.cancel();
    pageAnim.current = el.animate(
      [
        { opacity: 0, transform: 'translate3d(0,18px,0)' },
        { opacity: 0.6, offset: 0.4 },
        { opacity: 1, transform: 'translate3d(0,0,0)' },
      ],
      { duration: 820, easing: 'cubic-bezier(.16,1,.3,1)' },
    );
  }, []);

  // Esc closes every overlay.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeAll]);

  // A route change closes overlays and returns to the top of the page.
  useEffect(() => {
    closeAll();
    window.scrollTo(0, 0);
  }, [location.pathname, closeAll]);

  // Animate each route change, but let the loader's own hand-off drive the very first page.
  useEffect(() => {
    if (!loaderDone) return;
    if (firstPage.current) {
      firstPage.current = false;
      return;
    }
    pageIn();
  }, [location.pathname, location.search, loaderDone, pageIn]);

  const onLoaderDone = useCallback(() => {
    setLoaderDone(true);
    pageIn();
  }, [pageIn]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        fontFamily: "'Jost',sans-serif",
        fontWeight: 400,
        color: '#302722',
        overflowX: 'clip',
        paddingBottom: stickyBar ? 76 : 0,
      }}
    >
      {!loaderDone && <Loader ready={ready} onDone={onLoaderDone} />}

      <AnnouncementBar />
      <Header />

      <main id="main" ref={mainRef}>
        <Outlet />
      </main>

      <Footer />

      <WhatsAppButton liftedForStickyBar={stickyBar} />
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />
      <Toast raised={stickyBar} />
    </div>
  );
}
