/**
 * IVA Utility Functions
 * Single source of truth for all tax calculations across the application.
 */

const DEFAULT_IVA_RATE = 0.22; // 22% IVA standard italiano

/**
 * Format a number as EUR currency (Italian locale)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number as a percentage string
 */
export function formatIvaRate(rate: number): string {
  return `${(rate * 100).toFixed(0)}%`;
}

/**
 * Calculate the IVA amount from a subtotal (pre-tax amount)
 */
export function calculateIvaAmount(
  subtotal: number,
  rate: number = DEFAULT_IVA_RATE
): number {
  return roundToCents(subtotal * rate);
}

/**
 * Calculate the total amount (subtotal + IVA)
 */
export function calculateTotal(
  subtotal: number,
  rate: number = DEFAULT_IVA_RATE
): number {
  return roundToCents(subtotal * (1 + rate));
}

/**
 * Calculate subtotal from total (reverse calculation)
 */
export function calculateSubtotalFromTotal(
  total: number,
  rate: number = DEFAULT_IVA_RATE
): number {
  return roundToCents(total / (1 + rate));
}

/**
 * Get the IVA breakdown object for display
 */
export function ivaBreakdown(
  subtotal: number,
  rate: number = DEFAULT_IVA_RATE
): {
  subtotal: number;
  ivaRate: number;
  ivaAmount: number;
  total: number;
  subtotalFormatted: string;
  ivaAmountFormatted: string;
  totalFormatted: string;
  ivaRateFormatted: string;
} {
  const ivaAmount = calculateIvaAmount(subtotal, rate);
  const total = calculateTotal(subtotal, rate);

  return {
    subtotal: roundToCents(subtotal),
    ivaRate: rate,
    ivaAmount: roundToCents(ivaAmount),
    total: roundToCents(total),
    subtotalFormatted: formatCurrency(roundToCents(subtotal)),
    ivaAmountFormatted: formatCurrency(roundToCents(ivaAmount)),
    totalFormatted: formatCurrency(roundToCents(total)),
    ivaRateFormatted: formatIvaRate(rate),
  };
}

/**
 * Round a number to 2 decimal places (cents)
 */
export function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Create a URL-safe slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

export { DEFAULT_IVA_RATE };
