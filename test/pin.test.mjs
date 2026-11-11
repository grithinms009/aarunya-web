/* Run: node --experimental-strip-types test/pin.test.mjs */
import assert from 'node:assert/strict';
import { isPin, matchState, placeLine, estimateFailure } from '../src/lib/pin.ts';

assert.ok(isPin('682001'));
assert.ok(!isPin('08200') && !isPin('012345') && !isPin('68200a'));
assert.equal(matchState('kerala', ['Goa', 'Kerala']), 'Kerala');
assert.equal(matchState('Nowhere', ['Goa']), '');
assert.equal(matchState(null, ['Goa']), '');
assert.equal(placeLine('Ernakulam', 'Kerala'), 'Ernakulam, Kerala');
assert.equal(placeLine('', 'Kerala'), 'Kerala');
assert.equal(placeLine('Ernakulam', null), 'Ernakulam');
assert.match(estimateFailure('unknown_pin'), /couldn’t find/);
assert.match(estimateFailure('no_delivery'), /India Post/);
console.log('pin tests passed');
