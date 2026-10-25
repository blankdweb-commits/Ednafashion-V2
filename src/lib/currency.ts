/**
 * Monetary utilities: All internal calculations are performed in integer kobo.
 * 1 NGN = 100 Kobo.
 */

export function koboToNaira(kobo: number): number {
  return kobo / 100;
}

export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

/**
 * Formats integer kobo as a clean Nigerian Naira string (e.g. ₦24,500)
 */
export function formatKobo(kobo: number): string {
  const naira = Math.round(kobo) / 100;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(naira);
}

/**
 * Calculates percentage discount between base price and promotional price
 */
export function calculateDiscountPercentage(baseKobo: number, saleKobo: number | null): number {
  if (!saleKobo || saleKobo >= baseKobo || baseKobo <= 0) return 0;
  return Math.round(((baseKobo - saleKobo) / baseKobo) * 100);
}
