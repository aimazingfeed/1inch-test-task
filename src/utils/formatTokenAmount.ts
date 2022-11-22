import BigNumber from 'bignumber.js/bignumber';

import { formatNumber } from './numberFormatter';

type strOrNum = string | number;

export const getValueWithDecimals = (amount: strOrNum, decimals: strOrNum) => {
  return new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimals)).toString(10);
};

export const toDecimals = (balance: string | number, decimals = 18, shouldFormatNumber = false): string => {
  if (balance === '') {
    return '0';
  }

  if (typeof balance === 'number') {
    balance.toString();
  }

  const displayValue = new BigNumber(balance).multipliedBy(new BigNumber(10).pow(decimals));

  if (shouldFormatNumber) {
    const formattedValue = formatNumber(+displayValue.toString());

    return formattedValue;
  }

  return displayValue.toString(10);
};

export const fromDecimals = (balance: string | number, decimals = 18, withDecimals = false): string => {
  if (!balance || !decimals) return '0';

  if (typeof balance === 'number') {
    balance.toString();
  }
  const displayValue = new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals));
  return displayValue.toFixed(withDecimals ? decimals : 2);
};
