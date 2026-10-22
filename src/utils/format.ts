export const rs = (amount: number): string =>
  'Rs. ' + Math.round(amount).toLocaleString('en-PK');

export const rsCompact = (amount: number): string => 'Rs. ' + Math.round(amount);
