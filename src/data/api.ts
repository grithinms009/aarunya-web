// HTTP + service layer. Ported from design/aarunya-api.js.
// CONFIG.USE_MOCK switches between the mock data and API_BASE.
import { CATEGORIES, CONFIG, PRODUCTS } from './config';
import type {
  CartQuote,
  Category,
  DeliveryEstimate,
  OrderPayload,
  OrderResult,
  PaymentResult,
  PaymentVerification,
  Product,
} from './types';
import { withMediaOrigin } from './media';

/** An API failure, carrying the server's per-field messages (422) when it sent any. */
export class ApiError extends Error {
  fields: Record<string, string>;
  status: number;
  constructor(message: string, status: number, fields: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

async function http<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const { method = 'GET', body } = init;
  const res = await fetch(CONFIG.API_BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  /* Upload paths arrive relative and are made absolute here, once, so no component has
     to remember to do it. See ./media.ts. */
  const data = text ? withMediaOrigin(JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    /* The API explains itself in { error, message }; show that rather than a status code. */
    const d = data as { message?: string; fields?: Record<string, string> } | null;
    throw new ApiError(d?.message ?? `${method} ${path} failed: ${res.status}`, res.status, d?.fields);
  }
  return data as T;
}

/** Mock responses deep-clone and resolve on a short delay, as the prototype did. */
const mock = <T>(data: T): Promise<T> =>
  new Promise((r) => setTimeout(() => r(JSON.parse(JSON.stringify(data)) as T), 60));

const qs = (o: Record<string, string>) => {
  const s = new URLSearchParams(o).toString();
  return s ? `?${s}` : '';
};

/** What GET /orders/{no}/track returns to the shopper holding the access token. */
export interface OrderTracking {
  orderId: string;
  status: string;
  payment: string;
  placedAt: string;
  total: number;
  name: string;
  city: string;
  items: { name: string; color: string; qty: number; price: number }[];
  shipment: {
    courier: string;
    awb: string;
    shippedAt: string | null;
    trackingUrl: string | null;
  } | null;
  returnRequest: { id: string; status: string } | null;
  /** Present once the tax invoice has been issued (at dispatch). */
  invoice?: { number: string; issuedAt: string } | null;
  history: { status: string; note: string; at: string }[];
}

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  orderNo: string;
  subject: string;
  message: string;
}

export const api = {
  /** GET /products */
  getProducts: (params: Record<string, string> = {}): Promise<Product[]> =>
    CONFIG.USE_MOCK ? mock(PRODUCTS) : http<Product[]>('/products' + qs(params)),

  /** GET /products/{slug} */
  getProduct: (slug: string): Promise<Product | null> =>
    CONFIG.USE_MOCK
      ? mock(PRODUCTS.find((p) => p.slug === slug) ?? null)
      : http<Product | null>(`/products/${slug}`),

  /** GET /categories */
  getCategories: (): Promise<Category[]> =>
    CONFIG.USE_MOCK ? mock(CATEGORIES) : http<Category[]>('/categories'),

  /** POST /cart — items: [{ productId, variantId, qty }] */
  syncCart: (items: { productId: string; variantId: string; qty: number }[]) =>
    CONFIG.USE_MOCK
      ? mock({ ok: true })
      : http<{ ok: boolean }>('/cart', { method: 'POST', body: { items } }),

  /** POST /cart with the delivery state and PIN — the authoritative total and GST breakup.
   *  The browser only displays what comes back. */
  quoteCart: (
    items: { productId: string; variantId: string; qty: number }[],
    giftWrap: boolean,
    state?: string,
    pin?: string,
  ): Promise<CartQuote> =>
    CONFIG.USE_MOCK
      ? Promise.reject(new Error('No tax quote in mock mode'))
      : http<CartQuote>('/cart', { method: 'POST', body: { items, giftWrap, state, pin } }),

  /** POST /orders — { customer, items, giftWrap }; the server prices and totals the order. */
  createOrder: (order: OrderPayload): Promise<OrderResult> =>
    CONFIG.USE_MOCK
      ? mock({
          orderId: 'AJ' + String(Date.now()).slice(-6),
          status: 'CREATED',
          amount: 0,
        })
      : http<OrderResult>('/orders', { method: 'POST', body: order }),

  /** GET /delivery/estimate?pin=XXXXXX — mock: Kerala PINs 2–3 days, rest of India 4–7 days. */
  checkDelivery: (pin: string): Promise<DeliveryEstimate> => {
    if (!CONFIG.USE_MOCK) return http<DeliveryEstimate>('/delivery/estimate' + qs({ pin }));
    if (!/^[1-9]\d{5}$/.test(pin)) return mock<DeliveryEstimate>({ ok: false });
    const local = CONFIG.HOME_STATE_PIN_PREFIXES.some((x) => pin.startsWith(x));
    const [min, max] = CONFIG.DELIVERY_DAYS[local ? 'local' : 'rest'];
    return mock<DeliveryEstimate>({ ok: true, pin, minDays: min, maxDays: max, cod: false });
  },

  /** GET /orders/{orderNo}/track?token= — needs the token issued at checkout. */
  trackOrder: (orderNo: string, token: string): Promise<OrderTracking> =>
    http<OrderTracking>(
      `/orders/${encodeURIComponent(orderNo)}/track?token=${encodeURIComponent(token)}`,
    ),

  /** POST /orders/{orderNo}/replacement-request?token= */
  requestReplacement: (
    orderNo: string,
    token: string,
    body: { reason: string; note?: string; variantId?: string },
  ): Promise<{ id: string; status: string; message: string }> =>
    http(
      `/orders/${encodeURIComponent(orderNo)}/replacement-request?token=${encodeURIComponent(token)}`,
      { method: 'POST', body },
    ),

  /** POST /contact — the contact form. Resolves only when the API stored the message. */
  sendMessage: (body: ContactMessage): Promise<{ ok: boolean; id: number }> =>
    http('/contact', { method: 'POST', body }),

  /** POST /payments/create — the server reads the amount from the order; none is sent.
   *  Returns GATEWAY_NOT_CONFIGURED until Razorpay keys exist, else what Checkout needs. */
  createPayment: ({ orderId, token }: { orderId: string; token?: string }): Promise<PaymentResult> =>
    CONFIG.USE_MOCK
      ? mock<PaymentResult>({ status: 'GATEWAY_NOT_CONFIGURED', orderId, amount: 0 })
      : http<PaymentResult>('/payments/create', { method: 'POST', body: { orderId, token } }),

  /** POST /payments/verify — only `paid: true` from the server means the order is paid. */
  verifyPayment: (body: {
    orderId: string;
    token: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<PaymentVerification> =>
    http<PaymentVerification>('/payments/verify', { method: 'POST', body }),

  /** URL of the customer's tax invoice PDF (GET /orders/{no}/invoice?token=). */
  invoiceUrl: (orderNo: string, token: string): string =>
    `${CONFIG.API_BASE}/orders/${encodeURIComponent(orderNo)}/invoice?token=${encodeURIComponent(token)}`,
};
