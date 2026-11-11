/* Pure helpers for PIN-driven delivery. The server decides state, zone and shipping;
   these only pick what to show. */

export const isPin = (v: string) => /^[1-9]\d{5}$/.test(v);

/** The dropdown entry for a state name the server returned, or '' when the list has none. */
export function matchState(name: string | undefined | null, states: readonly string[]): string {
  if (!name) return '';
  const key = name.trim().toLowerCase();
  return states.find((s) => s.toLowerCase() === key) ?? '';
}

/** "<district>, <state>", or whichever half is known. */
export function placeLine(district?: string, state?: string | null): string {
  return [district, state].filter(Boolean).join(', ');
}

/** Message for a delivery estimate that came back ok:false. */
export function estimateFailure(reason?: string): string {
  if (reason === 'unknown_pin') return 'We couldn’t find that PIN code.';
  if (reason === 'no_delivery') return 'India Post doesn’t deliver to this PIN code.';
  return 'Enter a valid 6-digit PIN code.';
}
