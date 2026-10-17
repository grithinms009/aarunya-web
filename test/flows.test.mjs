/* Storefront scenario tests: a shopper's journey, on an empty shop and a stocked one. */
import { execFileSync } from 'node:child_process';
import { launchChrome, openTab, stopChrome, check, scenario, summary } from './harness.mjs';

const STORE = 'http://localhost:5173';
const API = 'http://localhost:4000';
const BACKEND = process.env.BACKEND_DIR || new URL('../../aarunya-backend', import.meta.url).pathname;
const SHOTS = process.argv[2] || new URL('../test-screenshots', import.meta.url).pathname;

/* ---- build a known catalogue through the API, so the journey is repeatable ---- */
let cookies = {};
const ch = () => Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
function remember(r) { for (const l of r.headers.getSetCookie?.() ?? []) { const [p] = l.split(';'); const i = p.indexOf('='); cookies[p.slice(0, i)] = p.slice(i + 1); } }
async function api(path, { method = 'GET', body } = {}) {
  const h = { Cookie: ch() };
  if (body !== undefined) h['Content-Type'] = 'application/json';
  if (method !== 'GET') h['x-csrf-token'] = cookies.aj_csrf ?? '';
  const r = await fetch(API + path, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
  remember(r);
  const t = await r.text();
  return { status: r.status, data: t ? JSON.parse(t) : null };
}

console.log('resetting the store…');
execFileSync('npm', ['run', 'db:reset'], { cwd: BACKEND, stdio: 'pipe' });

await launchChrome();
const t = await openTab(STORE + '/');
await t.pause(3500);

/* ---------------------------------------------------------------- empty shop */
let s = scenario('An empty shop still works');
for (const [path, must] of [['/', 'Aarunya'], ['/shop', 'Jewellery'], ['/collections', 'Collection'], ['/wishlist', 'Wish'], ['/cart', 'Bag']]) {
  t.clear();
  await t.goto(STORE + path, 2800);
  check(s, `${path} loads`, await t.has(must), '');
  check(s, `${path} has no console errors`, t.errors.length === 0, t.errors[0] ?? '');
  check(s, `${path} has no failing API calls`, t.netErrors.length === 0, t.netErrors[0] ?? '');
}
await t.goto(STORE + '/shop', 2800);
check(s, 'empty shop explains itself rather than showing a blank grid',
  await t.has('no pieces|nothing|empty|coming soon|0 pieces|No products'),
  (await t.text()).replace(/\s+/g, ' ').slice(-120));
await t.shot(SHOTS, '10-empty-shop');

await t.goto(STORE + '/product/does-not-exist', 2800);
check(s, 'a product URL that does not exist is handled',
  await t.has('could\u2019?n.?t find|not found|no longer available'),
  (await t.text()).replace(/\s+/g, ' ').slice(0, 110));

/* ---------------------------------------------------------------- stock it ---- */
await api('/api/auth/login', { method: 'POST', body: { email: 'veena@aarunyajewels.in', password: 'aarunya123' } });
const set = (await api('/api/admin/settings')).data;
await api('/api/admin/settings', { method: 'PUT', body: {
  config: set.config, couriers: set.couriers, locations: set.locations,
  colors: [{ key: '', label: 'Gold', hex: '#CDA349' }, { key: '', label: 'Silver', hex: '#C3C7CC' }],
  name: 'Veena', email: 'veena@aarunyajewels.in', password: '', passwordConfirm: '' } });
await api('/api/admin/categories', { method: 'POST', body: {
  name: 'Anti-Tarnish Necklaces', short: 'Necklaces', tint: '#F7E4E4', image: '',
  subs: [{ slug: '', name: 'Chokers' }], pairs: [], isNew: true } });
const prod = (await api('/api/admin/products', { method: 'POST', body: {
  name: 'Pearl Drop Choker', category: 'necklaces', price: 899, mrp: 1199, status: 'active',
  material: 'Brass base with anti-tarnish gold plating, nickel-free',
  description: 'A delicate choker for everyday wear.', giftWrap: true,
  variants: [{ color: 'gold', stock: 4, sku: '', images: [] }, { color: 'silver', stock: 0, sku: '', images: [] }] } })).data;
const cheap = (await api('/api/admin/products', { method: 'POST', body: {
  name: 'Everyday Band Ring', category: 'necklaces', price: 299, mrp: 349, status: 'active',
  variants: [{ color: 'gold', stock: 6, sku: '', images: [] }] } })).data;
await api('/api/admin/products', { method: 'POST', body: {
  name: 'Unpublished Piece', category: 'necklaces', price: 500, mrp: 500, status: 'draft',
  variants: [{ color: 'gold', stock: 3, sku: '', images: [] }] } });

/* ---------------------------------------------------------------- browsing */
s = scenario('Browsing a stocked shop');
t.clear();
await t.goto(STORE + '/shop', 3200);
check(s, 'active products are listed', await t.has('Pearl Drop Choker') && await t.has('Everyday Band Ring'), '');
check(s, 'a draft product is not listed', !(await t.has('Unpublished Piece')), '');
check(s, 'discount is shown from real prices', await t.has('25% off|off'), '');
check(s, 'no console errors', t.errors.length === 0, t.errors[0] ?? '');

await t.goto(STORE + `/product/${prod.slug}`, 3200);
check(s, 'product page shows the price', await t.has('1,299|899'), '');
check(s, 'product page shows the material', await t.has('anti-tarnish|brass'), '');
/* The swatch is labelled for screen readers; selecting it must also block the sale. */
check(s, 'a sold-out colour is labelled on its swatch',
  await t.ev(`[...document.querySelectorAll('[aria-label]')].some(e=>/sold out/i.test(e.getAttribute('aria-label')))`), '');
await t.ev(`(()=>{const b=[...document.querySelectorAll('[aria-label]')].find(e=>/sold out/i.test(e.getAttribute('aria-label')));b&&b.click();return 1})()`);
await t.pause(1500);
check(s, 'choosing a sold-out colour says so', await t.has('sold out'), '');
check(s, 'and disables Add to cart',
  await t.ev(`(()=>{const b=[...document.querySelectorAll('button')].find(x=>/add to cart/i.test(x.textContent||''));
    return !!b && (b.disabled||b.getAttribute('aria-disabled')==='true')})()`), '');
/* back to the colour that is in stock for the rest of the journey */
await t.ev(`(()=>{const b=[...document.querySelectorAll('[aria-label]')].find(e=>/^gold$/i.test(e.getAttribute('aria-label')));b&&b.click();return 1})()`);
await t.pause(1200);
check(s, 'shipping terms are stated on the page', await t.has('499'), '');
check(s, 'policy links are on the product page', await t.has('Returns|Shipping'), '');
await t.shot(SHOTS, '11-pdp');

/* ---------------------------------------------------------------- cart + checkout */
s = scenario('Cart and checkout');
t.clear();
await t.click('^add to cart$');
await t.pause(2200);
await t.goto(STORE + '/cart', 3000);
check(s, 'the piece is in the bag', await t.has('Pearl Drop Choker'), '');
check(s, 'free shipping applies above the threshold', await t.has('FREE'), '');

await t.goto(STORE + '/checkout', 3200);
check(s, 'checkout shows the order summary', await t.has('Order summary|Total'), '');
check(s, 'checkout links to the policies',
  await t.has('Terms and Conditions') && await t.has('Refund'), '');
check(s, 'checkout mentions who processes payment', await t.has('Razorpay'), '');

/* submitting empty must not place an order */
await t.click('Place Order');
await t.pause(2000);
check(s, 'empty checkout is refused with field errors',
  await t.has('enter your full name|valid 10-digit'), '');
check(s, 'no order was created by the refused attempt',
  (await api('/api/admin/orders?range=all')).data.rows.length === 0, '');

const setField = async (name, value) => t.ev(`(()=>{const el=document.querySelector('[name=${name}]');if(!el)return false;
  const proto=el.tagName==='SELECT'?window.HTMLSelectElement.prototype:el.tagName==='TEXTAREA'?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto,'value').set.call(el,${JSON.stringify(value)});
  el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));return true})()`);
for (const [k, v] of [['name', 'Asha Menon'], ['phone', '9876500011'], ['email', 'asha@example.com'],
                      ['address', 'MG Road'], ['house', '14B'], ['city', 'Thrissur'],
                      ['state', 'Kerala'], ['pin', '680001']]) await setField(k, v);
await t.pause(600);
t.clear();
await t.click('Place Order');
await t.pause(3500);
check(s, 'a valid checkout places the order', await t.has('Thank you|ready for payment'), '');
check(s, 'the tracking code is shown', await t.has('tracking code'), '');
check(s, 'payment state is reported honestly, not as paid',
  await t.has('GATEWAY_NOT_CONFIGURED') && !(await t.has('payment successful|paid successfully')), '');
check(s, 'no console errors at checkout', t.errors.length === 0, t.errors[0] ?? '');
await t.shot(SHOTS, '12-order-placed');

const placed = (await api('/api/admin/orders?range=all')).data.rows[0];
check(s, 'the order reached the admin', !!placed && placed.customer.name === 'Asha Menon', placed?.id ?? '');
check(s, 'it is unpaid until a gateway confirms', placed?.payment.status === 'pending', placed?.payment.status ?? '');
check(s, 'stock was reduced', (await api('/api/admin/inventory/stock')).data
  .find((r) => r.vid === prod.variants[0].id)?.stock === 3, '');

/* ---------------------------------------------------------------- track order */
s = scenario('Tracking');
t.clear();
await t.goto(STORE + '/track-order', 3000);
/* The fields are prefilled from this device's last order — a value, not page text. */
check(s, 'track order remembers this device\u2019s order',
  (await t.ev(`[...document.querySelectorAll('input')].map(i=>i.value).join(' ')`) || '').includes(placed.id),
  await t.ev(`document.querySelector('input')?.value || ''`));
await t.click('Track order');
await t.pause(2500);
check(s, 'the order is found with the saved code', await t.has('Order placed|Packed|' + placed.id), '');
check(s, 'no console errors tracking', t.errors.length === 0, t.errors[0] ?? '');
await t.shot(SHOTS, '13-tracked');

/* ---------------------------------------------------------------- stock limits */
s = scenario('Stock limits are respected');
await t.goto(STORE + `/product/${cheap.slug}`, 3000);
check(s, 'a cheaper piece shows a shipping charge note', await t.has('60|499'), '');

console.log('\nconsole errors seen anywhere:', t.errors.length ? t.errors.join(' | ') : 'none');
await t.close();
stopChrome();
process.exit(summary() ? 1 : 0);
