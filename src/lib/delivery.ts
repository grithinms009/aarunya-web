import { SHIPPING } from '@/config/businessInfo';
import type { DeliveryEstimate } from '@/data/types';

/** The delivery line shown after a PIN check, in the same terms as the Shipping policy:
 *  dispatch time and India Post transit time are quoted separately and never added up into
 *  an arrival date, because the shop does not promise one. */
export function deliveryCopy(zone: DeliveryEstimate['zone']): string {
  const transit = zone === 'home'
    ? `${SHIPPING.transit.local} within ${SHIPPING.transit.localLabel}`
    : SHIPPING.transit.rest;
  return `Dispatched within ${SHIPPING.processingDays}. India Post then usually takes ${transit}.`;
}
