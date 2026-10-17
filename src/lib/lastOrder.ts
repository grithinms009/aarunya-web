/* Remembers the most recent order on this device, so Track Order can fill itself in.

   The token is the shopper's own handle on their own order, which is why it may live in
   their browser; it is not a credential for anything else, and the server still verifies
   it on every lookup. Every access is wrapped, because localStorage throws in private
   mode and with site data blocked. */

const KEY = 'aj_last_order';

export interface LastOrder {
  orderId: string;
  token: string;
}

export function rememberLastOrder(order: LastOrder): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    /* Not being able to remember it is not an error worth surfacing. */
  }
}

export function readLastOrder(): LastOrder | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as LastOrder;
    return v && typeof v.orderId === 'string' && typeof v.token === 'string' ? v : null;
  } catch {
    return null;
  }
}
