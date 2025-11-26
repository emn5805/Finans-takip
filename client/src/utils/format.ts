export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + 'TL';
};

export const formatCompactCurrency = (value: number, currency = 'TRY') =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

export const formatDateLabel = (value: string | Date) =>
  new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));

export const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
