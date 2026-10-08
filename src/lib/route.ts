export type RouteName =
  | 'home' | 'shop' | 'category' | 'product' | 'cart' | 'checkout' | 'wishlist'
  | 'about' | 'contact' | 'collections' | 'policy' | 'notfound';

export const POLICY_SLUGS = ['shipping-policy', 'return-policy', 'privacy-policy', 'terms'];

/** Route name for the current path — drives nav highlighting and page titles.
 *  Mirrors the prototype's `parse()` map. */
export function routeNameOf(pathname: string): RouteName {
  const [first = ''] = pathname.replace(/^\/+/, '').split('/');
  if (first === '') return 'home';
  if (POLICY_SLUGS.includes(first)) return 'policy';
  const map: Record<string, RouteName> = {
    shop: 'shop',
    category: 'category',
    product: 'product',
    cart: 'cart',
    checkout: 'checkout',
    wishlist: 'wishlist',
    about: 'about',
    contact: 'contact',
    collections: 'collections',
  };
  return map[first] ?? 'notfound';
}

/** Page titles follow "{Page} | Aarunya Jewels by Veena"; home has its own full title. */
export const HOME_TITLE = 'Aarunya Jewels by Veena — Anti-Tarnish Jewellery from Kerala';

export const STATIC_TITLES: Partial<Record<RouteName, string>> = {
  shop: 'Shop All Jewellery',
  collections: 'Collections',
  cart: 'Your Bag',
  checkout: 'Checkout',
  wishlist: 'Wishlist',
  about: 'About Us',
  contact: 'Contact Us',
  notfound: 'Page not found',
};

export const pageTitle = (title?: string) =>
  title ? `${title} | Aarunya Jewels by Veena` : HOME_TITLE;
