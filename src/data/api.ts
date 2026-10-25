// HTTP + service layer. Ported from design/aarunya-api.js.
// CONFIG.USE_MOCK switches between the mock data and API_BASE.
import { CATEGORIES, CONFIG, PRODUCTS } from './config';
import type {
  Category,
  DeliveryEstimate,
  OrderPayload,
  OrderResult,
  PaymentResult,
  Product,
} from './types';
import { withMediaOrigin } from './media';

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
    const msg = (data as { message?: string } | null)?.message;
    throw new Error(msg ?? `${method} ${path} failed: ${res.status}`);
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

  /** POST /orders — { customer, items, subtotal, shipping, giftWrap, giftFee, total } */
  createOrder: (order: OrderPayload): Promise<OrderResult> =>
    CONFIG.USE_MOCK
      ? mock({
          orderId: 'AJ' + String(Date.now()).slice(-6),
          status: 'CREATED',
          amount: order.total,
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

  /** POST /payments/create — backend creates a Razorpay/Cashfree order and returns what the
   *  checkout SDK needs. No gateway is simulated here. */
  createPayment: ({ orderId, amount }: { orderId: string; amount: number }): Promise<PaymentResult> =>
    CONFIG.USE_MOCK
      ? mock({
          status: 'GATEWAY_NOT_CONFIGURED',
          provider: CONFIG.PAYMENT_PROVIDER,
          orderId,
          amount,
        })
      : http<PaymentResult>('/payments/create', {
          method: 'POST',
          body: { orderId, amount, provider: CONFIG.PAYMENT_PROVIDER },
        }),
};
