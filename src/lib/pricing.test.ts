import test from 'node:test';
import assert from 'node:assert/strict';
import { koboToNaira, nairaToKobo, formatKobo, calculateDiscountPercentage } from './currency';
import { calculateOrderTotals, validateCoupon } from './pricing';
import { CartItem, DeliveryZone, Coupon } from '../types';

test('currency: converts Naira and Kobo with zero floating-point drift', () => {
  assert.equal(nairaToKobo(25000), 2500000);
  assert.equal(koboToNaira(2500000), 25000);
  assert.equal(nairaToKobo(199.99), 19999);
});

test('currency: formats Kobo into proper Nigerian Naira format', () => {
  const formatted = formatKobo(3500000);
  assert.match(formatted, /35,000/);
});

test('currency: calculates discount percentage accurately', () => {
  assert.equal(calculateDiscountPercentage(4000000, 3000000), 25);
  assert.equal(calculateDiscountPercentage(5000000, null), 0);
  assert.equal(calculateDiscountPercentage(3500000, 2450000), 30);
});

test('pricing: calculates basic order totals without coupon', () => {
  const items: CartItem[] = [
    {
      variantId: 'v1',
      productId: 'p1',
      productName: 'Linen Kimono',
      size: 'M',
      color: 'Indigo',
      unitPriceKobo: 2500000,
      basePriceKobo: 3000000,
      imageUrl: '',
      quantity: 2,
      stockAvailable: 5,
    },
  ];
  const zone: DeliveryZone = {
    id: 'lagos-mainland',
    state: 'Lagos',
    name: 'Lagos Mainland',
    fee_kobo: 250000,
    estimated_days: '1-2 days',
  };

  const totals = calculateOrderTotals(items, zone, null);
  assert.equal(totals.subtotalKobo, 5000000);
  assert.equal(totals.discountKobo, 0);
  assert.equal(totals.deliveryFeeKobo, 250000);
  assert.equal(totals.totalKobo, 5250000);
});

test('pricing: applies percentage coupon correctly when minSpend is met', () => {
  const items: CartItem[] = [
    {
      variantId: 'v1',
      productId: 'p1',
      productName: 'Pleated Dress',
      size: 'S',
      color: 'Terracotta',
      unitPriceKobo: 3000000,
      basePriceKobo: 3000000,
      imageUrl: '',
      quantity: 1,
      stockAvailable: 3,
    },
  ];
  const zone: DeliveryZone = {
    id: 'lagos-island',
    state: 'Lagos',
    name: 'Lagos Island',
    fee_kobo: 300000,
    estimated_days: '1-2 days',
  };
  const coupon: Coupon = {
    code: 'EDNA10',
    type: 'percentage',
    value: 10,
    minSpendKobo: 2000000,
  };

  const totals = calculateOrderTotals(items, zone, coupon);
  assert.equal(totals.subtotalKobo, 3000000);
  assert.equal(totals.discountKobo, 300000); // 10% of 3,000,000 = 300,000
  assert.equal(totals.totalKobo, 3000000 - 300000 + 300000); // 3,000,000
});

test('pricing: rejects coupon if subtotal is below minimum spend threshold', () => {
  const coupon: Coupon = {
    code: 'VIP50',
    type: 'percentage',
    value: 50,
    minSpendKobo: 5000000, // requires ₦50,000
  };

  const validation = validateCoupon(coupon, 3000000);
  assert.equal(validation.valid, false);
  assert.match(validation.reason || '', /minimum order/);
});
