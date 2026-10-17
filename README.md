# Aarunya Jewels by Veena — Storefront

React storefront for **Aarunya Jewels by Veena**, an anti-tarnish jewellery brand from Kerala
selling Pan-India. Built from the handoff in `design_handoff_aarunya_storefront/`, which stays
in the repo as the design reference.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production bundle into dist/
npm run preview  # serve the built bundle
npm run typecheck
```

## Stack

- **Vite + React 18 + TypeScript**
- **React Router** — real paths, same URL structure as the prototype's hash routes
- **Zustand** (`persist`) — cart, wishlist, gift wrap and PIN, in the `aj_*` localStorage keys
- **TanStack Query** — product and category fetching
- **CSS Modules + CSS custom properties** — tokens in `src/styles/tokens.css`

Styling note: the prototype expressed everything as inline styles, including hover states that
its runtime synthesised. Here, anything with a `:hover`, `:focus-visible` or
`prefers-reduced-motion` variant lives in a CSS Module so it is real CSS; values that depend on
viewport width or component state stay inline, computed from `useViewport()`.

## Layout

```
src/
  data/        config.ts (CONFIG, mock catalogue, copy), api.ts (service layer), types.ts
  lib/         format, catalog, shopFilters, delivery, validateOrder, route
  hooks/       useViewport, useCatalog, useCart, useShopQuery, useDelivery,
               useScrollReveal, useReducedMotion, useBodyScrollLock
  store/       useStore.ts — persisted shopper state + transient UI state
  components/
    chrome/    Layout, AnnouncementBar, Header (+ mega menu), MobileMenu,
               SearchOverlay, CartDrawer, Footer, WhatsAppButton, Toast, Loader
    home/      Hero, TrustStrip, ShopByCategory, ProductRow, PersonalisedBanner,
               SaleOffers, WhyAarunya, OurStory, InstagramGrid, Newsletter
    pdp/       Gallery, GiftWrap, DeliveryCheck, PairItUp
    product/   ProductCard
    ui/        SectionTitle, Breadcrumb, Seo, Pill.module.css, icons
  pages/       Home, Shop, ProductPage, CartPage, Checkout, Wishlist,
               Collections, About, Contact, PolicyPage, NotFound
```

## Data layer

`src/data/api.ts` is the only thing that talks to the network, and it now runs against the
real API by default. `npm run dev` proxies `/api` and `/uploads` to `http://localhost:4000`,
so the store, the API and the product photos all share an origin in development.

Start the backend first — see `../aarunya-backend/README.md`.

The store's own content is not hard-coded. `src/data/storefront.ts` fetches
`GET /api/storefront` before the first render and fills `CONFIG`, `ANNOUNCEMENTS`, `COLORS`,
`CATEGORIES`, `OFFERS`, `PAIRINGS` and `BANNERS` in place, so whatever the admin panel saves
is what the shop shows — settings, categories, colours, hero and banner artwork, offer cards
and the announcement bar. If the API is unreachable the app still renders, with the defaults
in `config.ts`, and logs the failure.

| Variable | Default | Used for |
|---|---|---|
| `VITE_API_BASE` | `/api` | API base path; absolute URL to skip the dev proxy |
| `VITE_API_PROXY` | `http://localhost:4000` | Where `npm run dev` proxies `/api` and `/uploads` |
| `VITE_USE_MOCK` | unset | Set to `true` to run on the built-in mock catalogue again |

Endpoints: `GET /storefront`, `GET /products`, `GET /products/{slug}`, `GET /categories`,
`POST /cart`, `POST /orders`, `GET /delivery/estimate?pin=`, `POST /payments/create`.
Cart totals and the order total are recomputed server-side; the client's figures are
never trusted.

## State

| State | Persisted as | Notes |
|---|---|---|
| `cart: [{pid, vid, qty}]` | `aj_cart` | Qty capped at variant stock; mirrored to `POST /cart` on change |
| `wish: [productId]` | `aj_wish` | |
| `gift: boolean` | `aj_gift` | Stored as `'1'`/`'0'`, as the prototype did |
| `pin` | `aj_pin` | Re-checked on load |
| Filters + sort | URL query | `sort`, `price`, `color`, `type`, `instock=1`, `sale=1` — shareable |

Every `localStorage` access is wrapped in `try/catch`: it throws in private mode and with site
data blocked, and the app has to keep working.

Business rules: shipping is ₹60 below ₹499 and free at ₹499 or more; gift wrap is ₹49;
discount % is `round((1 − price/mrp) × 100)`, shown only when `mrp > price`; prices format as
`₹` + `en-IN` grouping.

## Motion

Primary easing `cubic-bezier(.16,1,.3,1)`. Page transitions (820ms), scroll reveal on
`[data-fade]` sections (700ms, IntersectionObserver), the announcement marquee (~45px/s,
pauses on hover), the first-load loader, product-card hover, and the PDP image crossfade and
info stagger. All of it is gated on `prefers-reduced-motion`.

## Before launch

Values marked REPLACE / REVIEW in `src/data/config.ts`:

- `WHATSAPP_NUMBER`, `EMAIL` — currently placeholders
- `GIFT_WRAP_FEE` — set `0` for free gift wrap
- `POLICIES` and `CONTENT` copy — placeholder wording
- Newsletter submit is not wired to an email provider yet
- Checkout stops at `POST /payments/create`; open the Razorpay/Cashfree SDK there with the
  returned payload and handle success/failure (see the comment in `src/pages/Checkout.tsx`)
- `public/assets/demo/*.jpg` are placeholder Unsplash photos. Replace with real shots:
  3 per colour variant (front, on model, detail), 4:5 crop, at least 1200px
- The offer banners and the desktop personalised banner have their headings baked into the
  artwork. Fine for launch; for SEO and sharpness, ask the designer for text-free versions and
  rebuild the headings as markup. Source artwork is in
  `design_handoff_aarunya_storefront/brand/`
