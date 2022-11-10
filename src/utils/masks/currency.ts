export const currency = (
  value: number,
  extra?: {
    decimal?: number;
    groupSeparator?: string;
    decimalSeparator?: string;
    currencySymbol?: string;
  },
) => {
  const decimal = extra?.decimal || 2;
  const groupSeparator = extra?.groupSeparator || '.';
  const decimalSeparator = extra?.decimalSeparator || ',';
  const currencySymbol = extra?.currencySymbol || 'R$';

  let n = value.toString();
  const s = value < 0 ? '-' : '';
  const i = String(
    parseInt((n = Math.abs(Number(n) || 0).toFixed(decimal)), 10),
  );
  const j = i.length > 3 ? i.length % 3 : 0;
  return (
    currencySymbol +
    (currencySymbol ? ' ' : '') +
    (s +
      (j ? i.slice(0, j) + groupSeparator : '') +
      i.slice(j).replace(/(\d{3})(?=\d)/g, `$1${groupSeparator}`) +
      (decimal
        ? decimalSeparator +
          Math.abs(Number(n) - Number(i))
            .toFixed(decimal)
            .slice(2)
        : ''))
  );
};
