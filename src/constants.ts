import { BigNumber } from 'bignumber.js'

export const NODE_URL = 'https://mainnet.api.tez.ie'

export const TZBUTTON_CONTRACT: string = 'KT1H28iie4mW9LmmJeYLjH6zkC8wwSmfHf5P'
export const TZBUTTON_AMOUNT_MUTEZ: string = '200000'

export const TZBUTTON_COLOR_CONTRACT: string =
  'KT1GFVf3ZVLiSxgU5EqBrmboEEU16prAdeJQ'
export const TZCOLORS_CONTRACT: string = 'KT1FyaDqiMQWg7Exo7VUiXAgZbd2kCzo3d4s'

export const XTZ_STRING = 'tez'

export const CONTRIBUTION_AMOUNT_STRING = (multiplier: number = 1) => {
  return `${new BigNumber(TZBUTTON_AMOUNT_MUTEZ)
    .shiftedBy(-6)
    .times(multiplier)
    .toFixed()} ${XTZ_STRING}`
}
