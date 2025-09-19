/**
 * Formats a money amount by rounding to the nearest pound and adding comma separators
 * @param amount The amount to format
 * @returns Formatted string with commas, no decimal places
 */
export function formatCurrency(amount: number): string {
  return Math.round(amount).toLocaleString();
}

/**
 * Formats a money amount with currency symbol by rounding to the nearest unit
 * @param amount The amount to format
 * @param currencySymbol The currency symbol to use (defaults to £)
 * @returns Formatted string with currency symbol, commas, and no decimal places
 */
export function formatCurrencyWithSymbol(amount: number, currencySymbol: string = '£'): string {
  return `${currencySymbol}${formatCurrency(amount)}`;
}
