import { NetworkType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { Tezos, OpKind } from '@taquito/taquito';

import { TZBUTTON_AMOUNT_MUTEZ, TZBUTTON_CONTRACT, RPC_URL } from '../constants';

Tezos.setProvider({ rpc: RPC_URL });

const connectToBeacon = async () => {
  // Create a new BeaconWallet instance. The options will be passed to the DAppClient constructor.
  const wallet = new BeaconWallet({ name: 'TzButton' });

  // Setting the wallet as the wallet provider for Taquito.
  Tezos.setWalletProvider(wallet);

  // Specify the network on which the permissions will be requested.
  const network = {
    type: NetworkType.CARTHAGENET,
  };

  // Send permission request to the connected wallet. This will either be the browser extension, or a wallet over the P2P network.
  await wallet.requestPermissions({ network });

  return wallet;
};

export const participate = async (): Promise<void> => {
  const wallet = await connectToBeacon();

  await wallet.client.requestOperation({
    operationDetails: [
      {
        kind: 'transaction' as any,
        amount: TZBUTTON_AMOUNT_MUTEZ,
        destination: TZBUTTON_CONTRACT,
      },
    ],
  });
};

export const withdraw = async (): Promise<string> => {
  await connectToBeacon();

  // Connect to a specific contract on the tezos blockchain.
  // Make sure the contract is deployed on the network you requested permissions for.
  const contract = await Tezos.wallet.at(TZBUTTON_CONTRACT);
  // Call a method on a contract. In this case, we use the transfer entrypoint.
  // Taquito will automatically check if the entrypoint exists and if we call it with the right parameters.
  // In this case the parameters are [from, to, amount].
  // This will prepare the contract call and send the request to the connected wallet.
  const result = await contract.methods.withdraw('').send();

  // As soon as the operation is broadcast, you will receive the operation hash
  return result.opHash;
};

export const readStateFromContract = async () => {
  const contract = await Tezos.contract.at(TZBUTTON_CONTRACT);

  const contractStorage: any = await contract.storage();

  console.log(contractStorage);
  return contractStorage;
};

let lastUpdatedBlockHash: string = '';

export const checkRecentBlockForUpdates = async () => {
  console.log('checking for updates');
  const block = await Tezos.rpc.getBlock();

  const newRelevantBlock =
    block.hash !== lastUpdatedBlockHash &&
    block.operations[3].some((ops) =>
      ops.contents.some((op) => op.kind === OpKind.TRANSACTION && op.destination === TZBUTTON_CONTRACT)
    );

  lastUpdatedBlockHash = block.hash;

  return newRelevantBlock;
};

export const openTezBlock = async () => {
  window.open(`https://carthagenet.tezblock.io/account/${TZBUTTON_CONTRACT}`, '_blank');
};

export const getPotAmount = async () => {
  return (await Tezos.tz.getBalance(TZBUTTON_CONTRACT)).shiftedBy(-6).toString();
};
