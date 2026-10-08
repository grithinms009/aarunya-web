import { CONFIG } from '@/data/config';

/** "Monday, 14 October" in Indian English. */
const dayName = (d: Date) =>
  d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

export interface DeliveryCopy {
  /** The arrival date, already formatted. */
  date: string;
  /** Either the same-day-dispatch countdown or the next-working-day note. */
  cut: string;
}

/** Turns a delivery estimate into the two lines shown on the product page.
 *  Dispatch cut-off is 16:00; after that, and on Sundays, dispatch moves to the next day.
 *  ETA = dispatch date + maxDays. */
export function deliveryCopy(maxDays: number, now = new Date()): DeliveryCopy {
  const cutoffHour = CONFIG.DISPATCH_CUTOFF_HOUR;

  const ship = new Date(now);
  if (now.getHours() >= cutoffHour) ship.setDate(ship.getDate() + 1);
  // Nothing ships on a Sunday.
  while (ship.getDay() === 0) ship.setDate(ship.getDate() + 1);

  const eta = new Date(ship);
  eta.setDate(eta.getDate() + maxDays);

  let cut: string;
  if (now.getHours() < cutoffHour && now.getDay() !== 0) {
    const mins = cutoffHour * 60 - (now.getHours() * 60 + now.getMinutes());
    cut = `Order within ${Math.floor(mins / 60)} hrs ${mins % 60} mins for same-day dispatch.`;
  } else {
    cut = 'Ships on the next working day.';
  }

  return { date: dayName(eta), cut };
}
