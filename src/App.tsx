import React from "react";
import "./App.css";
import theme from "@chakra-ui/theme";

import {
  ChakraProvider,
  CSSReset,
  Flex,
  Square,
  Text,
  Container,
  Button,
} from "@chakra-ui/core";
import { NetworkType } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { Tezos, OpKind } from "@taquito/taquito";
import Countdown from "react-countdown";

const TZBUTTON_CONTRACT: string = "KT1SnLMjynVUHadGFHhFJ76eTnGEuMT6zYVc";
const TZBUTTON_AMOUNT: string = "200000";

Tezos.setProvider({ rpc: "https://api.tez.ie/rpc/carthagenet" });

const connectToBeacon = async () => {
  // Create a new BeaconWallet instance. The options will be passed to the DAppClient constructor.
  const wallet = new BeaconWallet({ name: "TzButton" });

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
        kind: "transaction" as any,
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
  const result = await contract.methods.withdraw("").send();

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

let lastUpdatedBlockHash: string = "";

const checkRecentBlockForUpdates = async () => {
  console.log("checking for updates");
  const block = await Tezos.rpc.getBlock();

  const newRelevantBlock =
    block.hash !== lastUpdatedBlockHash &&
    block.operations[3].some((ops) =>
      ops.contents.some(
        (op) =>
          op.kind === OpKind.TRANSACTION && op.destination === TZBUTTON_CONTRACT
      )
    );

  lastUpdatedBlockHash = block.hash;

  return newRelevantBlock;
};

const openTezBlock = async () => {
  window.open(
    `https://carthagenet.tezblock.io/account/${TZBUTTON_CONTRACT}`,
    "_blank"
  );
};

// Use at the root of your app
class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loaded: false,
      potAmount: "",
      leader: "",
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
    console.log("refreshing");
    const contractState = await readStateFromContract();
    const startDate = new Date(contractState.leadership_start_timestamp);
    this.setState({
      loaded: true,
      potAmount: (await Tezos.tz.getBalance(TZBUTTON_CONTRACT))
        .shiftedBy(-6)
        .toString(),
      leader: contractState.leader,
      leaderStartTime: startDate,
      leaderEndTime: this.getTargetTime(startDate),
    });
  };

  componentDidMount = async () => {
    this.refreshContractState();
  };

  componentWillUnmount = async () => {
    console.log("unmounting");
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
      <Flex color="black">
        <Container height="500px">
          <br />
          <br />
          <br />
          <Square>
            <Text>TzButton</Text>
          </Square>
          <br />
          <Square>
            <Text fontSize="6xl">
              {!!this.state.leaderEndTime ? (
                <Countdown
                  date={this.state.leaderEndTime}
                  daysInHours={true}
                  zeroPadTime={2}
                >
                  <WinnerAnnouncement />
                </Countdown>
              ) : (
                "Loading..."
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
      </Flex>
    ) : (
      "Loading..."
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
