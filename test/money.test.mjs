/* Pure-helper tests for paise formatting. Run: node --experimental-strip-types test/money.test.mjs */
import assert from 'node:assert/strict';
import { fmtPaise } from '../src/lib/money.ts';

assert.equal(fmtPaise(0), '₹0.00');
assert.equal(fmtPaise(5), '₹0.05');
assert.equal(fmtPaise(99900), '₹999.00');
assert.equal(fmtPaise(123456789), '₹12,34,567.89');
assert.equal(fmtPaise(-40), '-₹0.40');
assert.equal(fmtPaise(undefined), '₹0.00');
console.log('money tests passed');
