# Handoff: Aarunya Jewels by Veena — E‑commerce Storefront

## Overview
A complete storefront for **Aarunya Jewels by Veena**, a small anti‑tarnish jewellery brand from Kerala selling Pan‑India. Shoppers browse by category, filter and sort, view product details with colour variants, save to a wishlist, add to a bag, check delivery by PIN code, and check out with online payment (Razorpay/Cashfree via backend). WhatsApp is the main support and personalisation channel.

> **Updated 14 Oct 2026.** See `CHANGELOG.md` for what changed since the first handoff (admin‑managed banners and content, and order side effects).

## About the design files
Everything in `design/` is a **design reference built in HTML**: a working prototype that shows the intended look and behaviour. It is **not production code to copy**. Recreate it in **React** (recommended stack below) using proper components, routing and state. Match visuals and behaviour exactly.

To view the prototype: serve the `design/` folder with any static server (`npx serve design`) and open `Aarunya Store.dc.html`. Routing uses the URL hash (`#/shop`, `#/product/mango-mala-necklace`, …).

- `design/Aarunya Store.dc.html`: the whole site. The markup is at the top with inline styles, which are the source of truth for every size, colour and spacing value. The logic class (`class Component`) is at the bottom, around line 1251 onwards.
- `design/ProductCard.dc.html`: the reusable product card.
- `design/aarunya-api.js`: config, mock data and the API service layer. **Port this as the data layer.**
- `design/support.js`: prototype runtime only. Ignore it in production.

## Fidelity
**High‑fidelity.** Final colours, typography, spacing, copy, hover states and animations. Recreate pixel‑perfectly. Copy text is final unless marked REVIEW in `aarunya-api.js`.

## Recommended stack
- Vite + React 18 + TypeScript
- React Router (real paths instead of hash routes, same URL structure)
- Zustand (or Context + reducer) for cart, wishlist and gift‑wrap, persisted to localStorage
- TanStack Query for API calls
- Styling: CSS Modules or Tailwind with the tokens below as theme variables
- Motion: CSS transitions plus the Web Animations API (or Framer Motion). Honour `prefers-reduced-motion` everywhere, as the prototype does.
- SEO: per‑route `<title>`/meta (react-helmet-async), Product JSON‑LD on product pages. Consider Next.js if SSR/SEO is a priority.

---

## Design tokens

### Colours
| Token | Hex | Use |
|---|---|---|
| bg | `#FFF9F6` | Page background, header (at 94% opacity with 10px backdrop blur) |
| bg-hero | `#FCF0EE` | Hero section background |
| blush | `#FBEFEF` | Soft fills, icon‑button hover, newsletter card |
| blush-2 | `#FBE8E4` | Promise‑strip icon circles |
| white | `#FFFFFF` | Cards, inputs |
| ink | `#302722` | Primary text, dark chips, count badges |
| ink-muted | `#756964` | Secondary text |
| ink-body | `#5E534E` | Long‑form paragraphs |
| ink-soft | `#3E3430` | Mega‑menu links |
| wine | `#8D3545` | Primary buttons, announcement bar, active nav, errors, emphasis `<em>` |
| wine-hover | `#76293A` | Primary button hover |
| gold | `#C79A45` | Rules/dividers, diamond ornaments, outline‑button borders, active underline |
| gold-deep | `#9D762F` | Focus ring, selected swatch ring |
| gold-text | `#8A6527` | Eyebrow labels, "low stock" text |
| gold-light | `#E7D3AE` | Light gold borders (category rings, trust icons) |
| line | `#F0E2DE` | Section dividers, card borders |
| line-chip | `#EADAD4` | Chip/dropdown borders |
| line-input | `#E3CFC8` | Input borders |
| success | `#3E7B5C` | "In stock", FREE shipping |
| whatsapp | `#25D366` | Floating WhatsApp button |
| selection | `#F4D8DC` | `::selection` |

Variant colour swatches (from `COLORS`): Gold `#CDA349`, Rose Gold `#D9A38E`, Silver `#C3C7CC`, Black `#2E2826`, Green `#3F7B5D`. Each also has a `tint` used as the image placeholder background.

### Typography (Google Fonts)
- **Cormorant Garamond** 400/500/600 + italic 400/500: all headings and display. Section H2 `clamp(28px,3.6vw,40px)`/1.1, weight 500. Emphasis words are `<em>` in wine `#8D3545`.
- **Jost** 300/400/500/600: body and UI. Body 15px/1.7–1.85 (300 for long‑form). Nav 13px/600, letter‑spacing .1em, uppercase. Buttons 14px, letter‑spacing .06em. **Load weight 600 too** (the prototype uses it but only loads up to 500).
- **Great Vibes**: script accent ("Personalised with Love") only.
- Eyebrow label: 11–11.5px, uppercase, letter‑spacing .22–.28em, colour `#8A6527`.
- Headings use `font-feature-settings:"liga","dlig"`. Paragraphs use `text-wrap: pretty`. Numbers use lining nums.

### Radius
Pills/buttons/inputs `999px` · section banners `24px` · feature cards `20px` · promise strip `18px` · Instagram tiles `14px` · offer banners `8px` · count badges `10px` · **product cards are square (0)**.

### Shadows
- Header mega menu: `0 24px 40px -24px rgba(48,39,34,.18)`
- Product card hover: `0 22px 44px -26px rgba(141,53,69,.35)`, lift `translateY(-4px)`
- Banners: `0 10px 30px rgba(141,53,69,.08)` / `0 12px 36px rgba(141,53,69,.07)`
- Cart drawer: `-20px 0 60px rgba(48,39,34,.08)`
- Badge outline: `0 0 0 2px #FFF9F6`

### Ornaments
- Section title: H2 centred between two 7×7 gold squares rotated 45°, 16px gap, with a 44×1px gold rule below.
- Small outline diamond: 5–8px square, 1px gold border, rotated 45°. Used in the marquee and on feature cards.

### Layout
- Content max‑width `1280px`. Side padding `clamp(16px,4vw,40px)`. Hero max‑width `1680px`.
- Section top padding: `clamp(48px,7vw,88px)`, larger sections `clamp(56px,8vw,100px)`.
- Breakpoints:
  - `<600`: 2 product columns
  - `600–1023`: 3 product columns
  - `≥1024`: desktop header, 4 product columns
  - `<768`: "mobile" flags (sticky PDP bar, dropdown widths)
  - `≥860`: two‑column variants
  - `≥900`: hero text overlaid on the image
  - `≥760`: personalised banner image version

### Motion
- Primary easing `cubic-bezier(.16,1,.3,1)`.
- **Page transition**: main content fades in from translateY(18px), 820ms.
- **Scroll reveal**: sections marked `data-fade` animate opacity 0→1 and translateY 18px→0 over 700ms when they enter the viewport (IntersectionObserver, rootMargin bottom −6%), once each.
- **Announcement marquee**: infinite horizontal loop at ~45px/s, pauses on hover.
- **Loader** (first load, minimum about 2.15s, fallback 6s):
  1. The logo mark fills bottom‑to‑top (clip‑path, 1.9s) while a 72px gold progress line scales in.
  2. The wordmark fades up.
  3. When data is ready: a shine sweep and a gold 4‑point glint play, the stage blurs and scales to 0.97, and the panel fades out.
- **Product card hover**: card lifts, border turns gold, image zooms to 1.06 and crossfades to the 2nd image, an inner 1px frame fades in, name turns wine. The "Add to Cart" button turns wine with letter‑spacing widening.
- **PDP**: image changes crossfade with a 1.035 scale; info children stagger in (70ms steps); tab content fades up.
- All of the above are disabled under `prefers-reduced-motion`.

---

## Routes / screens
| Path | Screen |
|---|---|
| `/` | Home |
| `/shop` | All jewellery (query: `sort`, `price=u500\|500-1000\|o1000`, `sale=1`) |
| `/category/:cat` and `/category/:cat/:type` | Category / sub‑category listing (same UI as shop) |
| `/product/:slug` | Product detail |
| `/cart` | Bag page |
| `/checkout` | Checkout (+ order‑placed state) |
| `/wishlist` | Wishlist |
| `/collections` | All categories grid |
| `/about`, `/contact` | Content pages |
| `/shipping-policy`, `/return-policy`, `/privacy-policy`, `/terms` | Policy pages (from `POLICIES`) |
| `*` | 404: "This page wandered off" + Back home |

Page titles follow `"{Page} | Aarunya Jewels by Veena"`. The home page title is "Aarunya Jewels by Veena — Anti‑Tarnish Jewellery from Kerala". On product pages, the meta description is set to the product description.

### Global chrome
- **Announcement bar**: wine background, 12px cream text, letter‑spacing .08em, 9px vertical padding. Shows a marquee of `ANNOUNCEMENTS` separated by small gold outline diamonds.
- **Header**: sticky, cream at 94% with blur, 1px `#F0E2DE` bottom border.
  - **Desktop (≥1024)**: 80px tall, 3‑column grid.
    - Left: logo mark (40–52px) + wordmark (24–32px).
    - Centre: nav — Home, Shop, **Jewellery ▾** (mega menu), Collections, About Us, Contact. The active item is wine with a 2px gold underline.
    - Right: 46px round icon buttons — Search, Account (toast "Accounts are coming soon ♡"), Wishlist (count badge), Bag (count badge). Hover background is blush and the icon turns wine.
  - **Mega menu**: opens on hover (close delay 120ms) or click. Full‑width, 6 columns. Each category with sub‑types is a column: heading 13px/600 uppercase with a bottom rule, links 14.5px/500. A "More" column holds categories without subs. "Shop all jewellery →" link at the bottom. Fades and slides 6px.
  - **Mobile/tablet (<1024)**: 62px tall. Hamburger (left), centred logo, Search and Bag (right). 44px hit targets.
- **Mobile menu**: left drawer. Nav links, "Jewellery" accordion with nested category accordions ("All {cat}" + subs; active row `#F7E6E3`), Wishlist, WhatsApp and Instagram links.
- **Search overlay**: drops from the top and autofocuses.
  - Placeholder "Search necklaces, jhumkas, rings…".
  - When empty, shows category quick links.
  - Results match on product name + category name (case‑insensitive), max 8, with thumbnail, name and price.
  - No match: "No pieces match “{q}”."
- **Cart drawer**: slides from the right, title "Your Bag (n)".
  - Free‑shipping message + progress bar.
  - Line items: thumbnail, name, colour dot + name, line total, − qty + (+ disabled at stock), Remove.
  - Subtotal / Shipping / Gift wrap / Total, then **Checkout** and **View bag**.
  - Empty state: "Your bag is empty" + "Start shopping".
- **Overlay behaviour**: Esc closes all overlays, body scroll locks while any overlay is open, and route changes close everything.
- **Floating WhatsApp button**: bottom‑right, green, shadow `0 8px 24px rgba(37,211,102,.28)`. The "Chat with us" label shows on desktop only. It moves up above the sticky PDP bar on mobile product pages.
- **Toast**: bottom centre, fades in and rises 10px, auto‑hides after 2.2s.
- **Footer**:
  - Brand column: logo, "Little treasures, chosen with love.", Instagram and WhatsApp links.
  - Shop column: Shop, Collections, About Us, Contact Us.
  - Help column: four policy pages.
  - Shipping lines.
  - "Secure payments" with payment marks UPI · RuPay · Visa · Mastercard · Net Banking.
  - "© 2026 Aarunya Jewels by Veena. All rights reserved."

### Home (in order)
1. **Hero**: `assets/aarunya-hero-pastel.jpg`, an illustration of a girl in a magenta pavada. The image (desktop/mobile) and alt text can be replaced from admin through `BANNERS`; this file is the fallback.
   - Shown at natural size, max‑height `max(460px, 100vh − 150px)`, with 5% side fades and a 12% bottom fade into `#FCF0EE`.
   - **≥900px**: buttons are overlaid at left 31.6%, bottom 3.2% — **Shop Now** (wine pill) and **Explore Collections** (gold outline, cream 75% fill). There is a visually hidden H1.
   - **<900px**: below the image sits an ornament, H1 "Little treasures, chosen with love.", an intro paragraph and both buttons at full width.
2. **Trust strip**: 4 items (Anti‑Tarnish Jewellery, Pan India Delivery, Free Shipping Above ₹499, Secure Payments). Each is a 40px gold‑outlined circle icon + 13px label. 4 columns on desktop, 2 below.
3. **Shop by Category**: circular images (1:1, 5px padding ring, 1px gold‑light border that turns gold on hover, image zooms to 1.06). Label is Jost 14–16px/500. 8 columns at ≥1180, 4 at ≥600, 3 below.
4. **Best Sellers**: `featured` products. 4 shown, 6 at 3 columns; the count is trimmed to fill whole rows. "View All →" outline pill goes to `/shop`.
5. **Personalised Gift banner** (desktop image, mobile photo, alt text and button label can be replaced from admin through `BANNERS`):
   - **≥760px**: `assets/personalised-banner.jpg` (text baked into the image) at 24px radius, with a **live** "Personalise Your Gift →" link positioned over it at left 24.3% (centred), top 71.8%. Size scales with the banner: width 21.1% and height 4.58% of the banner width, font `max(12px,1.15% of banner width)`. Wine colour; on hover it darkens to `#74283A`, the arrow gap widens and it lifts 2px. Opens WhatsApp.
   - **<760px**: HTML version — eyebrow "Made just for you", H2 "Personalised **Gift**" (gold), "Anti‑Tarnish Jewellery", heart divider, Great Vibes "Personalised with Love", dark pill CTA, and the photo `personalised-gift-box-v2.jpg`.
6. **New Arrivals**: `isNew` products sorted by `createdAt` descending. "View All →" goes to `/shop?sort=newest`.
7. **Sale & Offers**: shown only if at least one offer has matching products.
   - Eyebrow "Limited time · While stocks last", H2 "Sale & *Offers*".
   - Two banner images (`offer-festive-sale.jpg`, `offer-little-gifts.jpg`, text baked in) side by side at ≥860. Column widths are proportional to the image widths (846fr / 878fr) so the heights match. Stacked below 860.
   - Each banner has a **live CTA** at its `bx`/`by` percentages from `OFFERS`:
     - "Shop the sale": solid gold `#C48F3E` → `#AE7C31`.
     - "Find a gift": outline `#C9A06A` with cream fill.
     - Both: uppercase, letter‑spacing .2em.
   - Links: `/shop?sale=1` and `/shop?price=u500`.
   - Below the banners, a **promise strip**: white rounded card (18px) with 4 items, each a 46–64px blush circle with a rose `#A4505C` line icon, a Cormorant 16–20px/600 title and a 12–13.5px muted subtitle. Items: Anti‑Tarnish / Made to keep its shine · Skin Safe / Nickel‑free, gentle on skin · Gift Ready / Beautifully packed with love · Pan India Delivery / Free shipping above ₹499. 1px `rgba(141,53,69,.12)` dividers between items.
8. **Why Aarunya**: eyebrow + H2 "Made with care, chosen with love". 4 white cards (20px radius, `#F0E2DE` border) with a diamond, a Jost title and a muted text line. 4 columns at ≥900, otherwise 2.
9. **Our story**: two offset 3:4 images with asymmetric radii (`20 20 20 80` and `80 20 20 20`).
   - Eyebrow, H2 "Where tradition / *meets everyday*", 2 paragraphs.
   - Gold‑gradient pill "Discover our story →" (`#F6E7C8→#E3C68A`, text `#4A3412`) linking to `/about`.
10. **Instagram**: "Follow @aarunyajewelsbyveena" and a grid of 6 square tiles (14px radius; 6 columns, 3 on mobile).
11. **Newsletter**: blush card, H2 "Something lovely, once in a while.", email + Subscribe.
    - Validated; error "Please enter a valid email address."
    - Success: "Thank you, we’ll write soon ♡".

> **Image‑with‑text banners.** The offer banners and the desktop personalised banner have their headings baked into the image. That is fine for launch. For best SEO, accessibility and sharpness, ask the designer for text‑free photos later and rebuild the text in HTML. The original artwork is in `brand/`. The "Up to 27% off" in the festive banner image is static; the prototype data computes the live maximum discount as `{maxOff}`.

### Shop / Category
- Breadcrumb: Home / Shop / {Category} / {Type}. H1 is the type name, category name or "All Jewellery".
- **Chips row**:
  - On a category with subs: "All {cat}" + each sub‑type.
  - Otherwise: "All" + each category.
  - Active chip is ink background with cream text; inactive is white with `#EADAD4` border.
- **Filter dropdowns** (desktop: popovers 260px, 320px for colour; mobile: full width). Each shows its active value inline, has a "Clear" action and uses a gold border when active:
  - Product Type (only when the selected categories have subs): checkboxes with counts.
  - Price: All / Under ₹500 / ₹500 – ₹1,000 / Above ₹1,000.
  - Colour: swatch buttons limited to colours present in scope.
  - Availability: In stock only, On sale.
- "Clear all" appears when any filter is set.
- **Sort**: Popularity (default, by `popularity`), Newest first, Name A–Z, Price Low→High, Price High→Low (price ties broken by popularity).
- Count text "{n} pieces". Product grid of 2/3/4 columns.
- When a colour filter is on, cards show matching variants first.
- Empty state: "Nothing matches just yet" / "Try removing a filter or two." / Clear filters.

### Product card (`ProductCard.dc.html`)
- White card, 10px padding, 1px `rgba(199,154,69,.32)` border, image 4:5.
- Top‑left badges: "{n}% off" (wine on cream glass) and "NEW" (ink glass).
- Top‑right: 36px round wishlist heart (fills wine when saved).
- "SOLD OUT" tag bottom‑left when the selected variant is out of stock.
- Below the image:
  - 13px colour swatch dots (clicking one switches the card image), then "{n} colours" or the colour name.
  - Name: 2‑line clamp.
  - Price + struck MRP.
- Full‑width "Add to Cart" button: gold gradient `#FBF3E4→#F3E2C0→#EBD3A3`, border `#E7D3AE`, text `#5E4416`, 12px uppercase .14em. Turns wine on hover. Disabled "Sold out" state.
- Quick add adds qty 1 of the shown variant and opens the cart drawer.

### Product detail
- Breadcrumb Home ▸ Category ▸ Name.
- **Gallery**: 3 views (front, on model, detail) per colour variant. Main image with prev/next arrows and a counter. Thumbnails sit as a vertical rail on the left at ≥860 and as a row below on smaller screens. The selected thumbnail has a gold border and ring. Discount badge and wishlist on the image. A feature row (Anti‑Tarnish · Skin Safe · Gift Ready) sits under the gallery.
- **Info column**:
  - Category link, H1, price + MRP + "{n}% off", "Inclusive of all taxes".
  - Stock status with a coloured dot + halo: "In stock, ready to ship" (green), "Only {n} left in {colour}" (gold, ≤3), "{colour} is sold out" (wine).
  - Colour: radio swatches; sold‑out swatches are dimmed and struck.
  - Quantity stepper (1 to min(stock,10)).
  - **Add to Cart** (opens drawer) + **Buy Now** (adds to cart, goes to /checkout).
  - Save to wishlist.
- **Gift wrap** card "Wrap it with love": toggle button "+ Gift wrap · ₹49" / "✓ Added". The dashed border becomes solid wine when on. The setting persists across the order.
- **Check delivery**: 6‑digit PIN input, then "Delivering to {pin} · Change" and "Arrives by {Weekday, D Month}. Order within X hrs Y mins for same‑day dispatch." Rules: dispatch cut‑off 16:00 (after that, the next day), Sundays skipped, ETA = dispatch + maxDays. The last PIN is remembered.
- **Tabs**: Description & Details (about text + specs table), Material, Care Instructions, Shipping & Delivery, Returns / Exchange. Content comes from `CONTENT` and the product. Active tab text is ink with a gold underline.
- **Pair it up — complete the look**: the current piece + the top in‑stock product from each category in `PAIRINGS[category]`. Each extra piece can be toggled. The button reads "Add all {n} to Cart · ₹sum" with the struck MRP sum and "You save ₹x on this set".
- **You May Also Love**: same category first, then featured products, max 4.
- **Mobile (<768)**: sticky bottom bar with price, colour, Add to Cart and Buy Now.

### Cart page
- H1 "Your Bag". Free‑shipping progress message:
  - "Add ₹x more to unlock FREE shipping"
  - "You’ve unlocked FREE shipping ♡"
- Lines with a qty stepper.
- Summary aside (sticky at ≥900): Subtotal, Shipping ("FREE" in green when free), Gift wrap, Total, Checkout, Continue shopping.

### Checkout
- H1 + "Secure checkout" lock.
- **Contact**: Full Name, Mobile Number, Email.
- **Delivery address**: Address, Apartment / House, Landmark (optional), City, State (select of `STATES`, default Kerala), PIN Code.
- **Payment**: "Online Payment — UPI, cards, net banking and wallets, through our secure payment partner."
- Submit button "Place Order · ₹total" ("Placing order…" while busy).
- Order summary aside.
- **Validation** (inline per field, plus "Please check the highlighted fields."):
  - Name required.
  - Mobile `^[6-9]\d{9}$` (last 10 digits).
  - Email `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
  - Address, House, City and State required.
  - PIN `^\d{6}$`.
- **Order placed**: on success, `createOrder` then `createPayment`. Show "Thank you ♡ / Order {id} is ready for payment". In production, open the Razorpay/Cashfree checkout here with the data from `/payments/create` and handle success and failure.
- Empty bag state.

### Other pages
- **Collections**: grid of all categories with image, name and "{n} pieces".
- **Wishlist**: product grid, or the empty state "Nothing saved yet / Tap the heart on any piece to keep it here."
- **About**: illustration + "A little jewellery box from Kerala" + 4 paragraphs (final copy in source, ~line 990).
- **Contact**: WhatsApp, Instagram and Email cards. "Send a message" form (name + message) opens WhatsApp with the text "Hi Aarunya Jewels by Veena, I'm {name}. {message}".
- **Policies**: title, "Last updated", sections.

---

## State
| State | Persisted | Notes |
|---|---|---|
| `cart: [{pid, vid, qty}]` | localStorage `aj_cart` | Qty capped at variant stock. Synced to `POST /cart` on change. |
| `wish: [productId]` | `aj_wish` | Toast: "Saved to your wishlist ♡" / "Removed from wishlist" |
| `gift: boolean` | `aj_gift` | Toast on toggle |
| `pin` | `aj_pin` | Re‑checked on load |
| filters `{cats, types, price, colors, inStock, sale}`, `sort` | URL (recommended) | The prototype keeps them in memory. **Put them in query params** so they can be shared. |
| UI: cartOpen, menuOpen, searchOpen, filterOpen, megaOpen, open dropdown | no | |
| PDP: variant index, image index, qty, active tab, pair toggles | no | Reset on product change. Default variant is the first in stock. |

**Business rules**
- Shipping is ₹60 below ₹499 and free at ₹499 or more.
- Gift wrap is ₹49 (config).
- Discount % = `round((1 − price/mrp) × 100)`, shown only when mrp > price.
- Prices are formatted `₹` + `en-IN` grouping.

## API (port from `aarunya-api.js`; backend planned in Spring Boot)
`CONFIG.USE_MOCK` switches between mock data and `API_BASE` (`http://localhost:8080/api`).
- `GET /products`, `GET /products/{slug}`, `GET /categories`
- `POST /cart` with `{ items:[{productId, variantId, qty}] }`
- `POST /orders` with `{ customer, items, subtotal, shipping, giftWrap, giftFee, total }`, returns `{ orderId, status, amount }`. It must also reduce stock, write a stock ledger entry and save the order for the admin panel (see `CHANGELOG.md`).
- Banners, offers, announcements, colours, pairings and store settings are edited in admin, so the backend serves them too (see `CHANGELOG.md`).
- `GET /delivery/estimate?pin=` returns `{ ok, pin, minDays, maxDays, cod }`. Mock rule: Kerala PIN prefixes 67/68/69 take 2–3 days, the rest 4–7.
- `POST /payments/create` with `{ orderId, amount, provider }`, returns the data the gateway SDK needs.

Data shapes: see `PRODUCTS` (id, slug, name, category, type, popularity, price, mrp, featured, isNew, createdAt, rating, reviewCount, description, material, status, variants[{id, sku, color, stock, images[3]}]) and `CATEGORIES` (slug, name, short, ph, tint, subs[{slug, name}], image, pairs). Products with `status: 'draft'` and offers with `hidden: true` are not shown on the store.

The "Admin panel overrides" block in `aarunya-api.js` is prototype‑only. Do not port it.

**Before launch, replace these values** marked REPLACE/REVIEW in the config: `WHATSAPP_NUMBER`, `EMAIL`, `GIFT_WRAP_FEE`, and the policy and content copy.

## Accessibility
- Visible focus ring `2px solid #9D762F`, offset 2px.
- 44px minimum touch targets.
- `aria-pressed`/`aria-expanded`/`aria-current` on toggles, accordions and chips.
- Toasts use `role="status"`; form errors use `role="alert"` and `aria-invalid`.
- Labelled inputs; the drawer is a dialog.
- Breadcrumbs use `nav[aria-label=Breadcrumb]`.
- Reduced motion respected.

## Assets
- `design/assets/aarunya-mark(-sm).png`, `aarunya-wordmark(-sm).png`, `aarunya-logo-full(-sm).png`, `aarunya-favicon.png`: logo set. HD originals are in `brand/`.
- `aarunya-hero-pastel.jpg`: home hero / about illustration.
- `offer-festive-sale.jpg`, `offer-little-gifts.jpg`: offer banners. The baked buttons were removed; live buttons go on top.
- `personalised-banner.jpg` (desktop banner, baked button removed), `personalised-gift-box-v2.jpg` (mobile photo).
- `assets/demo/*.jpg`: **placeholder** Unsplash product photos. Replace them with real product shots: 3 per colour variant (front, on model, detail), 4:5 crop, at least 1200px.
- `brand/source-*.png`: original banner artwork as supplied.

## Build order (suggested)
1. Tokens, fonts and global chrome (announcement, header, mega menu, mobile menu, footer, WhatsApp, toast)
2. Data layer + product card
3. Home
4. Shop/category with URL‑synced filters and sort
5. Product detail
6. Cart drawer, cart page, wishlist
7. Checkout + payment gateway integration
8. Content and policy pages, search, loader, motion polish, SEO, performance (lazy images, responsive `srcset`)
