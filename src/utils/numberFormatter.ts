export const formatNumber = (number: number) => new Intl.NumberFormat().format(number);

export const formatCurrency = (amount: number, locale = 'en-US', currency = 'usd'): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
