/** Formats an integer paise amount from the server as rupees, e.g. 123456 → "₹1,234.56".
 *  Integer arithmetic only, so no float drift; the browser never derives a total. */
export function fmtPaise(paise: number | undefined | null): string {
  const p = Math.round(Number(paise) || 0);
  const neg = p < 0;
  const abs = Math.abs(p);
  const rupees = Math.floor(abs / 100);
  const rest = String(abs % 100).padStart(2, '0');
  return `${neg ? '-' : ''}₹${rupees.toLocaleString('en-IN')}.${rest}`;
}
