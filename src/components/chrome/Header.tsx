import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCatalog } from '@/hooks/useCatalog';
import { useCart } from '@/hooks/useCart';
import { useViewport } from '@/hooks/useViewport';
import { categoryHref, hasSubs } from '@/lib/catalog';
import { routeNameOf, type RouteName } from '@/lib/route';
import { useShop, useUi } from '@/store/useStore';
import {
  AccountIcon, BagIcon, ChevronIcon, HeartIcon, MenuIcon, SearchIcon,
} from '@/components/ui/icons';
import s from './Header.module.css';

/** Nav items, with the route names each one highlights for. */
const NAV: { label: string; href: string; keys: RouteName[] }[] = [
  { label: 'Home', href: '/', keys: ['home'] },
  { label: 'Shop', href: '/shop', keys: ['shop', 'category', 'product'] },
  { label: 'Collections', href: '/collections', keys: ['collections'] },
  { label: 'About Us', href: '/about', keys: ['about'] },
  { label: 'Contact', href: '/contact', keys: ['contact'] },
];

/** How long the mega menu waits before closing after the pointer leaves. */
const MEGA_CLOSE_DELAY = 120;

export function Header() {
  const { pathname } = useLocation();
  const route = routeNameOf(pathname);
  const { isDesktop } = useViewport();
  const { categories } = useCatalog();
  const cart = useCart();
  const wish = useShop((st) => st.wish);
  const { openMenu, openSearch, openCart, megaOpen, setMega, flash } = useUi();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega(false), MEGA_CLOSE_DELAY);
  };

  // "Shop" stays unhighlighted on a category page — "Jewellery" owns that state instead.
  const navState = (item: (typeof NAV)[number]) => {
    const active = item.keys.includes(route) && !(item.label === 'Shop' && route === 'category');
    return {
      color: active ? '#8D3545' : '#302722',
      borderBottom: active ? '2px solid #C79A45' : '2px solid transparent',
    };
  };
  const jewActive = route === 'category';

  const navA = NAV.slice(0, 2);
  const navB = NAV.slice(2);

  const megaGroups = categories.filter(hasSubs);
  const megaSingles = categories.filter((c) => !hasSubs(c));

  return (
    <header className={s.header}>
      {!isDesktop && (
        <div className={s.mobileRow}>
          <div style={{ display: 'flex' }}>
            <button type="button" aria-label="Open menu" onClick={openMenu} className={s.plainBtn}>
              <MenuIcon />
            </button>
          </div>
          <Link to="/" aria-label="Aarunya by Veena, home" className={s.logoLink}>
            <img src="/assets/aarunya-mark-sm.png" alt="" style={{ display: 'block', height: 38, width: 'auto' }} />
            <img src="/assets/aarunya-wordmark-sm.png" alt="Aarunya by Veena" style={{ display: 'block', height: 24, width: 'auto' }} />
          </Link>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" aria-label="Search" onClick={openSearch} className={s.plainBtn}>
              <SearchIcon />
            </button>
            <button type="button" aria-label={cart.ariaLabel} onClick={openCart} className={s.plainBtn}>
              <BagIcon />
              {cart.has && <span className={s.badge}>{cart.count}</span>}
            </button>
          </div>
        </div>
      )}

      {isDesktop && (
        <div className={s.desktopRow}>
          <Link to="/" aria-label="Aarunya by Veena, home" className={s.desktopLogo}>
            <img src="/assets/aarunya-mark-sm.png" alt="" style={{ display: 'block', height: 'clamp(40px,3.6vw,52px)', width: 'auto' }} />
            <img src="/assets/aarunya-wordmark-sm.png" alt="Aarunya by Veena" style={{ display: 'block', height: 'clamp(24px,2.2vw,32px)', width: 'auto' }} />
          </Link>

          <nav aria-label="Main" className={s.nav}>
            {navA.map((item) => (
              <Link key={item.href} to={item.href} className={s.navLink} style={navState(item)}>
                {item.label}
              </Link>
            ))}

            <div className={s.megaWrap} onMouseEnter={openMega} onMouseLeave={closeMega}>
              <button
                type="button"
                aria-expanded={megaOpen}
                aria-controls="mega-menu"
                onClick={() => setMega(!megaOpen)}
                className={s.megaBtn}
                style={{
                  color: jewActive ? '#8D3545' : '#302722',
                  borderBottom: jewActive ? '2px solid #C79A45' : '2px solid transparent',
                }}
              >
                Jewellery
                <ChevronIcon size={12} open={megaOpen} />
              </button>

              <div
                id="mega-menu"
                className={s.megaPanel}
                style={{
                  opacity: megaOpen ? 1 : 0,
                  visibility: megaOpen ? 'visible' : 'hidden',
                  transform: `translateY(${megaOpen ? '0' : '-6px'})`,
                }}
              >
                <div className={s.megaGrid}>
                  {megaGroups.map((c) => (
                    <div key={c.slug} className={s.megaCol}>
                      <Link to={categoryHref(c)} onClick={closeMega} className={s.megaHead}>
                        {c.short}
                      </Link>
                      {(c.subs ?? []).map((t) => (
                        <Link key={t.slug} to={categoryHref(c, t)} onClick={closeMega} className={s.megaLink}>
                          {t.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                  <div className={s.megaCol}>
                    <span className={s.megaHead}>More</span>
                    {megaSingles.map((c) => (
                      <Link key={c.slug} to={categoryHref(c)} onClick={closeMega} className={s.megaLink}>
                        {c.short}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className={s.megaFooter}>
                  <Link to="/shop" onClick={closeMega} className={s.megaAll}>
                    Shop all jewellery →
                  </Link>
                </div>
              </div>
            </div>

            {navB.map((item) => (
              <Link key={item.href} to={item.href} className={s.navLink} style={navState(item)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={s.actions}>
            <button type="button" aria-label="Search" onClick={openSearch} className={s.iconBtn}>
              <SearchIcon />
            </button>
            <button
              type="button"
              aria-label="Account"
              onClick={() => flash('Accounts are coming soon ♡')}
              className={s.iconBtn}
            >
              <AccountIcon />
            </button>
            <Link to="/wishlist" aria-label={`Wishlist, ${wish.length} saved`} className={s.iconBtn}>
              <HeartIcon />
              {wish.length > 0 && <span className={s.badge}>{wish.length}</span>}
            </Link>
            <button type="button" aria-label={cart.ariaLabel} onClick={openCart} className={s.iconBtn}>
              <BagIcon />
              {cart.has && <span className={s.badge}>{cart.count}</span>}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
