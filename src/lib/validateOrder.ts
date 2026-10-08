import type { OrderCustomer } from '@/data/types';

export type OrderErrors = Partial<Record<keyof OrderCustomer, string>>;

/** Inline per-field validation, matching the handoff's rules exactly.
 *  The mobile check looks at the last 10 digits so a +91 prefix is accepted. */
export function validateOrder(f: OrderCustomer): OrderErrors {
  const e: OrderErrors = {};
  const digits = f.phone.replace(/\D/g, '');

  if (!f.name.trim()) e.name = 'Please enter your full name.';
  if (!/^[6-9]\d{9}$/.test(digits.slice(-10)) || digits.length < 10)
    e.phone = 'Enter a valid 10-digit mobile number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email address.';
  if (!f.address.trim()) e.address = 'Please enter your address.';
  if (!f.house.trim()) e.house = 'Please enter your apartment or house.';
  if (!f.city.trim()) e.city = 'Please enter your city.';
  if (!f.state) e.state = 'Please choose your state.';
  if (!/^\d{6}$/.test(f.pin)) e.pin = 'Enter a 6-digit PIN code.';

  return e;
}
