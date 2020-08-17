import { BigNumber } from 'bignumber.js';

export const TZBUTTON_CONTRACT: string = 'KT1L5XZbKeMXFDJuwr1zcFzkamTWf7kk6LRd';
export const TZBUTTON_AMOUNT_MUTEZ: string = '200000';

export const XTZ_STRING = 'XTZ';

export const CONTRIBUTION_AMOUNT_STRING = (multiplier: number = 1) => {
  return `${new BigNumber(TZBUTTON_AMOUNT_MUTEZ).shiftedBy(-6).times(multiplier).toFixed()} ${XTZ_STRING}`;
};