import { BigNumber } from 'bignumber.js';

export const TZBUTTON_CONTRACT: string = 'KT1Pbf3jrwvYLjwyzjKzhgtJURzfXubYfMQn';
export const TZBUTTON_AMOUNT_MUTEZ: string = '200000';

export const XTZ_STRING = 'XTZ';

export const NUMBER_OF_BLOCKS_TO_WIN: 256 = 256;

export const RPC_URL = 'https://api.tez.ie/rpc/carthagenet';

export const CONTRIBUTION_AMOUNT_STRING = (multiplier: number = 1) => {
  return `${new BigNumber(TZBUTTON_AMOUNT_MUTEZ).shiftedBy(-6).times(multiplier).toFixed()} ${XTZ_STRING}`;
};
