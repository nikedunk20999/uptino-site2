/* Pure cart calculations and defensive browser storage. No DOM or network. */
(function (root) {
  'use strict';
  const MINIMUM_KOPECKS = 500000;
  const MAX_AMOUNT = 100000;
  const CART_KEY = 'uptino-cart-v1';
  const DELIVERY_KEY = 'uptino-delivery-v1';

  function normalizeCart(value, products) {
    if (!Array.isArray(value)) return [];
    const result = new Map();
    for (const item of value) {
      if (!item || typeof item !== 'object') continue;
      const product = products.find(p => p.id === item.id);
      if (!product || !Number.isSafeInteger(item.amount) || item.amount <= 0) continue;
      const max = product.unit === 'кг' ? MAX_AMOUNT : 100;
      result.set(item.id, { id: item.id, amount: Math.min(max, (result.get(item.id)?.amount || 0) + item.amount) });
    }
    return [...result.values()];
  }

  function lineTotal(product, amount) {
    if (!Number.isSafeInteger(amount) || amount <= 0 || !Number.isFinite(product.regular) || product.regular < 0) return null;
    if (product.unit === 'кг') return Math.round(product.regular * amount / 10);
    if (product.unit === 'упаковка') return Math.round(product.regular * 100) * amount;
    return null;
  }

  function summarize(cart, products) {
    let subtotalKopecks = 0;
    let hasUnpriced = false;
    const normalized = normalizeCart(cart, products);
    for (const item of normalized) {
      const total = lineTotal(products.find(p => p.id === item.id), item.amount);
      if (total === null) hasUnpriced = true;
      else subtotalKopecks += total;
    }
    return {
      subtotalKopecks,
      hasUnpriced,
      missingKopecks: Math.max(0, MINIMUM_KOPECKS - subtotalKopecks),
      minimumMet: normalized.length > 0 && subtotalKopecks >= MINIMUM_KOPECKS
    };
  }

  function changeAmount(cart, id, delta, products) {
    const product = products.find(p => p.id === id);
    if (!product || !Number.isSafeInteger(delta)) return normalizeCart(cart, products);
    const next = normalizeCart(cart, products);
    const existing = next.find(item => item.id === id);
    if (existing) existing.amount += delta;
    else if (delta > 0) next.push({ id, amount: delta });
    return normalizeCart(next, products);
  }

  function parseWeight(value) {
    const text = String(value).trim().replace(',', '.');
    if (!/^\d+(?:\.\d{1,3})?$/.test(text)) return null;
    const grams = Math.round(Number(text) * 1000);
    return grams >= 100 && grams <= MAX_AMOUNT ? grams : null;
  }

  function normalizeDelivery(value) {
    if (!value || typeof value !== 'object') return null;
    const clean = v => typeof v === 'string' ? v.replace(/[\u0000-\u001f]/g, '').trim() : '';
    const region = clean(value.region);
    const city = clean(value.city);
    return region.length >= 2 && region.length <= 80 && city.length >= 2 && city.length <= 80 ? { region, city } : null;
  }

  function storageFor(getStorage) {
    return {
      read(key) { try { return JSON.parse(getStorage().getItem(key)); } catch { return null; } },
      write(key, value) { try { getStorage().setItem(key, JSON.stringify(value)); return true; } catch { return false; } },
      remove(key) { try { getStorage().removeItem(key); return true; } catch { return false; } }
    };
  }

  function normalizePhone(value) {
    let digits = String(value).replace(/\D/g, '');
    if (digits.length === 11 && /^[78]/.test(digits)) digits = digits.slice(1);
    return digits.slice(0, 10);
  }

  root.UptinoCore = Object.freeze({ MINIMUM_KOPECKS, CART_KEY, DELIVERY_KEY, normalizeCart, lineTotal, summarize, changeAmount, parseWeight, normalizeDelivery, storageFor, normalizePhone });
  if (typeof module !== 'undefined' && module.exports) module.exports = root.UptinoCore;
})(globalThis);
