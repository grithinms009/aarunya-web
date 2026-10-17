/* Fails while any launch-blocking business detail is still unconfirmed.
 *
 * Run it before deploying, and in CI. It exists so a site full of "(being updated)"
 * cannot quietly reach production and then be submitted for payment-gateway review.
 *
 * Usage: npm run check:business
 */
import { readFileSync } from 'node:fs';

/* businessInfo.ts is written for the browser, so rather than evaluate it this reads the
   declarations: a field counts as supplied once its `null` is replaced by a string. */
const src = readFileSync(new URL('../src/config/businessInfo.ts', import.meta.url), 'utf8');

/**
 * True when a field is still unconfirmed.
 *
 * A field counts as supplied when it is given a string, a getter that builds one, or
 * `true`. It counts as missing when it is `null`, `false`, or absent from the file
 * altogether — absence is treated as missing rather than silently passing.
 */
const isNull = (field) => {
  const getter = new RegExp(`\\bget ${field}\\s*\\(`);
  if (getter.test(src)) return false;
  const re = new RegExp(`\\b${field}\\s*(?::[^=,;\\n]*)?[:=]\\s*(null|false|true|'[^']*'|"[^"]*"|\\s*$)`);
  const m = re.exec(src);
  if (!m) return true;
  const v = m[1].trim();
  return v === 'null' || v === 'false';
};

const BLOCKING = [
  ['legalName', 'Proprietor’s full legal name — for Terms and the Razorpay application'],
  ['line1', 'Street address — shown on Contact, used as the return address'],
  ['city', 'City or town of the operating address'],
  ['pin', 'PIN code of the operating address'],
  ['PRIMARY_DOMAIN', 'Which domain is primary (.com or .in), for canonical URLs'],
  ['phone', 'A phone number answered during support hours'],
  ['days', 'Which days support is available'],
  ['hours', 'Support hours, with the time zone'],
  ['name', 'Grievance contact — must be a real, named person'],
  ['designation', 'That person’s designation'],
  ['processingDays', 'Working days between payment and handover to India Post'],
  ['deliveryWindow', 'Typical India Post delivery window, stated as a range'],
  ['cancellationCutoff', 'Up to what point an order can be cancelled'],
  ['refundInitiationDays', 'Working days from approval to the refund being initiated'],
  ['refundCompletionDays', 'How long the bank or UPI app typically takes after that'],
  ['returnShipping', 'Who pays return postage, and in which cases'],
  ['POLICIES_UPDATED', 'The date the merchant approved this policy wording'],
];

/* Not launch-blocking: the site reads correctly without these, but each one changes what
   customers see, so they are reported rather than left silent. */
const ADVISORY = [
  ['constitution', 'Whether to state a business constitution, e.g. "Sole proprietorship"'],
  ['whatsappConfirmed', 'Confirm +91 97477 38193 is WhatsApp Business enabled — every WhatsApp link stays hidden until then'],
  ['gstin', 'Only if one is actually held; leave unset otherwise'],
];

const missing = BLOCKING.filter(([field]) => isNull(field));

const advisory = ADVISORY.filter(([field]) => isNull(field));

const reportAdvisory = () => {
  if (!advisory.length) return;
  console.log(`\n${advisory.length} detail(s) still to confirm (not launch-blocking):\n`);
  for (const [field, why] of advisory) console.log(`  · ${field.padEnd(22)} ${why}`);
};

if (missing.length === 0) {
  console.log('All launch-blocking business details are supplied.');
  reportAdvisory();
  process.exit(0);
}

console.error(`\n${missing.length} business detail(s) still to confirm before launch:\n`);
for (const [field, why] of missing) {
  console.error(`  · ${field.padEnd(22)} ${why}`);
}
reportAdvisory();
console.error(`
They live in src/config/businessInfo.ts.

The support email, WhatsApp number, shipping fee, free-shipping threshold and return
window are NOT here — the merchant sets those in the admin panel under Settings, and the
site reads them live so it cannot disagree with what the backend charges.

Until every detail above is supplied the site shows "(being updated)" where it belongs,
and must not be submitted for payment-gateway verification.
`);
process.exit(1);
