import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCatalog } from '@/hooks/useCatalog';
import { categoryHref, hasSubs } from '@/lib/catalog';
import { routeNameOf, type RouteName } from '@/lib/route';
import { instagramUrl, whatsappUrl } from '@/lib/format';
import { CONFIG } from '@/data/config';
import { useUi } from '@/store/useStore';
import { ChevronIcon, CloseIcon } from '@/components/ui/icons';
import s from './Overlay.module.css';

const NAV_A: { label: string; href: string; keys: RouteName[] }[] = [
  { label: 'Home', href: '/', keys: ['home'] },
  { label: 'Shop', href: '/shop', keys: ['shop', 'category', 'product'] },
];
const NAV_B: { label: string; href: string; keys: RouteName[] }[] = [
  { label: 'Collections', href: '/collections', keys: ['collections'] },
  { label: 'About Us', href: '/about-us', keys: ['about'] },
  { label: 'Contact', href: '/contact-us', keys: ['contact'] },
];

/** Left drawer: nav links, a "Jewellery" accordion with nested category accordions,
 *  Wishlist, and WhatsApp / Instagram actions pinned to the bottom. */
export function MobileMenu() {
  const { pathname } = useLocation();
  const route = routeNameOf(pathname);
  const { categories } = useCatalog();
  const { menuOpen, closeAll } = useUi();
  // The Jewellery accordion starts open, as in the prototype; one category expands at a time.
  const [jewOpen, setJewOpen] = useState(true);
  const [openCat, setOpenCat] = useState('');

  const linkColor = (keys: RouteName[], label: string) => {
    const active = keys.includes(route) && !(label === 'Shop' && route === 'category');
    return active ? '#8D3545' : '#302722';
  };

  return (
    <>
      <div
        aria-hidden="true"
        onClick={closeAll}
        className={s.scrim}
        style={{ zIndex: 70, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none' }}
      />
      <aside
        aria-label="Menu"
        className={`${s.panel} ${s.menu}`}
        style={{
          transform: menuOpen ? 'none' : 'translateX(-100%)',
          visibility: menuOpen ? 'visible' : 'hidden',
        }}
      >
        <div className={s.menuHead}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/assets/aarunya-mark-sm.png" alt="" style={{ display: 'block', height: 36, width: 'auto' }} />
            <img src="/assets/aarunya-wordmark-sm.png" alt="Aarunya by Veena" style={{ display: 'block', height: 22, width: 'auto' }} />
          </span>
          <button type="button" aria-label="Close menu" onClick={closeAll} className={s.closeBtn} style={{ marginRight: -10 }}>
            <CloseIcon />
          </button>
        </div>

        <nav aria-label="Mobile" className={s.menuNav}>
          {NAV_A.map((n) => (
            <Link key={n.href} to={n.href} className={s.menuLink} style={{ color: linkColor(n.keys, n.label) }}>
              {n.label}
            </Link>
          ))}

          <div style={{ borderBottom: '1px solid #F0E2DE' }}>
            <button
              type="button"
              aria-expanded={jewOpen}
              onClick={() => setJewOpen((o) => !o)}
              className={s.accBtn}
              style={{ color: route === 'category' ? '#8D3545' : '#302722' }}
            >
              Jewellery
              <ChevronIcon size={16} strokeWidth={1.4} open={jewOpen} />
            </button>
            {jewOpen && (
              <div className={s.accBody}>
                {categories.map((c) => {
                  const subs = hasSubs(c);
                  const on = openCat === c.slug;
                  if (!subs) {
                    return (
                      <Link key={c.slug} to={categoryHref(c)} className={s.catLink}>
                        {c.short}
                      </Link>
                    );
                  }
                  return (
                    <div key={c.slug} style={{ display: 'flex', flexDirection: 'column' }}>
                      <button
                        type="button"
                        aria-expanded={on}
                        onClick={() => setOpenCat(on ? '' : c.slug)}
                        className={s.catBtn}
                        style={{ background: on ? '#F7E6E3' : 'transparent' }}
                      >
                        {c.short}
                        <ChevronIcon size={14} strokeWidth={1.5} open={on} />
                      </button>
                      {on && (
                        <div className={s.subWrap}>
                          <Link to={categoryHref(c)} className={s.subLink} style={{ color: '#8D3545' }}>
                            All {c.short}
                          </Link>
                          {(c.subs ?? []).map((t) => (
                            <Link key={t.slug} to={categoryHref(c, t)} className={s.subLink} style={{ color: '#5E534E' }}>
                              {t.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {NAV_B.map((n) => (
            <Link key={n.href} to={n.href} className={s.menuLink} style={{ color: linkColor(n.keys, n.label) }}>
              {n.label}
            </Link>
          ))}
          <Link to="/wishlist" className={s.menuLink} style={{ color: '#302722' }}>
            Wishlist
          </Link>
        </nav>

        <div className={s.menuFooter}>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener"
            className={s.menuCta}
            style={{ background: '#8D3545', color: '#FFF9F6' }}
          >
            Chat on WhatsApp
          </a>
          <a
            href={instagramUrl()}
            target="_blank"
            rel="noopener"
            className={s.menuCta}
            style={{ border: '1px solid #C79A45', color: '#302722' }}
          >
            @{CONFIG.INSTAGRAM_HANDLE}
          </a>
        </div>
      </aside>
    </>
  );
}
