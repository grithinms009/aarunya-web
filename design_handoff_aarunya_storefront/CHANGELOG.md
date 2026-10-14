# Changelog

## 14 Oct 2026: admin‑managed content

The storefront's look and layout are unchanged. `ProductCard.dc.html` and every file in `design/assets/` are unchanged. The changes connect the store to the admin panel: content that used to be hard‑coded is now edited in admin.

### `design/aarunya-api.js`

**1. New `BANNERS` data (admin‑managed)**
```js
BANNERS = {
  heroDesktop: '',        // home hero image, ≥900px
  heroMobile: '',         // home hero image, <900px (falls back to heroDesktop)
  heroAlt: '',            // hero alt text
  personalised: '',       // personalised gift banner, ≥760px
  personalisedMobile: '', // personalised gift photo, <760px
  personalisedAlt: '',    // desktop banner alt text
  personalisedCta: '',    // button label, default "Personalise Your Gift"
}
```
An empty value means "use the current default asset or copy".

**2. Content now edited in admin.** These must come from the backend instead of being hard‑coded. A single endpoint such as `GET /storefront` could return all of them:
- `BANNERS` (above)
- `OFFERS`: omit offers with `hidden: true`
- `ANNOUNCEMENTS`
- `COLORS`
- `PAIRINGS`: built from each category's `pairs` array (`{ [categorySlug]: pairs }`)
- `CONFIG` keys: `WHATSAPP_NUMBER`, `EMAIL`, `INSTAGRAM_HANDLE`, `FREE_SHIPPING_THRESHOLD`, `SHIPPING_FEE`, `GIFT_WRAP_FEE`, `DISPATCH_CUTOFF_HOUR`, `PAYMENT_PROVIDER`

**3. Products and categories**
- `GET /products`: leave out products with `status: 'draft'`.
- `GET /categories`: if a category has no `image`, use the first image of the first variant of its first live product. Leave out `subs` when it is empty. Categories can now carry `pairs`.

**4. `POST /orders` now has side effects.** The mock (`recordOrder`) shows what the backend must do:
- Order IDs run in sequence: `AJ1001`, `AJ1002`, … (online orders).
- Reduce each variant's `stock` by the line qty (never below 0).
- Write one stock ledger entry per line:
  `{ at, pid, vid, sku, name, color, change: -qty, reason: 'online', ref: orderId, note }`
- Save the order so it appears in Admin › Orders:
  ```
  { id, channel: 'online', createdAt,
    customer: { name, phone, email, address /* house, address, landmark joined */, city, state, pin },
    items: [{ pid, vid, name, color, sku, qty, price, img }],
    subtotal, shipping, giftWrap, giftFee, discount: 0, total,
    payment: { status: 'pending', method: 'Online', provider },
    status: 'new', shipment: null, location: '', note: '',
    history: [{ at, status: 'new', note: 'Order placed on website' }] }
  ```
- The response is the same as before: `{ orderId, status: 'CREATED', amount }`.

**5. Prototype‑only block, do not port.** The "Admin panel overrides" block (`DEFAULTS`, `readAdmin`, `applyAdmin`, `recordOrder`) reads and writes browser storage (`aj_admin_db`) so the two prototypes can share data. Replace it with the backend calls above. `DEFAULTS` and `BANNERS` were added to the `window.AarunyaAPI` export.

### `design/Aarunya Store.dc.html`

Line numbers are approximate.

| Area | Change | Lines |
|---|---|---|
| Home hero | Desktop/mobile image and alt text come from `BANNERS.heroDesktop` / `heroMobile` / `heroAlt`, falling back to `assets/aarunya-hero-pastel.jpg` and the existing alt text. The About page illustration uses `heroDesktop` too. | ~1536–1542 |
| Personalised banner, ≥760px | Image from `BANNERS.personalised` (fallback `assets/personalised-banner.jpg`), alt from `personalisedAlt`. | ~287, ~1763 |
| Personalised banner, <760px | Photo from `BANNERS.personalisedMobile` (fallback `assets/personalised-gift-box-v2.jpg`). | ~306, ~1764 |
| Personalised CTA | Both buttons (desktop overlay and mobile pill) use `pgCta` = `BANNERS.personalisedCta` or "Personalise Your Gift". | ~288, ~303, ~1762 |
| Offer banners | Image is now a keyed `<img>` so it refreshes when the image changes. No visual change. In React, a normal `<img src>` is enough. | ~345, ~1677 |
| Data load | `banners` is added to state from the API. | ~1323 |
| `RES()` image resolver | Turns `data:` URLs (prototype admin uploads) into blob URLs. Product images now go through `RES()` as well. **Not needed in production** if images are served from a CDN. | ~1241–1243, ~1421 |
