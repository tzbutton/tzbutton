import { BeaconWallet } from '@taquito/beacon-wallet'
import { TezosToolkit, OpKind } from '@taquito/taquito'
import { BigNumber } from 'bignumber.js'

import { TZBUTTON_AMOUNT_MUTEZ, TZBUTTON_COLOR_CONTRACT, TZBUTTON_CONTRACT } from '../constants'
import { getColors } from './tzcolors-service'

const Tezos = new TezosToolkit('https://tezos-node.prod.gke.papers.tech/')

export interface ContractStorage {
  countdown_milliseconds: BigNumber
  leader: string
  leadership_start_timestamp: number
}

export interface ColorContractStorage {
  highest_bidder: string
  state: BigNumber
  token_id: BigNumber
}

let globalWallet: BeaconWallet | undefined

const getBeaconInstance = async () => {
  if (!globalWallet) {
    // Create a new BeaconWallet instance. The options will be passed to the DAppClient constructor.
    const wallet = new BeaconWallet({ name: 'TzButton' })

    // Setting the wallet as the wallet provider for Taquito.
    Tezos.setWalletProvider(wallet)
    globalWallet = wallet
  }

  return globalWallet
}

const connectToBeacon = async () => {
  console.log('CONNECTING TO BEACON')
  const wallet = await getBeaconInstance()


  if (await wallet.client.getActiveAccount()) {
    // Check if we already have an account connected, so we can skip requestPermissions.
    return wallet
  }

  // Send permission request to the connected wallet. This will either be the browser extension, or a wallet over the P2P network.
  await wallet.requestPermissions()

  return wallet
}

export const participate = async (): Promise<void> => {
  const wallet = await connectToBeacon()

  await wallet.client.requestOperation({
    operationDetails: [
      {
        kind: 'transaction' as any,
        amount: TZBUTTON_AMOUNT_MUTEZ,
        destination: TZBUTTON_CONTRACT,
      },
      {
        kind: 'transaction' as any,
        amount: '0',
        destination: 'KT1GFVf3ZVLiSxgU5EqBrmboEEU16prAdeJQ',
        parameters: {
          entrypoint: 'set_color',
          value: {
            int: "925"
          }
        }
      },
    ],
  })
}

export const withdraw = async (): Promise<string> => {
  await connectToBeacon()

  // Connect to a specific contract on the tezos blockchain.
  // Make sure the contract is deployed on the network you requested permissions for.
  const contract = await Tezos.wallet.at(TZBUTTON_CONTRACT)
  // Call a method on a contract. In this case, we use the transfer entrypoint.
  // Taquito will automatically check if the entrypoint exists and if we call it with the right parameters.
  // In this case the parameters are [from, to, amount].
  // This will prepare the contract call and send the request to the connected wallet.
  const result = await contract.methods.withdraw('').send()

  // As soon as the operation is broadcast, you will receive the operation hash
  return result.opHash
}

export const readStateFromContract = async (): Promise<ContractStorage> => {
  const contract = await Tezos.contract.at(TZBUTTON_CONTRACT)

  const contractStorage: ContractStorage = await contract.storage()

  return contractStorage
}

export const readColorStateFromContract = async (): Promise<ColorContractStorage> => {
  const contract = await Tezos.contract.at(TZBUTTON_COLOR_CONTRACT)

  const contractStorage: ColorContractStorage = await contract.storage()

  return contractStorage
}

let lastUpdatedBlockHash: string = ''

export const checkRecentBlockForUpdates = async () => {
  console.log('checking for updates')
  const block = await Tezos.rpc.getBlock()

  const newRelevantBlock =
    block.hash !== lastUpdatedBlockHash &&
    block.operations[3].some((ops) =>
      ops.contents.some(
        (op) =>
          op.kind === OpKind.TRANSACTION && op.destination === TZBUTTON_CONTRACT
      )
    )

  lastUpdatedBlockHash = block.hash

  return newRelevantBlock
}

export const getTezBlockLinkForAddress = (
  address: string = TZBUTTON_CONTRACT
) => {
  return `https://tezblock.io/account/${address}`
}

export const openTezBlock = async () => {
  window.open(getTezBlockLinkForAddress(), '_blank')
}

export const openBetterCallDev = async () => {
  window.open(
    `https://better-call.dev/mainnet/${TZBUTTON_CONTRACT}/code`,
    '_blank'
  )
}

export const getPotAmount = async () => {
  return (await Tezos.tz.getBalance(TZBUTTON_CONTRACT)).shiftedBy(-6).toString()
}

export const getMyAddress = async () => {
  const wallet = await getBeaconInstance()

  const activeAccount = await wallet.client.getActiveAccount()

  if (activeAccount) {
    getColors(activeAccount.address)
  }

  return activeAccount?.address ?? ''
}

export const setBeaconColorMode = async (colorMode: 'dark' | 'light') => {
  const wallet = await getBeaconInstance()
  if (wallet) {
    await wallet.client.setColorMode(colorMode as any)
  }
}

// TODO: How do you do this without hacks?
const colorMode = localStorage.getItem('chakra-ui-color-mode')
setBeaconColorMode(colorMode as any || 'light')