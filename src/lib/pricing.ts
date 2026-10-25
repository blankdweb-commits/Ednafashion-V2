import { CartItem, Coupon, DeliveryZone, OrderBreakdown } from '../types';

/**
 * Calculates authoritative order totals including items, coupon discounts,
 * delivery fees, and tax. All in integer kobo.
 */
export function calculateOrderTotals(
  items: CartItem[],
  zone: DeliveryZone | null,
  coupon: Coupon | null
): OrderBreakdown {
  const subtotalKobo = items.reduce(
    (acc, item) => acc + Math.round(item.unitPriceKobo * item.quantity),
    0
  );

  let discountKobo = 0;
  if (coupon) {
    if (subtotalKobo >= coupon.minSpendKobo) {
      if (coupon.type === 'percentage') {
        discountKobo = Math.round((subtotalKobo * coupon.value) / 100);
      } else if (coupon.type === 'fixed') {
        discountKobo = Math.min(coupon.value, subtotalKobo);
      }
    }
  }

  const deliveryFeeKobo = zone ? zone.fee_kobo : 0;
  // Tax is configurable per Nigerian regulatory directives (default 0 or itemized)
  const taxKobo = 0;
  const totalKobo = Math.max(0, subtotalKobo - discountKobo + deliveryFeeKobo + taxKobo);

  return {
    subtotalKobo,
    discountKobo,
    deliveryFeeKobo,
    taxKobo,
    totalKobo,
  };
}

/**
 * Validates whether a coupon code is eligible for a given subtotal
 */
export function validateCoupon(
  coupon: Coupon | null,
  subtotalKobo: number
): { valid: boolean; reason?: string } {
  if (!coupon) {
    return { valid: false, reason: 'Invalid or expired coupon code' };
  }
  if (subtotalKobo < coupon.minSpendKobo) {
    return {
      valid: false,
      reason: `Coupon requires a minimum order of ₦${(coupon.minSpendKobo / 100).toLocaleString()}`,
    };
  }
  return { valid: true };
}
