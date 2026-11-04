const { test } = require('node:test');
const assert = require('node:assert/strict');
const core = require('../assets/core.js');
const { products } = require('../assets/catalog.js');

test('catalog has unique stable IDs, valid prices and explicit sale units', () => {
  assert.equal(products.length, 32);
  assert.equal(new Set(products.map(p => p.id)).size, 32);
  for (const p of products) {
    assert.ok(Number.isFinite(p.regular) && p.regular > 0);
    assert.ok(['кг','упаковка','уточнить'].includes(p.unit));
  }
  assert.equal(products.filter(p => p.unit === 'кг').length, 29);
  assert.equal(products.filter(p => p.unit === 'уточнить').length, 3);
});

test('kilogram prices are calculated in kopecks with grams, never counted as pieces', () => {
  assert.equal(core.lineTotal({ regular: 990, unit: 'кг' }, 1000), 99000);
  assert.equal(core.lineTotal({ regular: 990, unit: 'кг' }, 350), 34650);
  assert.equal(core.lineTotal({ regular: 1210, unit: 'кг' }, 333), 40293);
  assert.equal(core.lineTotal({ regular: 395, unit: 'уточнить' }, 1), null);
  assert.equal(core.lineTotal({ regular: 395, unit: 'упаковка' }, 2), 79000);
});

test('minimum order boundaries: empty, below, exact and above 5000 rubles', () => {
  const product = [{ id: 'p', regular: 500, unit: 'кг' }];
  assert.equal(core.summarize([], product).minimumMet, false);
  const below = core.summarize([{ id: 'p', amount: 9999 }], product);
  assert.equal(below.minimumMet, false);
  assert.equal(below.missingKopecks, 50);
  assert.equal(core.summarize([{ id: 'p', amount: 10000 }], product).minimumMet, true);
  assert.equal(core.summarize([{ id: 'p', amount: 10001 }], product).missingKopecks, 0);
});

test('unknown units cannot inflate the total or satisfy the minimum', () => {
  const result = core.summarize([{ id: 'retail-65', amount: 100 }], products);
  assert.equal(result.subtotalKopecks, 0);
  assert.equal(result.minimumMet, false);
  assert.equal(result.hasUnpriced, true);
});

test('saved cart repairs malformed values, ignores missing IDs and merges duplicate lines', () => {
  assert.deepEqual(core.normalizeCart({}, products), []);
  const result = core.normalizeCart([null, 8, { id: 'removed', amount: 1 }, { id: 'retail-5', amount: -10 }, { id: 'retail-5', amount: '1000' }, { id: 'retail-5', amount: 1000 }, { id: 'retail-5', amount: 200 }, { id: 'retail-65', amount: 999 }], products);
  assert.deepEqual(result, [{ id: 'retail-5', amount: 1200 }, { id: 'retail-65', amount: 100 }]);
});

test('quantity adjustment removes zero amounts, preserves IDs and caps excessive weight', () => {
  let cart = core.changeAmount([], 'retail-5', 1000, products);
  assert.deepEqual(cart, [{ id: 'retail-5', amount: 1000 }]);
  cart = core.changeAmount(cart, 'retail-5', -100, products);
  assert.equal(cart[0].amount, 900);
  assert.deepEqual(core.changeAmount(cart, 'retail-5', -900, products), []);
  assert.equal(core.changeAmount(cart, 'retail-5', 999999, products)[0].amount, 100000);
});

test('weight field handles decimal comma, grams and invalid input', () => {
  assert.equal(core.parseWeight('0,35'), 350);
  assert.equal(core.parseWeight('1.001'), 1001);
  assert.equal(core.parseWeight('100'), 100000);
  for (const value of ['', '0', '-1', '0.099', '100.001', 'NaN', '1e3', '0.1001', '<script>']) assert.equal(core.parseWeight(value), null);
});

test('region preferences require both region and city and discard extra data', () => {
  assert.equal(core.normalizeDelivery(null), null);
  assert.equal(core.normalizeDelivery({ region: 'Москва' }), null);
  assert.deepEqual(core.normalizeDelivery({ region: ' Московская область ', city: ' Мытищи ', phone: 'do not store' }), { region: 'Московская область', city: 'Мытищи' });
});

test('blocked or corrupt local storage never prevents the shop from working', () => {
  const blocked = core.storageFor(() => { throw Error('blocked'); });
  assert.equal(blocked.read('x'), null);
  assert.equal(blocked.write('x', []), false);
  assert.equal(blocked.remove('x'), false);
  const corrupt = core.storageFor(() => ({ getItem: () => '{broken' }));
  assert.equal(corrupt.read('x'), null);
  const values = {};
  const ok = core.storageFor(() => ({ getItem: k => values[k] ?? null, setItem: (k, v) => { values[k] = v; }, removeItem: k => { delete values[k]; } }));
  assert.equal(ok.write('x', { city: 'Уфа' }), true);
  assert.deepEqual(ok.read('x'), { city: 'Уфа' });
});

test('phone paste supports +7 and Russian 8 without duplicating the prefix', () => {
  assert.equal(core.normalizePhone('+7 (967) 452-11-99'), '9674521199');
  assert.equal(core.normalizePhone('8 (967) 452-11-99'), '9674521199');
  assert.equal(core.normalizePhone('9674521199'), '9674521199');
});
