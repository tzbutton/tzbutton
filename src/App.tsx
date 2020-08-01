import React from 'react';
import './App.css';
import theme from '@chakra-ui/theme';

import { Footer } from './Footer';

import {
  Stack,
  ChakraProvider,
  CSSReset,
  Box,
  Square,
  Text,
  Container,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/core';
import { NetworkType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { Tezos, OpKind } from '@taquito/taquito';
import Countdown from 'react-countdown';

const TZBUTTON_CONTRACT: string = 'KT1SnLMjynVUHadGFHhFJ76eTnGEuMT6zYVc';
const TZBUTTON_AMOUNT: string = '200000';

const RPC_URL = 'https://api.tez.ie/rpc/carthagenet';

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

const participate = async (): Promise<void> => {
  const wallet = await connectToBeacon();

  await wallet.client.requestOperation({
    operationDetails: [
      {
        kind: 'transaction' as any,
        amount: TZBUTTON_AMOUNT,
        destination: TZBUTTON_CONTRACT,
      },
    ],
  });
};

const withdraw = async (): Promise<string> => {
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

async function clickButton() {
  // Call the contract
  await participate();
}

async function readStateFromContract() {
  const contract = await Tezos.contract.at(TZBUTTON_CONTRACT);

  const contractStorage: any = await contract.storage();

  console.log(contractStorage);
  return contractStorage;
}

interface AppState {
  loaded: boolean;
  potAmount: string;
  leader: string;
  leaderStartTime: Date | undefined;
  leaderEndTime: Date | undefined;
}

const NUMBER_OF_BLOCKS_TO_WIN: 256 = 256;

let lastUpdatedBlockHash: string = '';

const checkRecentBlockForUpdates = async () => {
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

const openTezBlock = async () => {
  window.open(`https://carthagenet.tezblock.io/account/${TZBUTTON_CONTRACT}`, '_blank');
};

const CONTRIBUTION_AMOUNT_XTZ_STRING = '0.2';
const XTZ_AMOUNT_STRING = 'XTZ';

const FAQs = [
  {
    title: `Are there any fees?`,
    description: `The only fees that are required are the transaction fees (gas cost to execute your transaction)`,
  },
  {
    title: `Who has developed TZButton?`,
    description: `TZButton was developed by members of the AirGap team during their free time.`,
  },
  {
    title: `Can I press the button multiple times?`,
    description: `Yes. Just keep in mind, that every time the button is pressed you will add ${CONTRIBUTION_AMOUNT_XTZ_STRING} ${XTZ_AMOUNT_STRING} to the balance and the countdown will be reset (it does not make any sense to press it if you already are the leader).`,
  },
  {
    title: `How is this project funded?`,
    description: `This project was created on a voluntary basis during our free time. We don’t have any direct commercial motivation. The only thing that could be considered as a commercial motivation is that the contract’s balance is delegated to the AirGap baker. All resulting baking rewards will be used to support open source software.`,
  },
  {
    title: `Where can I find the source code of this project?`,
    description: `The entire project is released using the permissive MIT license, you can find the code on github <<link>>`,
  },
  {
    title: `How can I participate in the experiment?`,
    description: `In case you already have a beacon compatible wallet you just have to press the button J  In case you don’t have a beacon compatible wallet yet, here are some guide how to set up one:`,
  },
  {
    title: `How can I withdraw the balance?`,
    description: `When the countdown expires the current button will become the withdraw button.`,
  },
  {
    title: `If I’m the leader and the countdown expired, how quickly do I need to withdraw the balance?`,
    description: `No rush. You can take all the time you need, no one will be able to overwrite your leader position and you are the only one capable to withdraw the funds.`,
  },
  {
    title: `Can’t the contract owner withdraw the balance?`,
    description: `No. The contract does not have such a function, only the leader after the countdown’s expiration can withdraw the balance.`,
  },
  {
    title: `Why are there no cat pictures on this site?`,
    description: `There are: <<cat>>`,
  },
  {
    title: `Can I pay more than ${CONTRIBUTION_AMOUNT_XTZ_STRING} ${XTZ_AMOUNT_STRING}?`,
    description: `No, the contract will not allow you to pay more or less than ${CONTRIBUTION_AMOUNT_XTZ_STRING} ${XTZ_AMOUNT_STRING}.`,
  },
  {
    title: `Can I pay less than ${CONTRIBUTION_AMOUNT_XTZ_STRING} ${XTZ_AMOUNT_STRING}?`,
    description: `No, the contract will not allow you to pay more or less than ${CONTRIBUTION_AMOUNT_XTZ_STRING} ${XTZ_AMOUNT_STRING}.`,
  },
  {
    title: `Is this dApp secure?`,
    description: `We’ve put in a lot of effort to make it as easy and secure as possible (and our team is dedicated to security). It is an experiment and it should be dealt with that way. Don’t participate if you cannot afford to loose the 0.2 TZ you are sending to the contract.`,
  },
];

// Use at the root of your app
class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loaded: false,
      potAmount: '',
      leader: '',
      leaderStartTime: undefined,
      leaderEndTime: undefined,
    };

    setInterval(async () => {
      const hasUpdates = await checkRecentBlockForUpdates();
      if (hasUpdates) {
        this.refreshContractState();
      }
    }, 10 * 1000);
  }

  refreshContractState = async () => {
    console.log('refreshing');
    const contractState = await readStateFromContract();
    const startDate = new Date(contractState.leadership_start_timestamp);
    this.setState({
      loaded: true,
      potAmount: (await Tezos.tz.getBalance(TZBUTTON_CONTRACT)).shiftedBy(-6).toString(),
      leader: contractState.leader,
      leaderStartTime: startDate,
      leaderEndTime: this.getTargetTime(startDate),
    });
  };

  componentDidMount = async () => {
    this.refreshContractState();
  };

  componentWillUnmount = async () => {
    console.log('unmounting');
  };

  getTargetTime = (start: Date) => {
    const end = new Date(start.getTime() + NUMBER_OF_BLOCKS_TO_WIN * 60 * 1000);

    return end;
  };

  render() {
    const WinnerAnnouncement = () => (
      <span>
        The game is over!
        <br />
        <Button onClick={withdraw} colorScheme="green" size="sm">
          Withdraw
        </Button>
      </span>
    );

    const page = this.state.loaded ? (
      <>
        <Stack minH="90vh">
          <Container>
            <br />
            <br />
            <br />
            <Square fontSize="3xl">
              <Text>TzButton</Text>
            </Square>
            <Square>
              <Text>A social experiment on the Tezos blockchain. </Text>
            </Square>
            <br />
            <Square>
              <Text fontSize="6xl">
                {!!this.state.leaderEndTime ? (
                  <Countdown date={this.state.leaderEndTime} daysInHours={true} zeroPadTime={2}>
                    <WinnerAnnouncement />
                  </Countdown>
                ) : (
                  'Loading...'
                )}
              </Text>
            </Square>
            <br />
            <Square>
              <Text fontSize="3xl">Price: {this.state.potAmount} XTZ</Text>
            </Square>
            <br />
            <Square>
              <Text fontSize="xl">Leader: {this.state.leader}</Text>
            </Square>
            <br />
            <Square>
              <Button onClick={clickButton} colorScheme="green" size="lg">
                Button
              </Button>
            </Square>
            <br />
            <br />
            Leadership start time: {this.state.leaderStartTime?.toString()}
            <br />
            <Square>
              <Button onClick={openTezBlock} colorScheme="green" size="sm">
                History
              </Button>
            </Square>
          </Container>
          <Container>
            How does it work? <br />
            The TZButton experiment is controlled by a smart contract deployed on the Tezos blockchain. Whenever anyone
            presses the button three things will happen:
            <ol>
              <li>You will add 0.2 TZ to the smart contract’s balance</li>
              <li>The address of the sender will become the leader</li>
              <li>A countdown of 256 minutes is reset and started</li>
            </ol>
            The address that is set after the countdown expired will be eligible to withdraw the total balance on the
            smart contract. Example:
            <ol>
              <li>
                Alice presses the button, 0.2 TZ are now on the smart contract, the countdown of 256 minutes starts.{' '}
              </li>
              <li>
                After 200 minutes Bob presses the button, 0.4 TZ are now on the smart contract, the countdown resets to
                256 minutes and starts.{' '}
              </li>
              <li>
                After 5 minutes Charlie presses the button, 0.6 TZ are now on the smart contract, the countdown resets
                to 256 minutes and starts.{' '}
              </li>
              <li>No one presses the button for more than 256 minutes. </li>
              <li>Charlie can now withdraw 0.6 TZ, because he was the last leader and his countdown has expired. </li>
            </ol>
          </Container>
          <Container>
            Why TzButton?
            <br />
            The experiment was inspired by “the Button” (an experiment conducted with Reddit users LINK). Besides the
            fact that the behavior of the participating users will be automatically recorded on the blockchain and
            analyzed + published on this site, there are also other reasons why this experiment is interesting:
            <ul>
              <li>
                It showcases how easy it is for dApps to interact securely with the Tezos blockchain using the existing
                libraries in the ecosystem (like beacon and taquito LINK)
              </li>
              <li>
                It sets an incentive for security engineers to try to break and exploit the smart contract. This could
                mean two things:
                <ol>
                  <li>
                    The contract and tooling used is secure and can be used as a reference for future applications.
                  </li>
                  <li>
                    A breach would be transparent and recorded on the blockchain, meaning the entire community would be
                    able to learn from it.
                  </li>
                </ol>
              </li>
              <li>
                It provides to the community an open source boilerplate/project to create dApps on the Tezos Blockchain.
              </li>
            </ul>
          </Container>
          <Square>
            FAQ
            <Accordion allowToggle>
              {FAQs.map((faq) => {
                return (
                  <AccordionItem>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        {faq.title}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>{faq.description}</AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </Square>
        </Stack>
        <Footer />
      </>
    ) : (
      'Loading...'
    );
    return (
      <ChakraProvider theme={theme}>
        <CSSReset />
        <>{page}</>
      </ChakraProvider>
    );
  }
}

export default App;
