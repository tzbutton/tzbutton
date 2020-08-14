import React, { useState, useEffect, useRef } from "react";
import Countdown from "react-countdown";
import {
  Square,
  Box,
  Divider,
  Text,
  Container,
  Button,
  Heading,
  useToast,
} from "@chakra-ui/core";
import { getLink } from "../../util";

import {
  getPotAmount,
  checkRecentBlockForUpdates,
  readStateFromContract,
  participate,
  withdraw,
  openTezBlock,
  openBetterCallDev,
  getMyAddress,
  getTezBlockLinkForAddress,
} from "../../services/beacon-service";
// import { getCountdownForNextBalance } from '../../services/countdown-service';

import TzButtonPressed from "../../logos/tzbutton-logo-pressed.svg";
import TzButtonUnpressed from "../../logos/tzbutton-logo-unpressed.svg";

const WinnerAnnouncement = () => (
  <span>
    The game is over!
    <br />
    <Button onClick={withdraw} colorScheme="green" size="sm">
      Withdraw
    </Button>
  </span>
);

interface AppState {
  loaded: boolean;
  potAmount: string;
  leader: string;
  leaderStartTime: Date | undefined;
  leaderEndTime: Date | undefined;
  myAddress: string;
}

const refreshContractState = async (
  setState: React.Dispatch<React.SetStateAction<AppState>>,
  toast?: any
) => {
  console.log("refreshing");
  const contractState = await readStateFromContract();
  const myAddress = await getMyAddress();
  const startDate = new Date(contractState.leadership_start_timestamp);
  const secondsToWin = contractState.countdown_seconds;
  const endDate = new Date(startDate.getTime() + secondsToWin * 1000);
  const newState = {
    loaded: true,
    potAmount: await getPotAmount(),
    leader: contractState.leader,
    leaderStartTime: startDate,
    leaderEndTime: endDate,
    myAddress,
  };
  initialResolve = Promise.resolve(newState);
  setState(newState);
  if (toast) {
    toast({
      position: "top",
      title: "New leader",
      description:
        "Someone just became the new leader and the countdown was reset.",
      status: "success",
      duration: 6000,
      isClosable: true,
    });
  }
};

// TODO: Get rid of this
let initialResolve = new Promise(
  (resolve: React.Dispatch<React.SetStateAction<AppState>>, reject) => {
    refreshContractState(resolve);
  }
);

// TODO: Move this into component?
const globalState = {
  loaded: false,
  potAmount: "",
  leader: "",
  leaderStartTime: undefined,
  leaderEndTime: undefined,
  myAddress: "",
};

const Header: React.FC = () => {
  const toast = useToast();
  const [state, setState] = useState<AppState>(globalState);
  const [isPressed, setIsPressed] = useState(false);

  const intervalRef = useRef<undefined | NodeJS.Timeout>();

  useEffect(() => {
    console.log("setting up interval");

    initialResolve.then(setState);
    intervalRef.current = setInterval(async () => {
      const hasUpdates = await checkRecentBlockForUpdates();
      if (hasUpdates) {
        refreshContractState(setState, toast);
      }
    }, 10 * 1000);
    return () => {
      console.log("removing interval");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [toast]);

  const leaderLink = getLink(
    state.leader,
    getTezBlockLinkForAddress(state.leader)
  );

  const content = state.loaded ? (
    <>
      <Heading as="h1" size="xl" fontWeight="semibold">
        TzButton
      </Heading>

      <Text opacity={0.7} fontSize="xl" mt="6">
        A social experiment on the Tezos blockchain.
      </Text>
      <Text fontSize="6xl">
        {!!state.leaderEndTime ? (
          <Countdown
            date={state.leaderEndTime}
            daysInHours={true}
            zeroPadTime={2}
          >
            <WinnerAnnouncement />
          </Countdown>
        ) : (
          "Loading..."
        )}
      </Text>

      <Square mt="6" onClick={participate}>
        <img
          style={{ cursor: "pointer" }}
          src={isPressed ? TzButtonPressed : TzButtonUnpressed}
          onMouseEnter={() => setIsPressed(true)}
          onMouseLeave={() => setIsPressed(false)}
          width="200px"
          height="200px"
          alt="TzButton - click to participate"
        />
      </Square>

      <Text mt="6">
        Click the button to become the <b>new leader</b> and reset the
        countdown.
      </Text>

      <Divider my={16} />
      <Text fontSize="3xl">
        Pot Size <Text as={"b"}>{state.potAmount} XTZ</Text>
      </Text>
      {state.leader === state.myAddress ? (
        <>
          <Text fontSize="6xl">
            You are the leader!{" "}
            <span role="img" aria-label="Leader">
              🥇
            </span>
          </Text>
          <Text fontSize="xl">{leaderLink}</Text>
        </>
      ) : (
        <Text fontSize="xl">
          <span role="img" aria-label="Leader">
            🥇{" "}
          </span>
          {leaderLink}
        </Text>
      )}

      <Container>
        <Button
          mr={2}
          mt={8}
          onClick={openTezBlock}
          colorScheme="blue"
          size="sm"
        >
          History
        </Button>
        <Button mt={8} onClick={openBetterCallDev} colorScheme="blue" size="sm">
          Contract
        </Button>
      </Container>
    </>
  ) : (
    <Box my={50}>Loading...</Box>
  );

  return (
    <Box mb={20}>
      <Box as="section" pt={24} pb={16}>
        <Container>
          <Box maxW="xl" mx="auto" textAlign="center">
            {content}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Header;
